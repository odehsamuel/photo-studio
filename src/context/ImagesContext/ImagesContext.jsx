import { createContext, useReducer } from "react";
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
import { useParams } from "react-router-dom";

const ImagesContext = createContext();

export const ImagesContextProvider = ({ children }) => {
  const initializedImages = {
    image: {},
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
    // const singleImage = mergedArray.filter((image) => image.id == 8932966)

    dispatch({
      type: "FETCH_IMAGES",
      payload: shuffledArray,
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
    // const previedImage = newImages.filter((image) => image.id === id);
    // const relatedImage = shuffledArray.filter((image) => image.id !== text).slice(0, 7);


    dispatch({
      type: "GET_IMAGES",
      payload: shuffledArray,
    });
  }

  //search single image
  async function searchSingleImage(text) {
    const response1 = fetch(
      `${process.env.REACT_APP_PIXABAY_URL}?key=${process.env.REACT_APP_PIXABAY_KEY}`
    ).then((response) => response.json());
    const response2 = fetch(
      `${process.env.REACT_APP_PIXABAY_URL}?key=${process.env.REACT_APP_PIXABAY_KEY}&q=wallpaper&image_type=photo&pretty=true`
    ).then((response) => response.json());

    const [data1, data2] = await Promise.all([response1, response2]);
    const dataHits  = data1["hits"];
    const secondArray = data2["hits"];

    const mergedArray = dataHits.concat(secondArray);

    
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

    const previedImage = mergedArray.filter((image) => image.id === text);
    const relatedImage = shuffledArray.filter((image) => image.id !== text).slice(0, 7);
    // console.log(previedImage)
    // const response = await fetch(
    //   `${process.env.REACT_APP_PIXABAY_URL}?key=${process.env.REACT_APP_PIXABAY_KEY}&${text}&image_type=photo&pretty=true`
    // );

    
    // const { hits } = await response.json();

    // let images = [];
    // const docRef = doc(db, "images", text);
    // const docSnap = await getDoc(docRef);
    // if(docSnap.exists()){
    //   const fimage = docSnap.data()

    //   dispatch({
    //     type: "GET_IMAGE",
    //     payload: fimage,
    //   });
    // }
    // const querySnapshot = await getDocs(query(collection(db, "images"), or( where("tags","array-contains",`${text}`), where(`${text}`,"in", "description")), orderBy("timestamp", "desc"), limit(10)));
    // querySnapshot.forEach((doc) => {
    //   images.push({
    //     id: doc.id,
    //     ...doc.data(),
    //   });
    // });
    // const newImages = [...images, ...hits];

    // function shuffleArray(newImages) {
    //   for (let i = newImages.length - 1; i > 0; i--) {
    //     // Generate a random index from 0 to i
    //     const j = Math.floor(Math.random() * (i + 1));
    //     // Swap elements array[i] and array[j]
    //     [newImages[i], newImages[j]] = [newImages[j], newImages[i]];
    //   }
    //   return newImages;
    // }

    // const shuffledArray = shuffleArray([...newImages]);

    dispatch({
      type: "GET_IMAGE",
      payload: [previedImage, relatedImage],
    });
  }

  return (
    <ImagesContext.Provider
      value={{
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
