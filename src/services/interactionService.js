import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  limit,
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";

// Local storage cache keys
const STATS_KEY = "lumina_image_stats";
const USER_LIKES_KEY = "lumina_user_likes";
const COMMENTS_KEY = "lumina_image_comments";

// Helper to get local cache
const getLocalMap = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

const setLocalMap = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Local storage error:", e);
  }
};

/**
 * Get stats for an image (likes, downloads, comments, and whether current user liked it)
 */
export async function fetchImageStats(imageId, defaultLikes = 0, defaultDownloads = 0, defaultComments = 0, currentUserId = null) {
  const idStr = String(imageId);
  const localStats = getLocalMap(STATS_KEY)[idStr] || {};
  const userLikesMap = currentUserId ? getLocalMap(`${USER_LIKES_KEY}_${currentUserId}`) : {};
  const isLikedLocally = Boolean(userLikesMap[idStr]);

  let result = {
    likes: localStats.likes !== undefined ? localStats.likes : defaultLikes,
    downloads: localStats.downloads !== undefined ? localStats.downloads : defaultDownloads,
    comments: localStats.comments !== undefined ? localStats.comments : defaultComments,
    isLiked: isLikedLocally,
  };

  try {
    const docRef = doc(db, "image_interactions", idStr);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      const likedBy = Array.isArray(data.likedBy) ? data.likedBy : [];
      const isLiked = currentUserId ? likedBy.includes(currentUserId) : isLikedLocally;

      result = {
        likes: typeof data.likesCount === "number" ? data.likesCount : (defaultLikes + (data.likesBonus || 0)),
        downloads: typeof data.downloadsCount === "number" ? data.downloadsCount : (defaultDownloads + (data.downloadsBonus || 0)),
        comments: typeof data.commentsCount === "number" ? data.commentsCount : defaultComments,
        isLiked,
      };

      // Update local cache with remote ground truth
      const allStats = getLocalMap(STATS_KEY);
      allStats[idStr] = {
        likes: result.likes,
        downloads: result.downloads,
        comments: result.comments,
      };
      setLocalMap(STATS_KEY, allStats);

      if (currentUserId) {
        userLikesMap[idStr] = isLiked;
        setLocalMap(`${USER_LIKES_KEY}_${currentUserId}`, userLikesMap);
      }
    }
  } catch (err) {
    console.warn("Could not fetch remote image stats, using cached stats:", err);
  }

  return result;
}

/**
 * Toggle like on an image
 */
export async function toggleLike(image, currentUser) {
  const imageId = String(image.id);
  const userId = currentUser?.uid;

  // Read current stats from cache
  const allStats = getLocalMap(STATS_KEY);
  const currentStats = allStats[imageId] || {
    likes: Number(image.likes) || 0,
    downloads: Number(image.downloads) || 0,
    comments: Number(image.comments) || 0,
  };

  let userLikesMap = userId ? getLocalMap(`${USER_LIKES_KEY}_${userId}`) : getLocalMap("guest_likes");
  const wasLiked = Boolean(userLikesMap[imageId]);
  const newIsLiked = !wasLiked;
  const newLikesCount = Math.max(0, currentStats.likes + (newIsLiked ? 1 : -1));

  // Update local cache immediately (optimistic UI)
  allStats[imageId] = {
    ...currentStats,
    likes: newLikesCount,
  };
  setLocalMap(STATS_KEY, allStats);

  userLikesMap[imageId] = newIsLiked;
  if (userId) {
    setLocalMap(`${USER_LIKES_KEY}_${userId}`, userLikesMap);
  } else {
    setLocalMap("guest_likes", userLikesMap);
  }

  // Sync to Firestore
  try {
    const docRef = doc(db, "image_interactions", imageId);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      await setDoc(docRef, {
        imageId,
        likesCount: newLikesCount,
        downloadsCount: currentStats.downloads,
        commentsCount: currentStats.comments,
        likedBy: userId && newIsLiked ? [userId] : [],
        lastUpdated: serverTimestamp(),
      });
    } else {
      await setDoc(
        docRef,
        {
          likesCount: increment(newIsLiked ? 1 : -1),
          likedBy: userId
            ? newIsLiked
              ? arrayUnion(userId)
              : arrayRemove(userId)
            : snap.data().likedBy || [],
          lastUpdated: serverTimestamp(),
        },
        { merge: true }
      );
    }

    // If it's a user upload in the `images` collection, also sync `likes`
    if (typeof image.id === "string") {
      try {
        const uploadRef = doc(db, "images", image.id);
        await updateDoc(uploadRef, {
          likes: newLikesCount,
        });
      } catch (e) {
        // Ignored if not found
      }
    }

    // Save to user's profile liked images list
    if (userId) {
      try {
        const userDocRef = doc(db, "users", userId);
        const imageSummary = {
          id: imageId,
          webformatURL: image.webformatURL || image.previewURL,
          previewURL: image.previewURL || image.webformatURL,
          tags: image.tags || "",
        };

        if (newIsLiked) {
          await setDoc(
            userDocRef,
            {
              likedImages: arrayUnion(imageSummary),
              likedImageIds: arrayUnion(imageId),
            },
            { merge: true }
          );
        } else {
          await setDoc(
            userDocRef,
            {
              likedImageIds: arrayRemove(imageId),
            },
            { merge: true }
          );
        }
      } catch (userErr) {
        console.warn("Could not sync user profile likedImages:", userErr);
      }
    }
  } catch (err) {
    console.error("Error syncing like to Firestore:", err);
  }

  return {
    isLiked: newIsLiked,
    likesCount: newLikesCount,
  };
}

