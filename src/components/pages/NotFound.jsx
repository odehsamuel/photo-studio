import { Link, NavLink } from "react-router-dom";
import { CameraLogo } from "../Mode/CameraLogo";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div className="pt-6 px-6">
        <NavLink to="/">
          <CameraLogo />
        </NavLink>
      </div>

      <div className="text-center px-4 py-20 max-w-lg mx-auto">
        <span className="text-7xl font-black bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent block mb-4">
          404
        </span>
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          The page or wallpaper you're looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all inline-block"
        >
          Return to Lumina Gallery
        </Link>
      </div>

      <div className="pb-6 text-center text-xs text-slate-600">
        Lumina Photo Studio &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}

export default NotFound;
