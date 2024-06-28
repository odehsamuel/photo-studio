import { Link, NavLink } from "react-router-dom";
import { CameraLogo } from "../Mode/CameraLogo";

function NotFound() {
  return (
    <div className="h-screen w-screen bg-slate-800">
      <div className="ml-4 mt-2">
        <NavLink to="/">
          <CameraLogo />
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
