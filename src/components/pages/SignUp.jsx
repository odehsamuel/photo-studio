import { Link, NavLink, useNavigate } from "react-router-dom";
import { CameraLogo } from "../Mode/CameraLogo";
import GoogleImage from "../Mode/pngwing.com.png";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { db } from "../../firebase.config";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
// import { GoogleAuthProvider } from "firebase/auth";

function SignUp() {
  const [onPassword, setOnpassword] = useState(true);
  const [formDetails, setFormdetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formDetails;

  const navigate = useNavigate();

  function handleChange(e) {
    setFormdetails((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (name === "" || email === "" || password === "") {
      toast.error("Pls enter all credentials", {
        style: { color: "red" },
      });
    } else if (e.target[2].value.length < 8) {
      toast.error("Password shouldn't be less than 8 characters", {
        style: { color: "red" },
      });
    } else {
      try {
        const auth = getAuth();

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Signed up
        const user = userCredential.user;
        updateProfile(auth.currentUser, {
          displayName: name,
        });
        // making a form data copy
        const formDetailsCopy = { ...formDetails };
        formDetailsCopy.timestamp = serverTimestamp();

        // deleting the password from the form data
        delete formDetailsCopy.password;
        await setDoc(doc(db, "users", user.uid), formDetailsCopy);
        navigate("/login");
      } catch (error) {
        toast.error(
          "Invalid credentials, try logging in with correct credentials",
          {
            style: {
              color: "red",
            },
          }
        );
        console.log(error);
      }
    }
  }

  async function handleGoogle() {
    try {
      const auth = getAuth();

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
        navigate("/login");
      }else{
        toast.error("Already signed in, try logging in instead!")
      }
    } catch (error) {
      toast.error("An error occured with Google sign up");
    }
  }

  return (
    <div className="bg-slate-50 w-screen h-screen px-4">
      <div className="pt-2 mb-4 h-12 w-12">
        <NavLink to="/">
          <CameraLogo/>
        </NavLink>
      </div>

      <div className="container bg-slate-100 rounded-lg w-4/5 sm:w-4/5 md:w-3/5 lg:w-5/12 py-4 px-3 mt-6 mx-auto my-auto shadow-xl">
        <form onSubmit={handleSubmit}>
          <h3 className="font-bold text-slate-700 text-2xl mb-4">
            Create an account
          </h3>

          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              className="signup-input"
              value={name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="signup-input"
              value={email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <div className="relative">
              <input
                type={onPassword ? "password" : "text"}
                id="password"
                className="signup-input"
                value={password}
                onChange={handleChange}
              />
              <i
                className={
                  onPassword
                    ? "fa fa-eye-slash absolute inset-y-2 right-3"
                    : "fa fa-eye absolute inset-y-2 right-3"
                }
                onClick={() => setOnpassword(!onPassword)}
              ></i>
            </div>
            {password.length > 0 && password.length < 8 && (
              <p className="text-sm text-red-500 text-center">
                Password should be more than 8 characters
              </p>
            )}
            <Link
              to={"/forgot-password"}
              className="text-green-500 text-right block font-bold text-sm"
            >
              forgot password
            </Link>
            <button className="flex items-center justify-between bg-green-500 px-3 py-1.5  mt-4 mx-auto rounded-2xl lg:w-3/5 sm:w-3/5 font-bold">
              <p>Sign Up</p>
              <i className="fa fa-arrow-right ml-20"></i>
            </button>
          </div>
        </form>

        <div className="flex items-center flex-grow justify-center">
          <div className="bg-slate-300/70 w-32 h-px my-10"></div>
          <p className="mx-3 text-slate-300 text-sm">OR</p>
          <div className="bg-slate-300/70 w-32 h-px my-10"></div>
        </div>

        <p className="text-center text-sm text-slate-600">Sign up instead with</p>
        <button className="mx-auto block" onClick={handleGoogle}>
          <img
            src={GoogleImage}
            alt="google-image"
            className="rounded-full p-2 bg-white w-10 h-10 shadow-gray-500 shadow-md"
          ></img>
        </button>

        <p className="text-center my-6 font-bold">
          Already have an account?{" "}
          <span
            className="hover:text-sky-500 hover:cursor-pointer underline text-sky-300"
            onClick={() => navigate("/login")}
          >
            login
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
