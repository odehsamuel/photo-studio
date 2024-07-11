import { saveAs } from "file-saver";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";

const Image = ({
  image: { webformatURL, downloads, likes, comments, previewURL, id },
}) => {
  const [liked, setLiked] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  async function downloadImage() {
    if (typeof id == "string") {
      const docRef = doc(db, "images", id);
      saveAs(previewURL, `${webformatURL.substr(24)}`);
      await updateDoc(docRef, {
        downloads: +downloads + 1,
      });
      setDownloaded(true);
    }
  }
  async function handleClick(e) {
    if (typeof id == "string") {
      const docRef = doc(db, "images", id);
      if (e.target.classList.contains("fa-heart-o")) {
        setLiked(!liked);
        updateDoc(docRef, {
          likes: +likes + 1,
        });
      } else if (e.target.classList.contains("fa-heart")) {
        setLiked(!liked);
        updateDoc(docRef, {
          likes: +likes,
        });
      } else if (e.target.classList.contains("download")) {
        setDownloaded(true)
        updateDoc(docRef, {
          downloads: +downloads + 1,
        });
      }
    }
  }

  return (
    <div className="container overflow-hidden">
      <div className="relative">
        <Link to={"/image-preview"}>
          <img
            src={webformatURL}
            alt="image-preview"
            className="object-cover hover:brightness-50 w-full h-80"
          />
        </Link>
        <a
          onClick={downloadImage}
          className="hover:bg-rose-300 bg-rose-200 py-0.5 px-1.5 flex items-center rounded-md absolute bottom-3 right-2 cursor-pointer"
        >
          <i className="fa fa-download mr-2" aria-hidden="true"></i>
          <p>Download</p>
        </a>
      </div>
      <div className="bg-rose-200 py-6 px-1 text-slate-700 text-center mx-auto box-border flex justify-evenly">
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
          <span className="text-xs py-0.5 px-2 bg-rose-100 text-rose-600 mx-4 rounded-full">
            {/* {likes} */}
            {liked ? +likes + 1 : likes}
          </span>
        </div>
        <div>
          <i
            className={"fa fa-comment-o hover:text-rose-600"}
            aria-hidden="true"
            // onClick={() => setLiked(!liked)}
          ></i>

          <p className="text-xs font-bold text-rose-600">Comments</p>
          <span className="text-xs py-0.5 px-2 bg-rose-100 text-rose-600 mx-4 rounded-full">
            {comments}
          </span>
        </div>
        <div>
          <i
            className={"fa fa-download hover:text-rose-600"}
            aria-hidden="true"
            onClick={(e) => {
              downloadImage(e);
              handleClick(e);
            }}
          ></i>

          <p className="text-xs font-bold text-rose-600">Downloads</p>
          <span
            className="text-xs py-0.5 px-2 bg-rose-100 text-rose-600 mx-4 rounded-full download"
          >
            {downloaded ? +downloads + 1 : downloads}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Image;
