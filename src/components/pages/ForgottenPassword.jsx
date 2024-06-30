import { Link, NavLink } from "react-router-dom";
import { CameraLogo } from "../Mode/CameraLogo";
import { toast } from "react-toastify";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";

function ForgottenPassword() {
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email has been sent!", {
        style: {
          color: "green",
        },
      });
      setEmail("")
    } catch (error) {
      toast.error("An errror occured while sending the mail.", {
        style: {
          color: "red",
        },
      });
    }
  }

  return (
    <div className="bg-slate-50 fixed w-full h-screen">
      <div className="ml-4 mt-2">
        <NavLink to="/">
          <CameraLogo/>
        </NavLink>
      </div>
      <form
        className="container bg-slate-100 rounded-lg w-4/5 sm:w-4/5 md:w-3/5 lg:w-5/12 py-4 px-3 mt-6 mx-auto my-auto shadow-xl"
        onSubmit={handleSubmit}
      >
        <h3 className="font-bold text-slate-700 text-2xl mb-4">
          Forgetten Password
        </h3>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="signup-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Link to={"/sign-up"} className="text-green-500 text-right block font-bold">sign up</Link>
        <button className="bg-green-100 hover:bg-green-200 text-green-500 border rounded-2xl px-2 py-1 my-2">
          <p className="font-bold  inline-block">Reset Password</p>{" "}
          <i className="fa fa-arrow-right ml-2"></i>
        </button>
      </form>
    </div>
  );
}

export default ForgottenPassword;
