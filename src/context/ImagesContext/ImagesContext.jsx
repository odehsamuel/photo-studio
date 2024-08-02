import { createContext, useReducer } from "react";
import ImagesReducer from "./ImagesReducer";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase.config";

const ImagesContext = createContext();

export const ImagesContextProvider = ({ children }) => {
  const initializedImages = {
    images: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(ImagesReducer, initializedImages);

  async function FetchImages() {
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

    const shuffledArray = shuffleArray([...mergedArray]);
    const count = shuffledArray.slice(0, 16);

    dispatch({
      type: "FETCH_IMAGES",
      payload: count,
    });
  }

  async function SearchImage(text) {
    const params = new URLSearchParams({
      q: text,
    });

    const response = await fetch(
      `${process.env.REACT_APP_PIXABAY_URL}?key=${process.env.REACT_APP_PIXABAY_KEY}&${params}&image_type=photo&pretty=true`
    );

    const { hits } = await response.json();

    let images = [];
    const querySnapshot = await getDocs(
      query(
        collection(db, "images"),
        where("tags", "array-contains", `${text}`),
        orderBy("timestamp", "desc"),
        limit(10)
      )
    );
    // const querySnapshot = await getDocs(query(collection(db, "images"), or( where("tags","array-contains",`${text}`), where(`${text}`,"in", "description")), orderBy("timestamp", "desc"), limit(10)));
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

    const shuffledArray = shuffleArray([...newImages]);

    dispatch({
      type: "GET_IMAGES",
      payload: shuffledArray,
    });
  }

  return (
    <ImagesContext.Provider
      value={{
        ...state,
        FetchImages,
        SearchImage,
      }}
    >
      {children}
    </ImagesContext.Provider>
  );
};

export default ImagesContext;
