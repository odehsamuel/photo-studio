import { createContext, useReducer, useRef, useState, useEffect } from "react";
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

const CURATED_DEFAULT_IMAGES = [
  {
    id: 10001,
    webformatURL: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    largeImageURL: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85",
    previewURL: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=70",
    tags: "mountains, landscape, sunrise, nature",
    user: "Nathan Anderson",
    likes: 342,
    downloads: 1205,
    comments: 18,
    views: 8940,
  },
  {
    id: 10002,
    webformatURL: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
    largeImageURL: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=85",
    previewURL: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=70",
    tags: "starry, galaxy, night sky, wallpaper",
    user: "Benjamin Davies",
    likes: 512,
    downloads: 2410,
    comments: 42,
    views: 14200,
  },
  {
    id: 10003,
    webformatURL: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    largeImageURL: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=85",
    previewURL: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=70",
    tags: "aurora, northern lights, green, nature",
    user: "Jonatan Pie",
    likes: 620,
    downloads: 3100,
    comments: 31,
    views: 18900,
  },
  {
    id: 10004,
    webformatURL: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80",
    largeImageURL: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=2000&q=85",
    previewURL: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=400&q=70",
    tags: "cyberpunk, city, night, neon, architecture",
    user: "Aleksandar Pasaric",
    likes: 429,
    downloads: 1840,
    comments: 26,
    views: 11200,
  },
  {
    id: 10005,
    webformatURL: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80",
    largeImageURL: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=2000&q=85",
    previewURL: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=400&q=70",
    tags: "forest, autumn, nature, trees",
    user: "Luca Bravo",
    likes: 388,
    downloads: 1540,
    comments: 19,
    views: 9800,
  },
  {
    id: 10006,
    webformatURL: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    largeImageURL: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85",
    previewURL: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=70",
    tags: "ocean, beach, tropical, sunset, travel",
    user: "Sean Oulashin",
    likes: 710,
    downloads: 3800,
    comments: 48,
    views: 22400,
  },
  {
    id: 10007,
    webformatURL: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    largeImageURL: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85",
    previewURL: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=70",
    tags: "architecture, skyscraper, modern, glass",
    user: "Sam Valadi",
    likes: 295,
    downloads: 980,
    comments: 14,
    views: 6700,
  },
  {
    id: 10008,
    webformatURL: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    largeImageURL: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=2000&q=85",
    previewURL: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=70",
    tags: "aurora borealis, night, ice, cold, landscape",
    user: "Vincent Guth",
    likes: 480,
    downloads: 2150,
    comments: 35,
    views: 13500,
  },
  {
    id: 10009,
    webformatURL: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
    largeImageURL: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=85",
    previewURL: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=70",
    tags: "desert, sand dunes, sunset, golden hour, landscape",
    user: "Jeremy Bishop",
    likes: 534,
    downloads: 2670,
    comments: 29,
    views: 15400,
  },
  {
    id: 10010,
    webformatURL: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    largeImageURL: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2000&q=85",
    previewURL: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=70",
    tags: "tokyo, rain, neon, japan, street, night",
    user: "Clay Banks",
    likes: 780,
    downloads: 4120,
    comments: 63,
    views: 24800,
  },
  {
    id: 10011,
    webformatURL: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    largeImageURL: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85",
    previewURL: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=70",
    tags: "alps, mountains, lake, reflection, peak, wilderness",
    user: "Luca Bravo",
    likes: 642,
    downloads: 3340,
    comments: 38,
    views: 19800,
  },
  {
    id: 10012,
    webformatURL: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80",
    largeImageURL: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=2000&q=85",
    previewURL: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=400&q=70",
    tags: "supercar, sports car, speed, night, automotive",
    user: "Samuele Errico",
    likes: 419,
    downloads: 1890,
    comments: 21,
    views: 12400,
  },
  {
    id: 10013,
    webformatURL: "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=800&q=80",
    largeImageURL: "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=2000&q=85",
    previewURL: "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=400&q=70",
    tags: "lion, wildlife, animal, portrait, safari, nature",
    user: "Zdeněk Macháček",
    likes: 890,
    downloads: 4890,
    comments: 54,
    views: 28900,
  },
  {
    id: 10014,
    webformatURL: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80",
    largeImageURL: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=2000&q=85",
    previewURL: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=400&q=70",
    tags: "fog, pine forest, road, autumn, moody, nature",
    user: "Thomas Kelley",
    likes: 455,
    downloads: 2010,
    comments: 24,
    views: 13900,
  },
  {
    id: 10015,
    webformatURL: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    largeImageURL: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=85",
    previewURL: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=70",
    tags: "minimalist, architecture, geometry, clean, modern",
    user: "Simone Hutsch",
    likes: 360,
    downloads: 1450,
    comments: 16,
    views: 8900,
  },
  {
    id: 10016,
    webformatURL: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80",
    largeImageURL: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=2000&q=85",
    previewURL: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=70",
    tags: "dew, water drop, macro, leaf, green, nature",
    user: "Aaron Burden",
    likes: 620,
    downloads: 3100,
    comments: 33,
    views: 17600,
  },
];

