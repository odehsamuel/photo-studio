import { useContext, useEffect } from "react";
import Image from "./Image";
import ImagesContext from "../context/ImagesContext/ImagesContext";
import Pagination from "./Pagination";

const ImageList = () => {
  const { images, FetchImages } = useContext(ImagesContext);

  useEffect(() => {
    FetchImages();
  }, []);

  const counts = images.slice(0, 16);

  return (
    <div className="bg-black mx-auto pb-4">
      <div className=" grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6 items-center pt-8 justify-items-center mx-12">
        {counts.map((image) => (
          <Image image={image} key={image.id} />
        ))}
      </div>
      <Pagination />
    </div>
  );
};

export default ImageList;
