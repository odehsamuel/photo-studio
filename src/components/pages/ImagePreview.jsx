import { NavLink } from "react-router-dom";
import { CameraLogo } from "../Mode/CameraLogo";
import chick from "../Mode/_g73df6e99215abe2cfd07359c9586141294b101fda48f200514e9c5ef48e71cbc7e8d589167e19a46e84b159ac379e10ce6f4cba3c6c82d003baecea327915664_640.jpg";
import { useContext, useState } from "react";
import ImagesContext from "../../context/ImagesContext/ImagesContext";
import Image from "../Image";

function ImagePreview() {
  const { images } = useContext(ImagesContext);
  const relatedImages = images.slice(0, 6);

  const [showDetails, setShowDetails] = useState(false);

  function handleChange() {}

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="bg-slate-50 w-screen h-screen px-4">
      <div className=" pt-2 mb-4 h-12 w-12">
        <NavLink to="/">
          <CameraLogo fill={"#c5c3c3"} />
        </NavLink>
        {/* <Header/> */}
      </div>
      <h3 className="font-bold text-2xl mb-4" style={{ color: "#c5c3c3" }}>
        Image Preview!
      </h3>
      <div className="flex items-center md:justify-evenly lg:justify-between">
        <div className="mx-8">
          <img
            src={chick}
            alt="image-preview"
            className="md:w-64 md:h-80 sm:w-40 sm:h-64 object-cover"
          />
        </div>
        <div className="justify-evenly sm:w-64 md:w-80 rounded-2xl py-6 border-2 shadow-md md:font-normal">
          <div className="md:flex my-4 px-6 justify-between">
            <div className="rounded-full border-2 py-2 px-2.5 md:w-32 sm:w-32 sm:mx-auto sm:text-sm text-center">
              <i className="fa fa-canva mr-2">Edit Image</i>
            </div>
            <div className="rounded-full border-2 py-2 px-2.5 md:w-32 sm:w-32 sm:mx-auto sm:text-sm text-center bg-green-500 text-slate-100">
              Download <i className="fa fa-arrow-down ml-2"></i>
            </div>
          </div>
          <hr className="text-slate-400" />
          <div className="flex my-4 items-center"></div>
          <ul className="px-6">
            <li className="flex justify-between">
              <p>Views</p>
              <p>234</p>
            </li>
            <li className="flex justify-between">
              <p>Downloads</p>
              <p>84</p>
            </li>
            {showDetails && (
              <>
                <li className="flex justify-between">
                  <p>Likes</p>
                  <p>57</p>
                </li>
                <li className="flex justify-between">
                  <p>Downloads</p>
                  <p>44</p>
                </li>
                <div>
                  <h3 className="text-sm font-semibold">Description</h3>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Consectetur provident repudiandae atque autem vitae fugit!
                  </p>
                </div>
              </>
            )}
            <p
              className="underline"
              onClick={() => setShowDetails(!showDetails)}
            >
              {!showDetails ? "Show Details" : "Minimize Details"}
            </p>
          </ul>
        </div>
      </div>
      <div className="flex flex-grow items-center pt-8 justify-items-center mx-12">
        {relatedImages.map((image) => (
          <Image image={image} key={image.id} />
        ))}
      </div>
    </div>
  );
}

export default ImagePreview;