const PIXABAY_URL = (process.env.REACT_APP_PIXABAY_URL || "https://pixabay.com/api/").trim().replace(/['"]/g, "");
const PIXABAY_KEY = (process.env.REACT_APP_PIXABAY_KEY || "44230277-7dc0b8ae848d6c7d1a628a342").trim().replace(/['"]/g, "");

const ImagesContext = createContext();

export const ImagesContextProvider = ({ children }) => {
  const [isSearchValid, setIsSearchValid] = useState(true);
  const enteredData = useRef("");

  const initializedImages = {
    image: {},
    images: CURATED_DEFAULT_IMAGES,
  };

  const [state, dispatch] = useReducer(ImagesReducer, initializedImages);

  useEffect(() => {
    FetchImages();
  }, []);

  async function FetchImages(id, pagin = 1) {
    setIsSearchValid(true);
    try {
      const [res1, res2] = await Promise.all([
        fetch(
          `${PIXABAY_URL}?key=${PIXABAY_KEY}&q=wallpaper&per_page=40&image_type=photo&pretty=true`
        ).then((r) => r.json()).catch(() => ({ hits: [] })),
        fetch(
          `${PIXABAY_URL}?key=${PIXABAY_KEY}&q=photography+4k&per_page=40&image_type=photo&pretty=true`
        ).then((r) => r.json()).catch(() => ({ hits: [] })),
      ]);

      const hits1 = res1.hits || [];
      const hits2 = res2.hits || [];

      // Query only genuine, approved community uploads (filter out test screenshots/unapproved files)
      let approvedCommunity = [];
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "images"), orderBy("timestamp", "desc"), limit(25))
        );
        querySnapshot.forEach((d) => {
          const data = d.data();
          const url = data.webformatURL || data.previewURL || data.largeImageURL || "";
          const isValidPhoto =
            url.startsWith("http") &&
            !url.includes("photostudio.com") &&
            !url.includes(".mp3") &&
            !url.includes(".wav") &&
            data.status === "approved";

          if (isValidPhoto) {
            approvedCommunity.push({ id: d.id, ...data });
          }
        });
      } catch (err) {
        console.warn("Could not fetch community uploads:", err);
      }

      // Feature real, high-resolution Pixabay wallpapers first, then approved community photos
      const candidateList = [...hits1, ...hits2, ...approvedCommunity];

      // Deduplicate images by ID
      const seenIds = new Set();
      const uniqueRealImages = [];
      for (const img of candidateList) {
        const idKey = String(img.id);
        if (!seenIds.has(idKey)) {
          seenIds.add(idKey);
          uniqueRealImages.push(img);
        }
      }

      const mergedArray = uniqueRealImages.length > 0 ? uniqueRealImages : CURATED_DEFAULT_IMAGES;

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

        let previewedImage = mergedArray.filter((image) => String(image.id) === String(id));
        if (previewedImage.length === 0) {
          previewedImage = CURATED_DEFAULT_IMAGES.filter((image) => String(image.id) === String(id));
        }
        const relatedImage = mergedArray.filter((image) => String(image.id) !== String(id)).slice(0, 8);

        dispatch({
          type: "GET_IMAGE",
          payload: [
            previewedImage.length > 0 ? previewedImage : [mergedArray[0] || CURATED_DEFAULT_IMAGES[0]],
            relatedImage.length > 0 ? relatedImage : CURATED_DEFAULT_IMAGES.slice(1, 9),
          ],
        });
      } else {
        dispatch({
          type: "FETCH_IMAGES",
          payload: paginatedSlice.length > 0 ? paginatedSlice : mergedArray.slice(0, 16),
        });
      }
    } catch (err) {
      console.error("FetchImages error:", err);
      dispatch({
        type: "FETCH_IMAGES",
        payload: CURATED_DEFAULT_IMAGES,
      });
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

      const response = await fetch(`${PIXABAY_URL}?key=${PIXABAY_KEY}&${params}`);
      const data = await response.json();
      const hits = data.hits || [];

      // Query community uploads matching tags (only approved real photos)
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
          const data = d.data();
          const url = data.webformatURL || data.previewURL || data.largeImageURL || "";
          const isValidPhoto =
            url.startsWith("http") &&
            !url.includes("photostudio.com") &&
            !url.includes(".mp3") &&
            !url.includes(".wav") &&
            data.status === "approved";

          if (isValidPhoto) {
            communityMatches.push({ id: d.id, ...data });
          }
        });
      } catch (err) {
        console.warn("Could not query matching community uploads:", err);
      }

      // Real photography hits first, followed by approved community matches
      const combined = [...hits, ...communityMatches];

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

          let previewed = combined.filter((image) => String(image.id) === String(id));
          if (previewed.length === 0) {
            previewed = CURATED_DEFAULT_IMAGES.filter((image) => String(image.id) === String(id));
          }
          const related = combined.filter((image) => String(image.id) !== String(id)).slice(0, 8);

          dispatch({
            type: "GET_IMAGE",
            payload: [
              previewed.length > 0 ? previewed : [combined[0] || CURATED_DEFAULT_IMAGES[0]],
              related.length > 0 ? related : CURATED_DEFAULT_IMAGES.slice(1, 9),
            ],
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
            `${PIXABAY_URL}?key=${PIXABAY_KEY}&q=${encodeURIComponent(tagToSearch)}&image_type=photo&per_page=10`
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

    // Check curated default images first if numerical ID matches
    const curatedMatch = CURATED_DEFAULT_IMAGES.find((img) => String(img.id) === String(id));
    if (curatedMatch) {
      const related = CURATED_DEFAULT_IMAGES.filter((img) => String(img.id) !== String(id));
      dispatch({
        type: "GET_IMAGE",
        payload: [[curatedMatch], related],
      });
      return;
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
        setIsSearchValid,
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
