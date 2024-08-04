import { saveAs } from "file-saver";
import { useState } from "react";
import { Link } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import Modal from "./Modal";

const Image = ({
  image: { webformatURL, downloads, likes, comments, previewURL, id, tags },
}) => {
  const [liked, setLiked] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // const newtags = tags.split(" ,");
  // console.log(newtags.join("-"))

  // let iterator = newtags.values();

  // // Here all the elements of the array is being printed.
  // for (let elements of iterator) {
    
  // }
  async function downloadImage() {
    if (typeof id == "string") {
      const docRef = doc(db, "images", id);
      setDownloaded(true);
      saveAs(webformatURL, `${previewURL.substr(28)}`);
      await updateDoc(docRef, {
        downloads: +downloads + 1,
      });
    } else {
      setDownloaded(true);
      saveAs(webformatURL, `${previewURL.substr(24)}`);
    }
  }
  async function handleClick(e) {
    const docRef = doc(db, "images", id);
    if (typeof id == "string") {
      if (e.target.classList.contains("fa-heart-o")) {
        setLiked(!liked);
        await updateDoc(docRef, {
          likes: +likes + 1,
        });
      } else if (e.target.classList.contains("fa-heart")) {
        setLiked(!liked);
        await updateDoc(docRef, {
          likes: +likes,
        });
      }
    } else if (e.target.classList.contains("fa-heart-o")) {
      setLiked(!liked);
    } else if (e.target.classList.contains("fa-heart")) {
      setLiked(!liked);
    }
  }
  return (
    <div className="container overflow-hidden">
      <div className="relative">
        <Link to={`/image-preview/${tags}/${id}`}>
          {/* <Link to={`/image-preview/${previewURL.substr(24)}`}> */}
          <img
            src={webformatURL}
            alt="image-preview"
            className="object-cover hover:brightness-50 w-full h-80"
          />
        </Link>
        <a
          onClick={downloadImage}
          download={`${previewURL.substr(28)}`}
          className="hover:bg-rose-300 bg-rose-200 py-0.5 px-1.5 flex items-center rounded-md absolute bottom-3 right-2 cursor-pointer"
        >
          <i className="fa fa-download mr-2" aria-hidden="true"></i>
          <p>Download</p>
        </a>
      </div>
      <div className="bg-rose-200 py-6 px-1 text-slate-700 text-center mx-auto box-content flex justify-evenly">
        <div className="">
          <i
            className={
              liked
                ? "fa fa-heart text-rose-600"
                : "fa fa-heart-o hover:text-rose-600"
            }
            aria-hidden="true"
            onClick={handleClick}
          ></i>

          <p className="text-xs font-bold text-rose-600">Likes</p>
          <span className="text-xs py-0.5 px-2 bg-rose-100 text-rose-600 rounded-full">
            {liked ? +likes + 1 : likes}
          </span>
        </div>
        <div>
          <Modal id={id} comments={comments} />
          <p className="text-xs font-bold text-rose-600">Comments</p>
          <span className="text-xs py-0.5 px-2 bg-rose-100 text-rose-600 rounded-full">
            {comments}
          </span>
        </div>
        <div>
          <i
            className={"fa fa-download hover:text-rose-600"}
            aria-hidden="true"
            onClick={downloadImage}
          ></i>

          <p className="text-xs font-bold text-rose-600">Downloads</p>
          <span className="text-xs py-0.5 px-2 bg-rose-100 text-rose-600 rounded-full download">
            {downloaded ? +downloads + 1 : downloads}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Image;
