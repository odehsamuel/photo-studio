import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { db } from "../../firebase.config";
import { Loader } from "../Mode/Loader";
import Header from "../Header";
import Footer from "../Footer";
import Image from "../Image";
import { fetchUserLikedImages } from "../../services/interactionService";

const Account = () => {
  const [uploads, setUploads] = useState([]);
  const [likedImages, setLikedImages] = useState([]);
  const [activeTab, setActiveTab] = useState("likes"); // 'likes' or 'uploads'
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Load uploads and liked images safely inside useEffect
  useEffect(() => {
    if (!currentUser) return;

    let unsubscribe = () => {};

    const loadData = async () => {
      setLoading(true);

      // Check admin status once safely
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists() && userDoc.data().isAdmin === true) {
          setIsAdmin(true);
        }
      } catch (e) {
        console.warn("Could not check admin status:", e);
      }

      // Fetch liked images
      try {
        const liked = await fetchUserLikedImages(currentUser.uid);
        setLikedImages(liked || []);
      } catch (e) {
        console.warn("Could not load liked images:", e);
      }

      // Listen to user uploads
      try {
        const q = query(
          collection(db, "images"),
          where("userRef", "==", currentUser.uid),
          orderBy("timestamp", "desc")
        );

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const userImgs = [];
            snapshot.forEach((docSnap) => {
              userImgs.push({ id: docSnap.id, ...docSnap.data() });
            });
            setUploads(userImgs);
            setLoading(false);
          },
          (err) => {
            console.warn("Uploads listener error:", err);
            setLoading(false);
          }
        );
      } catch (err) {
        console.warn("Error subscribing to uploads:", err);
        setLoading(false);
      }
    };

    loadData();

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.uid]);

  // Handle Delete Upload
  const handleDeleteUpload = async (img) => {
    if (!window.confirm("Are you sure you want to delete this upload?")) return;

    try {
      // Delete document from Firestore
      await deleteDoc(doc(db, "images", img.id));

      // Attempt to delete from storage if storage path exists
      if (img.storagePath) {
        try {
          const storage = getStorage();
          const storageRef = ref(storage, img.storagePath);
          await deleteObject(storageRef);
        } catch (storageErr) {
          // Non-critical
        }
      }

      setUploads((prev) => prev.filter((item) => item.id !== img.id));
      toast.success("Image deleted successfully", { theme: "dark" });
    } catch (err) {
      toast.error("Failed to delete image, please try again", { theme: "dark" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader fill="#10b981" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Loading your studio profile...
        </p>
      </div>
    );
  }

  const initial = (currentUser?.displayName || currentUser?.email || "U")[0].toUpperCase();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 flex-1 w-full">
        {/* Profile Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-extrabold text-slate-950 text-3xl shadow-xl shadow-emerald-500/20">
              {initial}
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {currentUser?.displayName || "Studio Member"}
                </h1>
                {isAdmin && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 mt-0.5">{currentUser?.email}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 justify-center sm:justify-start">
                <span>
                  <strong className="text-white">{likedImages.length}</strong> Saved Likes
                </span>
                <span>•</span>
                <span>
                  <strong className="text-white">{uploads.length}</strong> Uploads
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/image-upload"
              className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Upload Wallpaper
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-colors"
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 pb-6 border-b border-slate-800 mb-8">
          <button
            onClick={() => setActiveTab("likes")}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 border ${
              activeTab === "likes"
                ? "bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-md"
                : "bg-slate-900/80 text-slate-400 hover:text-white border-slate-800"
            }`}
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>My Liked Wallpapers</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {likedImages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("uploads")}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 border ${
              activeTab === "uploads"
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-md"
                : "bg-slate-900/80 text-slate-400 hover:text-white border-slate-800"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>My Uploads</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {uploads.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Liked Wallpapers */}
        {activeTab === "likes" && (
          <div>
            {likedImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                {likedImages.map((img) => (
                  <Image image={img} key={img.id} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 max-w-lg mx-auto">
                <span className="text-4xl block mb-3">❤️</span>
                <h3 className="text-lg font-bold text-white mb-1">No liked wallpapers yet</h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-xs mx-auto">
                  Browse through thousands of wallpapers and click the heart icon to curate your personal collection.
                </p>
                <Link
                  to="/"
                  className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all inline-block"
                >
                  Explore Wallpapers
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Uploads */}
        {activeTab === "uploads" && (
          <div>
            {uploads.length > 0 ? (
              <div className="space-y-3">
                {uploads.map((img) => (
                  <div
                    key={img.id}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-14 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-800">
                        <img
                          src={img.webformatURL || img.previewURL}
                          alt="upload thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-white">
                            {Array.isArray(img.tags) ? img.tags.join(", ") : img.tags || "Wallpaper"}
                          </h4>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                              img.status === "approved"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : img.status === "denied"
                                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                            }`}
                          >
                            {img.status || "Live"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                          <span>❤️ {img.likes || 0} likes</span>
                          <span>⬇️ {img.downloads || 0} downloads</span>
                          <span>💬 {img.comments || 0} comments</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/image-preview/${encodeURIComponent(Array.isArray(img.tags) ? img.tags[0] : "wallpaper")}/${img.id}`}
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                        title="View photo"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>

                      <button
                        onClick={() => handleDeleteUpload(img)}
                        className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Delete photo"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 max-w-lg mx-auto">
                <span className="text-4xl block mb-3">📸</span>
                <h3 className="text-lg font-bold text-white mb-1">No uploads yet</h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-xs mx-auto">
                  Have stunning photography or wallpapers to share with the community? Upload them to Lumina Studio!
                </p>
                <Link
                  to="/image-upload"
                  className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all inline-block"
                >
                  Upload Your First Wallpaper
                </Link>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Account;
