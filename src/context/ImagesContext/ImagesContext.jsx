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

  async function FetchImages(id, pagin) {
    const response1 = fetch(
      `${process.env.REACT_APP_PIXABAY_URL}?key=${process.env.REACT_APP_PIXABAY_KEY}`
    ).then((response) => response.json());
    const response2 = fetch(
      `${process.env.REACT_APP_PIXABAY_URL}?key=${process.env.REACT_APP_PIXABAY_KEY}&q=wallpaper&image_type=photo&pretty=true`
    ).then((response) => response.json());

    const [data1, data2] = await Promise.all([response1, response2]);
    const { hits } = data1;
    const secondArray = data2["hits"];

    const mergedArray = hits.concat(secondArray);

    function shuffleArray(mergedArray) {
      for (let i = mergedArray.length - 1; i > 0; i--) {
        // Generate a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements array[i] and array[j]
        [mergedArray[i], mergedArray[j]] = [mergedArray[j], mergedArray[i]];
      }
      return mergedArray;
    }

    let counts = mergedArray.slice(0, 16);
    let shuffledArray = shuffleArray([...counts]);
    if (pagin === 1) {
      counts = mergedArray.slice(0, 16);
      shuffledArray = shuffleArray([...counts]);
    } else if (pagin === 2) {
      counts = mergedArray.slice(16, 32);
      shuffledArray = shuffleArray([...counts]);
    } else if (pagin === 3) {
      counts = mergedArray.slice(32, 48);
      shuffledArray = shuffleArray([...counts]);
    }
    if (id) {
      const previedImage = mergedArray.filter((image) => image.id === id);

      const relatedImage = mergedArray
        .filter((image) => image.id !== id)
        .slice(0, 7);

      dispatch({
        type: "GET_IMAGE",
        payload: [previedImage, relatedImage],
      });
    } else {
      dispatch({
        type: "FETCH_IMAGES",
        payload: shuffledArray,
      });
    }
  }

  async function SearchImage(text, id, pagin) {
    const params = new URLSearchParams({
      q: text,
    });

    const response = await fetch(
      `${process.env.REACT_APP_PIXABAY_URL}?key=${process.env.REACT_APP_PIXABAY_KEY}&${params}&image_type=photo&pretty=true`
    );

    const { hits } = await response.json();

    if (hits.length === 0) {
      setIsSearchValid(false);
      localStorage.setItem("searchedData", "isFalse");
    } else {
      setIsSearchValid(true);
      let images = [];
      const querySnapshot = await getDocs(
        query(
          collection(db, "images"),
          where("tags", "array-contains", `${text}`),
          orderBy("timestamp", "desc"),
          limit(10)
        )
      );
      querySnapshot.forEach((doc) => {
        images.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      const newImages = [...images, ...hits];

      function shuffleArray(newImages) {
        for (let i = newImages.length - 1; i > 0; i--) {
          // Generate a random index from 0 to i
          const j = Math.floor(Math.random() * (i + 1));
          // Swap elements array[i] and array[j]
          [newImages[i], newImages[j]] = [newImages[j], newImages[i]];
        }
        return newImages;
      }

      let counts = newImages.slice(0, 16);
      let shuffledArray = shuffleArray([...counts]);
      if (pagin === 1) {
        counts = newImages.slice(0, 16);
        shuffledArray = shuffleArray([...counts]);
      } else if (pagin === 2) {
        counts = newImages.slice(16, 32);
        shuffledArray = shuffleArray([...counts]);
      } else if (pagin === 3) {
        counts = newImages.slice(32, 48);
        shuffledArray = shuffleArray([...counts]);
      }
      if (id) {
        const relatedImage = newImages
        .filter((image) => image.id !== id)
        .slice(0, 7);
        const shuffledArray = shuffleArray([...relatedImage]);
        if (typeof id === "string") {
          const docRef = doc(db, "images", id);
          getDoc(docRef).then((doc) => {
            dispatch({
              type: "GET_IMAGE",
              payload: [[doc.data()], shuffledArray],
            });
          });
        } else {
          const previedImage = hits.filter((image) => image.id === id);
          dispatch({
            type: "GET_IMAGE",
            payload: [previedImage, shuffledArray],
          });
        }
      } else {
        dispatch({
          type: "GET_IMAGES",
          payload: counts,
        });
      }
    }
  }

  //search single image
  async function searchSingleImage(id, text) {
    if (text === "isFalse") {
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
