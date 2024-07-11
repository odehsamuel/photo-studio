import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { NavLink } from "react-router-dom";
import { CameraLogo } from "../Mode/CameraLogo";
import chick from "../Mode/_g73df6e99215abe2cfd07359c9586141294b101fda48f200514e9c5ef48e71cbc7e8d589167e19a46e84b159ac379e10ce6f4cba3c6c82d003baecea327915664_640.jpg";

function ImagePreview() {
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
    <div>
      <div className="ml-4 pt-2 ">
        <NavLink to="/">
          <CameraLogo fill={"#c5c3c3"}/>
        </NavLink>
      </div>
        <h3 className="font-bold text-2xl mb-4" style={{color: "#c5c3c3"}}>
          Image Preview!
        </h3>
        <div className="md:flex items-center lg:justify-between">
          <div className="mx-8">
            <img
              src={chick}
              alt="image-preview"
              className="md:w-64 md:h-80 sm:w-40 sm:h-56 object-cover"
            />
            
          </div>
          <div className="md:ml-16 w-full">
           
          </div>
        </div>
    </div>
  );
}

export default ImagePreview;
