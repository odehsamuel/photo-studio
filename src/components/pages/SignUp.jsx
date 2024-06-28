import { NavLink, useNavigate } from "react-router-dom";
import { CameraLogo } from "../Mode/CameraLogo";
import GoogleImage from "../Mode/pngwing.com.png";
import { useState } from "react";

function SignUp() {
  const [onPassword, setOnpassword] = useState(true);
  const navigate = useNavigate();

  return (
    <>
      <div className="ml-4 mt-2">
        <NavLink to="/">
          <CameraLogo />
        </NavLink>
      </div>
      <form className="container bg-slate-100 rounded-lg w-3/5 lg:w-5/12 py-4 px-3 mt-6 mx-auto my-auto shadow-xl">
        <h3 className="font-bold text-slate-700 text-2xl mb-4">
          Create an account
        </h3>

        <div>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" className="signup-input" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" className="signup-input" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <div className="relative">
            <input
              type={onPassword ? "password" : "text"}
              id="password"
              className="signup-input"
            />
            <i
              className={onPassword ? "fa fa-eye-slash absolute inset-y-2 right-3" : "fa fa-eye absolute inset-y-2 right-3"}
              onClick={() => setOnpassword(!onPassword)}
            ></i>
          </div>
          <button className="flex items-center justify-between bg-green-500 px-3 py-1.5  mt-4 mx-auto rounded-2xl lg:w-3/5 sm:w-3/5 font-bold">
            <p>Sign Up</p>
            <i className="fa fa-arrow-right ml-20"></i>
          </button>
        </div>

        <div className="flex items-center flex-grow justify-center">
          <div className="bg-slate-300/70 w-32 h-px my-10"></div>
          <p className="mx-3 text-slate-300 ">OR</p>
          <div className="bg-slate-300/70 w-32 h-px my-10"></div>
        </div>

        <button className="flex items-center lg:justify-start md:justify-start bg-sky-500 mx-auto lg:w-3/5 sm:w-3/5 px-2 py-1.5 rounded-2xl">
          <img
            src={GoogleImage}
            alt="google-image"
            className="ml-2 w-6 h-6 bg-slate-50"
          ></img>
          <p className="font-bold text-slate-50 lg:ml-6 md:ml-4 sm:ml-3 ml-3 text-sm lg:text-base">
            GOOGLE SIGN UP
          </p>
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
      </form>
    </>
  );
}

export default SignUp;
