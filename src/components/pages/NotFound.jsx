import { Link, NavLink } from "react-router-dom";
import { CameraLogo } from "../Mode/CameraLogo";

function NotFound() {
  return (
    <div className="h-screen w-screen bg-slate-800 px-4">
      <div className="pt-2 mb-4 h-12 w-12">
        <NavLink to="/">
          <CameraLogo fill={"#c5c3c3"}/>
        </NavLink>
      </div>
      <div className="text-center my-56 font-bold text-slate-600">
        <span className="text-5xl text-rose-500">404</span>{"  "}
        <p className="text-3xl inline-block">Error</p>
        <p className="mt-2">
          We've just encountered an error, try going back to{" "}
          <Link to={"/"} className="underline text-sky-500">
            safety
          </Link>
        </p>
      </div>
    </div>
  );
}

export default NotFound;
