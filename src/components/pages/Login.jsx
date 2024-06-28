import { NavLink, useNavigate } from "react-router-dom";
import { CameraLogo } from "../Mode/CameraLogo";
import GoogleImage from "../Mode/pngwing.com.png";
import { useState } from "react";
import { toast } from "react-toastify";

function Login() {
  const [onPassword, setOnpassword] = useState(true);
  const [formDetails, setFormdetails] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formDetails;

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (formDetails.email === "" || formDetails.password === "") {
      toast.error("Pls enter all credentials", {
        style: { color: "red" },
      });
    } else if (formDetails.email.contains("@") || formDetails.password < 8) {
      toast.error("Email does not contain the '@' character", {
        style: { color: "red" },
      });
    } else {
      setFormdetails({
        name: e.target[0].value,
        password: e.target[1].value
      });
      console.log(formDetails);
    }
  }

  return (
    <>
      <div className="ml-4 mt-2">
        <NavLink to="/">
          <CameraLogo />
        </NavLink>
      </div>
      <form
        className="container bg-slate-100 rounded-lg w-3/5 lg:w-5/12 py-4 px-3 mt-6 mx-auto my-auto shadow-xl"
        onSubmit={handleSubmit}
      >
        <h3 className="font-bold text-slate-700 text-2xl mb-4">
          Welcome back!
        </h3>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="signup-input"
            value={email}
            onChange={() => setFormdetails({email : email})}
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
              onChange={() => setFormdetails({password : password})}
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
          <button className="flex items-center justify-between bg-green-500 px-3 py-1.5  mt-4 mx-auto rounded-2xl lg:w-3/5 sm:w-3/5 font-bold">
            <p>Login</p>
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
            GOOGLE LOGIN
          </p>
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
      </form>
    </>
  );
}

export default Login;
