import { Loader } from "./Mode/Loader";
import { useContext, useEffect } from "react";
import Image from "./Image";
import ImagesContext from "../context/ImagesContext/ImagesContext";

const ImageList = () => {
  const { images, loading, FetchImages } = useContext(ImagesContext);

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
      <div className="absolute top-96 mx-auto">
        <div className=" grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6 items-center pt-8 justify-items-center mx-12">
          {images.map((image) => (
            <Image image={image} key={image.id} />
          ))}
        </div>
        <ul className="flex py-0.5 px-1 bg-rose-300 w-24 ml-auto mr-4 rounded-md items-center justify-items-center">
          <li className="px-1">1</li>
          <li className="px-1">2</li>
          <li className="px-1">3</li>
          <li className="px-1">4</li>
          <i class="fa fa-arrow-right" aria-hidden="true"></i>
        </ul>
      </div>
    );
  }
};

export default ImageList;
