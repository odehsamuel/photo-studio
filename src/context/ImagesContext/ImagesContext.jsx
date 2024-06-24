import { createContext, useReducer } from "react";
import ImagesReducer from "./ImagesReducer";

const ImagesContext = createContext();

export const ImagesContextProvider = ({ children }) => {
  const initializedImages = {
    images: [],
    loading: false,
  }

  const [state, dispatch] = useReducer(ImagesReducer, initializedImages)

  async function FetchImages() {
    const response = await fetch(`${process.env.REACT_APP_PIXABAY_URL}?key=${process.env.REACT_APP_PIXABAY_KEY}`)

    const {hits} = await response.json()
    console.log(hits)

    dispatch({
      type: "FETCH_IMAGES",
      payload: hits
    })
  }


  async function SearchImage(text) {
    const params = new URLSearchParams({
      q: text,
    });

    const response = await fetch(
      `${process.env.REACT_APP_PIXABAY_URL}?key=${process.env.REACT_APP_PIXABAY_KEY}&${params}&image_type=photo&pretty=true`
    );

    const {hits} = await response.json();
    console.log(hits);

    dispatch({
      type: "GET_IMAGES",
      payload: hits
    })
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
