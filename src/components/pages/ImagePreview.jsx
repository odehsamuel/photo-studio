import { useNavigate, useParams } from "react-router-dom";
import { saveAs } from "file-saver";
import canva from "../Mode/icons8-canva-48.png";
import { useContext, useEffect, useState } from "react";
import ImagesContext from "../../context/ImagesContext/ImagesContext";
import Image from "../Image";
import Footer from "../Footer";
import Header from "../Header";
import { db } from "../../firebase.config";
import { doc, updateDoc } from "firebase/firestore";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { Loader } from "../Mode/Loader";
// import useNavigationDirection from "../hooks/useNavigationDirection";

function ImagePreview() {
  const date = new Date().getFullYear();
  const { images, image, searchSingleImage } = useContext(ImagesContext);
  const navigate = useNavigate()
  const [showDetails, setShowDetails] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const { isLoading } = useAuthStatus();
  // const isBackwards = useNavigationDirection();
  const enteredData = localStorage.getItem("searchedData");
  const initialValue = JSON.parse(enteredData);

  // console.log(isBackwards)

  const { id } = useParams();
  async function downloadImage() {
    if (typeof image.id == "string") {
      const docRef = doc(db, "images", image.id);
      setDownloaded(true);
      saveAs(image.webformatURL, `${image.previewURL.substr(28)}`);
      await updateDoc(docRef, {
        downloads: +image.downloads + 1,
      });
    } else {
      setDownloaded(true);
      saveAs(image.webformatURL, `${image.previewURL.substr(24)}`);
    }
  }
  useEffect(() => {
    if (id.length > 10) {
      searchSingleImage(id, enteredData);
    } else {
      searchSingleImage(+id, enteredData);
    }
  }, [id]);

  const previewedImage = image[0];

  if (isLoading) {
    return (
      <div className="loading w-screen h-screen fixed">
        <Loader fill={"black"} />
      </div>
    );
  } else {
    return (
      <div className="bg-slate-50 w-screen h-screen">
        <div className=" pt-2 h-20 mb-4 w-full bg-slate-500 fixed top-0 z-20">
          <Header />
        </div>
        {previewedImage && (
          <div className="md:flex items-center justify-evenly px-4 relative top-16">
            <div className="mb-4 mx-auto">
              <img
                src={previewedImage.webformatURL}
                alt="image-preview"
                className="md:w-80 sm:w-64 md:h-vsm h-96 object-cover mx-auto mt-10"
              />
            </div>
            <div className="md:justify-evenly w-80 sm:w-98 mx-auto rounded-2xl py-6 border-2 shadow-md md:font-normal sm:mx-auto">
              <div className="flex my-4 px-6 justify-evenly">
                <a
                  // href="https://www.canva.com/"
                  href={`https://www.canva.com/design/${previewedImage.previewURL}/edit`}
                  className="rounded-full border-2 py-2 px-2.5 md:w-32 sm:w-32 mx-2 text-sm text-center"
                >
                  <img
                    src={canva}
                    alt="canva-logo"
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
                  <p>{previewedImage.downloads}</p>
                </li>
                <li className="flex justify-between">
                  <p>Likes</p>
                  <p>{previewedImage.likes}</p>
                </li>
                <li className="flex justify-between">
                  <p>Comments</p>
                  <p>{previewedImage.comments}</p>
                </li>
                {showDetails && (
                  <>
                    <li className="flex justify-between">
                      <p>Downloads</p>
                      <p>{previewedImage.downloads}</p>
                    </li>
                    <div>
                      <h3 className="text-sm font-semibold">Description</h3>

                      {previewedImage.description ? (
                        <p className="text-sm">{previewedImage.description}</p>
                      ) : (
                        <p className="text-sm">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Consectetur provident repudiandae atque autem
                          vitae fugit!
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
          {images.map((image) => (
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
}

export default ImagePreview;
