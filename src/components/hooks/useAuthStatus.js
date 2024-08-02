import { useEffect, useRef, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebase.config";
import { doc, getDoc } from "firebase/firestore";

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const auth = getAuth();

  useEffect(() => {
    if (isMounted) {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user && user.uid) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setIsLoading(false);
            setLoggedIn(true);
          } else {
            setIsLoading(false);
            setLoggedIn(false);
          }
        } else {
          setIsLoading(false);
          setLoggedIn(false);
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
  }, [isMounted, auth]);

  const handleClick = () => {
    setLoggedIn(false);
    auth.signOut();
  };

  return { loggedIn, isLoading, handleClick };
};
