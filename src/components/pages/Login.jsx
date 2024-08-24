import { Link, NavLink, useNavigate } from "react-router-dom";
import { CameraLogo } from "../Mode/CameraLogo";
import GoogleImage from "../Mode/pngwing.com.png";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.config";

function Login() {
  const [onPassword, setOnpassword] = useState(true);
  const [formDetails, setFormdetails] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formDetails;

  const navigate = useNavigate();

  function handleChange(e) {
    setFormdetails((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (email === "" || password === "") {
      toast.error("Pls enter all credentials", {
        style: { color: "red" },
      });
      console.log();
    } else if (e.target[1].value.length < 8) {
      toast.error("Password shouldn't be less than 8 characters", {
        style: { color: "red" },
      });
    } else {
      try {
        const auth = getAuth();

        await signInWithEmailAndPassword(auth, email, password);
        if (auth.currentUser) {
          toast.success(`Welcome back ${auth.currentUser.displayName}`, {
            style: {
              color: "green",
            },
          });
          navigate("/");
        }
      } catch (error) {
        toast.error(
          "Invalid credentials, try logging in with correct credentials",
          {
            style: {
              color: "red",
            },
          }
        );
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
        toast.error("Invalid User, try signing up instead pls.", {
          style: {
            color: "red",
          },
        });
      } else {
        toast.success(`Welcome back ${user.displayName}`, {
          style: {
            color: "green",
          },
        });
        navigate("/");
      }
    } catch (error) {
      toast.error("Google could not authorize login, try signing up!", {
        style: {
          color: "red",
        },
      });
    }
  }

  return (
    <div className="bg-slate-50 w-screen h-screen px-4">
      <div className="pt-2 mb-4 h-12 w-12">
        <NavLink to="/">
          <CameraLogo fill={"black"} />
        </NavLink>
      </div>
      <div className="container bg-slate-100 rounded-lg w-4/5 sm:w-4/5 md:w-3/5 lg:w-5/12 py-4 px-3 mt-6 mx-auto my-auto shadow-xl">
        <form onSubmit={handleSubmit}>
          <h3 className="font-bold text-slate-700 text-2xl mb-4">
            Welcome back!👋
          </h3>
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
              <p className="text-sm text-red-500 text-center mb-8">
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
              <p>Login</p>
              <i className="fa fa-arrow-right ml-20"></i>
            </button>
          </div>
        </form>
        <div className="flex items-center flex-grow justify-center">
          <div className="bg-slate-300/70 w-32 h-px my-10"></div>
          <p className="mx-3 text-slate-300 text-sm">OR</p>
          <div className="bg-slate-300/70 w-32 h-px my-10"></div>
        </div>

        <p className="text-center text-sm text-slate-600">Login instead with</p>
        <button className="mx-auto block " onClick={handleGoogle}>
          <img
            src={GoogleImage}
            alt="google-logo"
            className="rounded-full p-2 bg-white w-10 h-10 shadow-gray-500 shadow-md"
          ></img>
        </button>

        <p className="text-center my-6 font-bold">
          Don't have an account?{" "}
          <span
            className="hover:text-sky-500 hover:cursor-pointer underline text-sky-300"
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
