import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import Header from "../Header";
// import { getAuth } from "firebase/auth";
// import { useAuthStatus } from "../hooks/useAuthStatus";

function ImageUpload() {
  // const { loggedIn } = useAuthStatus();

  // const auth = getAuth();
  const [formDetails, setFormdetails] = useState({
    image: null,
    tag: "",
  });

  const navigate = useNavigate();
  const { image, tag, description } = formDetails;

  // function handleClick() {
  //   auth.signOut();
  // }

  function handleChange(e) {
    if (e.target.id === "image") {
      setFormdetails((prev) => ({
        ...prev,
        image: e.target.files[0],
      }));
    } else {
      setFormdetails((prev) => ({
        ...prev,
        [e.target.id]: e.target.value,
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (image === null || image === undefined) {
      toast.error("Please try entering an image", {
        style: {
          color: "red",
        },
      });
    } else if (tag.split(",").length - 1 < 2) {
      toast.error(
        "Enter 3 or more tags, separated by commas(eg. coffee, tea, caffeine)",
        {
          style: {
            color: "red",
          },
        }
      );
    } else {
      //store images here
      const storage = getStorage();
      const date = new Date().toDateString();
      const fileName = `${date}-${uuidv4()}-${image.name}`;
      const storageRef = ref(storage, `images/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            default:
              console.log("...Uploading");
              break;
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          toast.error(
            "We encountered an error while uploading your image, try Again!",
            {
              style: { color: "red" },
            }
          );
        },
        async function getDownloadedUrl() {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            formDetails.webformatURL = downloadURL;

            //add image data to database
            const formDataCopy = { ...formDetails };
            delete formDataCopy.tag;
            delete formDataCopy.image;
            const tags = tag.split(", ");
            const formData = { ...formDataCopy, tags };

            addDoc(collection(db, "images"), {
              ...formData,
              likes: 0,
              comments: 0,
              downloads: 0,
              previewURL: `https://photostudio.com/get/${uuidv4()}/.${
                image.name
              }`,
              timestamp: serverTimestamp(),
            });
            toast.success("Upload was successful", {
              style: { color: "green" },
            });
            navigate("/");
          });
        }
      );
    }
  }

  return (
    <div className="bg-slate-50 w-screen h-screen">
      <div className=" pt-2 h-20 mb-4 w-full bg-slate-500 fixed top-0">
        <Header />
      </div>
      <form
        onSubmit={handleSubmit}
        accept=".jpg, .jpeg, .png"
        className="px-4 mt-24"
        required
      >
        <h3 className="font-bold text-slate-700 text-2xl mb-4">
          Upload Image!
        </h3>
        <div className="md:flex items-center lg:justify-between">
          <div className="mb-2">
            {/* <img
              src={chick}
              alt="image-preview"
              className="md:w-60 md:h-72 sm:w-36 sm:h-48 object-cover"
            /> */}
            <label htmlFor="image">Image</label>
            <input
              type="file"
              id="image"
              className="upload-input"
              onChange={handleChange}
            />
          </div>
          <div className="md:ml-16 w-full">
            <div>
              <div className="my-2">
                <label htmlFor="tags">Tags</label>
                <input
                  type="tags"
                  id="tag"
                  className="upload-input block w-full placeholder:text-sm"
                  placeholder="Enter 3 or more tags, separated by commas(eg. coffee, tea, caffeine)"
                  value={tag}
                  onChange={handleChange}
                />
              </div>
              <div className="my-2">
                <label htmlFor="description">Description</label>
                <textarea
                  name="description"
                  id="description"
                  placeholder="(optional)"
                  value={description}
                  className="upload-input w-full md:h-60 h-36 resize-none"
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <button className="px-2 py-1 bg-green-500 rounded-lg mt-6 ml-auto block">
              Upload<i className="fa fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ImageUpload;
