import { useContext, useEffect } from "react";
import Image from "./Image";
import ImagesContext from "../context/ImagesContext/ImagesContext";
import Pagination from "./Pagination";

const ImageList = () => {
  const { images, FetchImages } = useContext(ImagesContext);
  console.log(images.length);

  useEffect(() => {
    FetchImages();
  }, []);

  return (
    <div className="bg-black mx-auto pb-4">
      {images.length > 1 ? (
        <div className=" grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6 items-center pt-8 justify-items-center mx-12">
          {images.map((image) => (
            <Image image={image} key={image.id} />
          ))}
        </div>
      ) : (
        <div className="py-52 text-center">
          <h3 className="text-3xl text-rose-500 ">End of search</h3>
          <p className="text-slate-100">Try going back.</p>
        </div>
      )}
      <Pagination />
    </div>
  );
};

export default ImageList;
