import { NavLink } from "react-router-dom";
import { saveAs } from "file-saver";
import { CameraLogo } from "../Mode/CameraLogo";
import chick from "../Mode/_g73df6e99215abe2cfd07359c9586141294b101fda48f200514e9c5ef48e71cbc7e8d589167e19a46e84b159ac379e10ce6f4cba3c6c82d003baecea327915664_640.jpg";
import canva from "../Mode/icons8-canva-48.png";
import { useContext, useState } from "react";
import ImagesContext from "../../context/ImagesContext/ImagesContext";
import Image from "../Image";
import Footer from "../Footer";
import Header from "../Header";

function ImagePreview() {
  const date = new Date().getFullYear();
  async function downloadImage() {
    // if (typeof id == "string") {
    //   const docRef = doc(db, "images", id);
    //   setDownloaded(true);
    //   saveAs(webformatURL, `${previewURL.substr(28)}`);
    //   await updateDoc(docRef, {
    //     downloads: +downloads + 1,
    //   });
    // } else {
    //   setDownloaded(true);
    //   saveAs(webformatURL, `${previewURL.substr(24)}`);
    // }
  }
  const { images } = useContext(ImagesContext);
  const relatedImages = images.slice(0, 6);

  const [showDetails, setShowDetails] = useState(false);

  function handleChange() {}

  function handleSubmit(e) {
    e.preventDefault();
  }

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
      <div className="md:flex items-center justify-evenly px-4 mt-20">
        <div className="mx-8 mb-4">
          <img
            src={chick}
            alt="image-preview"
            className="md:w-80 sm:w-52 md:h-vsm h-96 object-cover mx-auto mt-10"
          />
        </div>
        <div className="md:justify-evenly w-96 rounded-2xl py-6 border-2 shadow-md md:font-normal sm:mx-auto">
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
              className="rounded-full border-2 py-2 px-2.5 md:w-32 sm:w-32 mx-2 text-center bg-green-500 text-sm text-slate-100"
            >
              Download <i className="fa fa-angle-down ml-2"></i>
            </a>
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
              className="underline cursor-pointer"
              onClick={() => setShowDetails(!showDetails)}
            >
              {!showDetails ? "Show Details" : "Minimize Details"}
              <i className="fa fa-angle-down pl-2"></i>
            </p>
          </ul>
        </div>
      </div>
      <h3 className="text-slate-900 mt-6 px-4">RELATED SEARCH</h3>
      <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-1.5 items-center pt-2 justify-items-center px-4 mb-4">
        {relatedImages.map((image) => (
          <Image image={image} key={image.id} />
        ))}
      </div>
      <Footer />
      <div className="text-center bg-slate-300 py-3">
        Copyright &copy;
        <span>{date};</span> All rights
        {/* <script>document.write(new Date().getFullYear());</script> All rights */}
        reserved
      </div>
    </div>
  );
}

export default ImagePreview;