/**
 * Record a download for an image
 */
export async function trackDownload(image) {
  const imageId = String(image.id);
  const allStats = getLocalMap(STATS_KEY);
  const currentStats = allStats[imageId] || {
    likes: Number(image.likes) || 0,
    downloads: Number(image.downloads) || 0,
    comments: Number(image.comments) || 0,
  };

  const newDownloadsCount = currentStats.downloads + 1;

  // Optimistic local update
  allStats[imageId] = {
    ...currentStats,
    downloads: newDownloadsCount,
  };
  setLocalMap(STATS_KEY, allStats);

  // Sync to Firestore
  try {
    const docRef = doc(db, "image_interactions", imageId);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      await setDoc(docRef, {
        imageId,
        likesCount: currentStats.likes,
        downloadsCount: newDownloadsCount,
        commentsCount: currentStats.comments,
        likedBy: [],
        lastUpdated: serverTimestamp(),
      });
    } else {
      await setDoc(
        docRef,
        {
          downloadsCount: increment(1),
          lastUpdated: serverTimestamp(),
        },
        { merge: true }
      );
    }

    // If it's a user upload in `images` collection
    if (typeof image.id === "string") {
      try {
        const uploadRef = doc(db, "images", image.id);
        await updateDoc(uploadRef, {
          downloads: newDownloadsCount,
        });
      } catch (e) {
        // Ignored
      }
    }
  } catch (err) {
    console.error("Error updating download in Firestore:", err);
  }

  return newDownloadsCount;
}

/**
 * Fetch comments for an image
 */
export async function fetchComments(imageId) {
  const idStr = String(imageId);
  const localComments = getLocalMap(COMMENTS_KEY)[idStr] || [];

  try {
    const commentsCol = collection(db, "image_comments");
    const q = query(
      commentsCol,
      where("imageId", "==", idStr),
      limit(50)
    );
    const snap = await getDocs(q);

    const remoteComments = [];
    snap.forEach((d) => {
      remoteComments.push({
        id: d.id,
        ...d.data(),
      });
    });

    // Sort by createdAt descending
    remoteComments.sort((a, b) => {
      const timeA = new Date(a.createdAt || a.timestamp || 0).getTime();
      const timeB = new Date(b.createdAt || b.timestamp || 0).getTime();
      return timeB - timeA;
    });

    if (remoteComments.length > 0) {
      const allComments = getLocalMap(COMMENTS_KEY);
      allComments[idStr] = remoteComments;
      setLocalMap(COMMENTS_KEY, allComments);
      return remoteComments;
    }
  } catch (err) {
    console.warn("Could not fetch remote comments, returning local cache:", err);
  }

  return localComments;
}

/**
 * Post a new comment
 */
