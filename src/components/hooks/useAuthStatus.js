import { useEffect, useRef, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../../firebase.config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const auth = getAuth();

    // Fast fallback timer so auth loading never blocks UI
    const timer = setTimeout(() => {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }, 1500);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(timer);
      if (!isMounted.current) return;

      if (user && user.uid) {
        setLoggedIn(true);
        setIsLoading(false);

        // Ensure user document exists in Firestore in background
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            await setDoc(
              docRef,
              {
                name: user.displayName || user.email?.split("@")[0] || "Studio Member",
                email: user.email || "",
                timestamp: serverTimestamp(),
                likedImages: [],
                likedImageIds: [],
                isAdmin: false,
              },
              { merge: true }
            );
          }
        } catch (err) {
          console.warn("Background user profile sync warning:", err);
        }
      } else {
        setLoggedIn(false);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted.current = false;
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const handleClick = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setLoggedIn(false);
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  return { loggedIn, setLoggedIn, isLoading, handleClick };
};
