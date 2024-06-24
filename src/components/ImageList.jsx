import { Loader } from "./Mode/Loader";
import { useContext, useEffect } from "react";
import Image from "./Image";
import ImagesContext from "../context/ImagesContext/ImagesContext";

const ImageList = () => {
  const { images, loading, FetchImages } =
    useContext(ImagesContext);

  useEffect(() => {
    FetchImages();
  }, []);

  if (loading) {
    return (
      <div className="m-auto">
        <Loader />
      </div>
    );
  } else {
    return (
      <div className="mt-8 grid grid-cols-4 gap-4 justify-center">
        {images.map((image) => (
          <Image image={image} key={image.id} />
        ))}
      </div>
    );
  }
};

export default ImageList;