export async function postComment(image, currentUser, commentText) {
  if (!commentText || !commentText.trim()) return null;

  const imageId = String(image.id);
  const trimmed = commentText.trim();
  const userName = currentUser?.displayName || currentUser?.email?.split("@")[0] || "Anonymous Photographer";
  const userId = currentUser?.uid || "guest";
  const userEmail = currentUser?.email || "";

  const newComment = {
    id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    imageId,
    userId,
    userName,
    userEmail,
    text: trimmed,
    createdAt: new Date().toISOString(),
  };

  // Optimistic update in local cache
  const allComments = getLocalMap(COMMENTS_KEY);
  const list = allComments[imageId] || [];
  allComments[imageId] = [newComment, ...list];
  setLocalMap(COMMENTS_KEY, allComments);

  // Update comments count in stats
  const allStats = getLocalMap(STATS_KEY);
  const currentStats = allStats[imageId] || {
    likes: Number(image.likes) || 0,
    downloads: Number(image.downloads) || 0,
    comments: Number(image.comments) || 0,
  };
  const newCommentsCount = currentStats.comments + 1;
  allStats[imageId] = {
    ...currentStats,
    comments: newCommentsCount,
  };
  setLocalMap(STATS_KEY, allStats);

  // Sync to Firestore
  try {
    const docData = {
      imageId,
      userId,
      userName,
      userEmail,
      text: trimmed,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp(),
    };

    const added = await addDoc(collection(db, "image_comments"), docData);
    newComment.id = added.id;

    // Update stats document
    const statsRef = doc(db, "image_interactions", imageId);
    const snap = await getDoc(statsRef);
    if (!snap.exists()) {
      await setDoc(statsRef, {
        imageId,
        likesCount: currentStats.likes,
        downloadsCount: currentStats.downloads,
        commentsCount: newCommentsCount,
        likedBy: [],
        lastUpdated: serverTimestamp(),
      });
    } else {
      await setDoc(
        statsRef,
        {
          commentsCount: increment(1),
          lastUpdated: serverTimestamp(),
        },
        { merge: true }
      );
    }

    // If uploaded image, update `images` collection
    if (typeof image.id === "string") {
      try {
        const uploadRef = doc(db, "images", image.id);
        await updateDoc(uploadRef, {
          comments: newCommentsCount,
        });
      } catch (e) {
        // Ignored
      }
    }
  } catch (err) {
    console.error("Error posting comment to Firestore:", err);
  }

  return {
    comment: newComment,
    commentsCount: newCommentsCount,
  };
}

/**
 * Delete a comment (by creator)
 */
export async function deleteComment(commentId, imageId) {
  const idStr = String(imageId);

  // Remove from local cache
  const allComments = getLocalMap(COMMENTS_KEY);
  if (allComments[idStr]) {
    allComments[idStr] = allComments[idStr].filter((c) => c.id !== commentId);
    setLocalMap(COMMENTS_KEY, allComments);
  }

  // Decrement comments count
  const allStats = getLocalMap(STATS_KEY);
  if (allStats[idStr]) {
    allStats[idStr].comments = Math.max(0, (allStats[idStr].comments || 1) - 1);
    setLocalMap(STATS_KEY, allStats);
  }

  try {
    if (!commentId.startsWith("local_")) {
      await deleteDoc(doc(db, "image_comments", commentId));
      const statsRef = doc(db, "image_interactions", idStr);
      await setDoc(
        statsRef,
        {
          commentsCount: increment(-1),
        },
        { merge: true }
      );
    }
  } catch (err) {
    console.error("Error deleting comment in Firestore:", err);
  }
}

/**
 * Fetch all images liked by current user
 */
export async function fetchUserLikedImages(userId) {
  if (!userId) return [];
  const localMap = getLocalMap(`${USER_LIKES_KEY}_${userId}`);
  const likedIds = Object.keys(localMap).filter((id) => localMap[id]);

  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      if (Array.isArray(data.likedImages) && data.likedImages.length > 0) {
        return data.likedImages;
      }
    }
  } catch (err) {
    console.warn("Could not fetch remote user liked images:", err);
  }

  return likedIds.map((id) => ({ id }));
}
