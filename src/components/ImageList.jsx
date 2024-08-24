import { useContext, useEffect } from "react";
import Image from "./Image";
import ImagesContext from "../context/ImagesContext/ImagesContext";
import Pagination from "./Pagination";

const ImageList = () => {
  const { images, FetchImages } = useContext(ImagesContext);
  const newImages = images.slice(0, 16);

  useEffect(() => {
    FetchImages();
  }, []);

  return (
    <div className="bg-black mx-auto pb-4">
      {images.length > 1 ? (
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6 items-center pt-8 justify-items-center mx-4">
          {newImages.map((image) => (
            <Image image={image} key={image.id} />
          ))}
        </div>
      ) : (
        <div className="py-52 text-center">
          <h3 className="text-3xl text-rose-500 ">No image here.</h3>
          <p className="text-slate-100">Try going back.</p>
        </div>
      )}
      <Pagination />
    </div>
  );
};

export default ImageList;
