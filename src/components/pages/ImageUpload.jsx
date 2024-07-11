import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { NavLink } from "react-router-dom";
import { CameraLogo } from "../Mode/CameraLogo";
import chick from "../Mode/_g73df6e99215abe2cfd07359c9586141294b101fda48f200514e9c5ef48e71cbc7e8d589167e19a46e84b159ac379e10ce6f4cba3c6c82d003baecea327915664_640.jpg";
import { useState } from "react";

function ImageUpload() {
  const [formDetails, setFormdetails] = useState({
    name: "",
    tags: "",
    description: "",
  });

  function handleChange() {}

  function handleSubmit(e) {
    e.preventDefault();

    const storage = getStorage();
    const storageRef = ref(storage, "images/rivers.jpg");

    const uploadTask = uploadBytesResumable(storageRef, "file");

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
        });
      }
    );
  }

  return (
    <div className="bg-slate-50 w-screen h-screen">
      <div className="ml-4 pt-2 ">
        <NavLink to="/">
          <CameraLogo fill={"black"} />
        </NavLink>
      </div>
      <form onSubmit={handleSubmit} className="mx-4">
        <h3 className="font-bold text-slate-700 text-2xl mb-4">
          Upload Image!
        </h3>
        <div className="md:flex items-center lg:justify-between">
          <div>
            <img
              src={chick}
              alt="image-preview"
              className="md:w-60 md:h-72 sm:w-36 sm:h-48 object-cover"
            />
            <label htmlFor="image">Image</label>
            <input
              type="file"
              id="image"
              className="upload-input"
              // value={email}
              onChange={handleChange}
            />
          </div>
          <div className="md:ml-16 w-full">
            <div>
              <div>
                <label htmlFor="email">Tags</label>
                <input
                  type="email"
                  id="email"
                  className="upload-input block w-full placeholder:text-sm"
                  placeholder="Enter 3 or more tags, sepereated by commas(eg. coffee, tea, caffeine)"
                  value={tags}
                  onChange={handleChange}
                />
              </div>
                <div>
                  <label htmlFor="email">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    value={description}
                    className="upload-input w-full md:h-60 h-36 resize-none"
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
