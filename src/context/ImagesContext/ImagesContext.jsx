import { createContext, useReducer, useRef, useState } from "react";
import ImagesReducer from "./ImagesReducer";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase.config";

const ImagesContext = createContext();

export const ImagesContextProvider = ({ children }) => {
  const [isSearchValid, setIsSearchValid] = useState(true);
  const enteredData = useRef("");

  const initializedImages = {
    image: {},
    images: [],
  };


  const [state, dispatch] = useReducer(ImagesReducer, initializedImages);

  async function FetchImages(id, pagin = 1) {
    try {
      const [res1, res2] = await Promise.all([
        fetch(
          `${process.env.REACT_APP_PIXABAY_URL}?key=${process.env.REACT_APP_PIXABAY_KEY}&q=wallpaper&per_page=30&image_type=photo&pretty=true`
        ).then((r) => r.json()).catch(() => ({ hits: [] })),
        fetch(
          `${process.env.REACT_APP_PIXABAY_URL}?key=${process.env.REACT_APP_PIXABAY_KEY}&q=photography+4k&per_page=30&image_type=photo&pretty=true`
        ).then((r) => r.json()).catch(() => ({ hits: [] })),
      ]);

      const hits1 = res1.hits || [];
      const hits2 = res2.hits || [];

      // Also fetch community uploads from Firestore
      let communityUploads = [];
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "images"), orderBy("timestamp", "desc"), limit(15))
        );
        querySnapshot.forEach((d) => {
          communityUploads.push({ id: d.id, ...d.data() });
        });
      } catch (err) {
        console.warn("Could not fetch community uploads:", err);
      }

      // Merge community uploads at the top with Pixabay hits
      const mergedArray = [...communityUploads, ...hits1, ...hits2];

      const startIndex = (pagin - 1) * 16;
      const paginatedSlice = mergedArray.slice(startIndex, startIndex + 16);

      if (id) {
        // If string ID, check if it's a Firestore upload
        if (typeof id === "string" && id.length > 10) {
          try {
            const docRef = doc(db, "images", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const uploadImg = { id: docSnap.id, ...docSnap.data() };
              const related = mergedArray.filter((img) => img.id !== id).slice(0, 8);
              dispatch({
                type: "GET_IMAGE",
                payload: [[uploadImg], related],
              });
              return;
            }
          } catch (e) {
            console.warn("Error fetching single uploaded doc:", e);
          }
        }

        const previewedImage = mergedArray.filter((image) => String(image.id) === String(id));
        const relatedImage = mergedArray.filter((image) => String(image.id) !== String(id)).slice(0, 8);

        dispatch({
          type: "GET_IMAGE",
          payload: [previewedImage, relatedImage],
        });
      } else {
        dispatch({
          type: "FETCH_IMAGES",
          payload: paginatedSlice.length > 0 ? paginatedSlice : mergedArray.slice(0, 16),
        });
      }
    } catch (err) {
      console.error("FetchImages error:", err);
    }
  }

  async function SearchImage(text, id, pagin = 1) {
    if (!text || text === "isFalse") {
      FetchImages(id, pagin);
      return;
    }

    try {
      const params = new URLSearchParams({
        q: text,
        image_type: "photo",
        pretty: "true",
        per_page: "40",
      });

      const response = await fetch(
        `${process.env.REACT_APP_PIXABAY_URL}?key=${process.env.REACT_APP_PIXABAY_KEY}&${params}`
      );
      const data = await response.json();
      const hits = data.hits || [];

      // Query community uploads matching tags
      let communityMatches = [];
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, "images"),
            where("tags", "array-contains", text.toLowerCase()),
            limit(10)
          )
        );
        querySnapshot.forEach((d) => {
          communityMatches.push({ id: d.id, ...d.data() });
        });
      } catch (err) {
        console.warn("Could not query matching community uploads:", err);
      }

      const combined = [...communityMatches, ...hits];

      if (combined.length === 0) {
        setIsSearchValid(false);
        localStorage.setItem("searchedData", "isFalse");
      } else {
        setIsSearchValid(true);
        const startIndex = (pagin - 1) * 16;
        const pageItems = combined.slice(startIndex, startIndex + 16);

        if (id) {
          if (typeof id === "string" && id.length > 10) {
            try {
              const docRef = doc(db, "images", id);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                const uploadImg = { id: docSnap.id, ...docSnap.data() };
                const related = combined.filter((img) => String(img.id) !== String(id)).slice(0, 8);
                dispatch({
                  type: "GET_IMAGE",
                  payload: [[uploadImg], related],
                });
                return;
              }
            } catch (e) {
              console.warn("Error fetching single doc:", e);
            }
          }

          const previewed = combined.filter((image) => String(image.id) === String(id));
          const related = combined.filter((image) => String(image.id) !== String(id)).slice(0, 8);

          dispatch({
            type: "GET_IMAGE",
            payload: [previewed.length > 0 ? previewed : [combined[0]], related],
          });
        } else {
          dispatch({
            type: "GET_IMAGES",
            payload: pageItems.length > 0 ? pageItems : combined.slice(0, 16),
          });
        }
      }
    } catch (err) {
      console.error("SearchImage error:", err);
      setIsSearchValid(false);
    }
  }

  // Search single image
  async function searchSingleImage(id, text) {
    if (typeof id === "string" && id.length > 10) {
      try {
        const docRef = doc(db, "images", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const uploadImg = { id: docSnap.id, ...docSnap.data() };
          const tagToSearch = Array.isArray(uploadImg.tags) ? uploadImg.tags[0] : "wallpaper";
          const res = await fetch(
            `${process.env.REACT_APP_PIXABAY_URL}?key=${process.env.REACT_APP_PIXABAY_KEY}&q=${encodeURIComponent(tagToSearch)}&image_type=photo&per_page=10`
          ).then((r) => r.json()).catch(() => ({ hits: [] }));

          dispatch({
            type: "GET_IMAGE",
            payload: [[uploadImg], res.hits || []],
          });
          return;
        }
      } catch (e) {
        console.warn("Error in searchSingleImage for upload:", e);
      }
    }

    if (!text || text === "isFalse") {
      FetchImages(id);
    } else {
      SearchImage(text, id);
    }
  }

  return (
    <ImagesContext.Provider
      value={{
        enteredData,
        isSearchValid,
        ...state,
        FetchImages,
        SearchImage,
        searchSingleImage,
      }}
    >
      {children}
    </ImagesContext.Provider>
  );
};

export default ImagesContext;
