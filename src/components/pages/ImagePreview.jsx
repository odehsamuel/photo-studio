import { NavLink, useParams } from "react-router-dom";
import { saveAs } from "file-saver";
import { CameraLogo } from "../Mode/CameraLogo";
import canva from "../Mode/icons8-canva-48.png";
import { useContext, useEffect, useState } from "react";
import ImagesContext from "../../context/ImagesContext/ImagesContext";
import Image from "../Image";
import Footer from "../Footer";
import Header from "../Header";
import { db } from "../../firebase.config";
import { doc, updateDoc } from "firebase/firestore";

function ImagePreview() {
  const date = new Date().getFullYear();
  const { images } = useContext(ImagesContext);
  const [showDetails, setShowDetails] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const relatedImages = images.slice(0, 7);

  const { id } = useParams();
  const [previedImage] = images.filter((image) => image.id == id);
  async function downloadImage() {
    if (typeof previedImage.id == "string") {
      const docRef = doc(db, "images", previedImage.id);
      setDownloaded(true);
      saveAs(
        previedImage.webformatURL,
        `${previedImage.previewURL.substr(28)}`
      );
      await updateDoc(docRef, {
        downloads: +previedImage.downloads + 1,
      });
    } else {
      setDownloaded(true);
      saveAs(
        previedImage.webformatURL,
        `${previedImage.previewURL.substr(24)}`
      );
    }
  }

  const newImages = relatedImages.filter((image) => previedImage !== image);

  // useEffect((event) => {
  //   event.preventDefault()
  // },[])

  return (
    <div className="bg-slate-50 w-screen h-screen">
      <div className=" pt-2 h-20 mb-4 w-full bg-slate-500 fixed top-0 z-20">
        {/* <div className=" pt-2 mb-4 h-12 w-full px-4 bg-slate-800"> */}
        {/* <NavLink to="/">
          <CameraLogo fill={"#c5c3c3"} />
        </NavLink> */}
        <Header />
      </div>
      {/* <h3 className="font-bold text-2xl mb-4 px-4" style={{ color: "#c5c3c3" }}>
        Image Preview!
      </h3> */}
      {previedImage && (
        <div className="md:flex items-center justify-evenly px-4 relative top-16">
          <div className="mb-4 mx-auto">
            <img
              src={previedImage.webformatURL}
              alt="image-preview"
              className="md:w-80 sm:w-64 md:h-vsm h-96 object-cover mx-auto mt-10"
            />
          </div>
          <div className="md:justify-evenly w-80 sm:w-98 mx-auto rounded-2xl py-6 border-2 shadow-md md:font-normal sm:mx-auto">
            <div className="flex my-4 px-6 justify-evenly">
              <a
                href="https://www.canva.com/"
                className="rounded-full border-2 py-2 px-2.5 md:w-32 sm:w-32 mx-2 text-sm text-center"
              >
                <img
                  src={canva}
                  alt="canva logo"
                  className="w-6 h-6 my-auto inline-block"
                />
                Edit Image
              </a>
              <a
                onClick={downloadImage}
                className="rounded-full border-2 py-2 px-2.5 md:w-32 sm:w-32 mx-2 text-center bg-green-500 text-sm text-slate-100 cursor-pointer"
              >
                Download <i className="fa fa-angle-down ml-2"></i>
              </a>
            </div>
            <hr className="text-slate-400" />
            <div className="flex my-4 items-center"></div>
            <ul className="px-6">
              <li className="flex justify-between">
                <p>Views</p>
                <p>{previedImage.downloads}</p>
              </li>
              <li className="flex justify-between">
                <p>Likes</p>
                <p>{previedImage.likes}</p>
              </li>
              <li className="flex justify-between">
                <p>Comments</p>
                <p>{previedImage.comments}</p>
              </li>
              {showDetails && (
                <>
                  <li className="flex justify-between">
                    <p>Downloads</p>
                    <p>{previedImage.downloads}</p>
                  </li>
                  <div>
                    <h3 className="text-sm font-semibold">Description</h3>

                    {previedImage.description ? (
                      <p className="text-sm">{previedImage.description}</p>
                    ) : (
                      <p className="text-sm">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Consectetur provident repudiandae atque autem vitae
                        fugit!
                      </p>
                    )}
                  </div>
                </>
              )}
              <p
                className="underline cursor-pointer"
                onClick={() => setShowDetails(!showDetails)}
              >
                {!showDetails ? "Show Details" : "Minimize Details"}
                <i className="fa fa-angle-down pl-2"></i>
              </p>
            </ul>
          </div>
        </div>
      )}
      <h3 className="text-slate-900 md:mt-14 sm:mt-20 mt-20 px-4">
        RELATED SEARCH
      </h3>
      <div className="grid xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-2 gap-1.5 items-center pt-2 justify-items-center px-4 mb-4">
        {newImages.map((image) => (
          <Image image={image} key={image.id} />
        ))}
      </div>
      <Footer />
      <div className="text-center bg-slate-300 py-3">
        Copyright &copy;
        <span>{date};</span> All rights reserved
      </div>
    </div>
  );
}

export default ImagePreview;
