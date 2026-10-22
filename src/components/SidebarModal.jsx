import { Link } from "react-router-dom";
import { useAuthStatus } from "./hooks/useAuthStatus";
import { getAuth } from "firebase/auth";

const SidebarModal = ({ isOpen, onClose, onExplore }) => {
  const { loggedIn, handleClick } = useAuthStatus();
  const auth = getAuth();
  const user = auth.currentUser;

  if (!isOpen) return null;

  const handleExplore = () => {
    if (onExplore) onExplore();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xs bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <span className="font-bold text-lg text-white">Menu</span>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* User info if logged in */}
            {loggedIn && user && (
              <div className="py-4 border-b border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-base shadow-md">
                  {(user.displayName || user.email || "U")[0].toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium text-sm text-white truncate">
                    {user.displayName || "Studio Creator"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Links */}
            <nav className="mt-6 flex flex-col gap-2">
              <Link
                to="/"
                onClick={handleExplore}
                className="flex items-center gap-3 px-4 py-3 text-slate-200 hover:text-white hover:bg-slate-800/80 rounded-xl font-medium transition-colors"
              >
                <i className="fa fa-compass text-emerald-400 w-5"></i>
                Explore Gallery
              </Link>

              <Link
                to="/image-upload"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl font-medium border border-emerald-500/20 transition-colors"
              >
                <i className="fa fa-cloud-upload text-emerald-400 w-5"></i>
                Upload Wallpaper
              </Link>

              {loggedIn ? (
                <>
                  <Link
                    to="/account"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-slate-200 hover:text-white hover:bg-slate-800/80 rounded-xl font-medium transition-colors"
                  >
                    <i className="fa fa-heart text-rose-400 w-5"></i>
                    My Uploads & Likes
                  </Link>

                  <button
                    onClick={() => {
                      handleClick();
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl font-medium transition-colors text-left"
                  >
                    <i className="fa fa-sign-out text-rose-400 w-5"></i>
                    Log Out
                  </button>
                </>
              ) : (
                <div className="pt-4 flex flex-col gap-2.5">
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/sign-up"
                    onClick={onClose}
                    className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    Join Lumina Free
                  </Link>
                </div>
              )}
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 text-center">
            Lumina Photo Studio &copy; {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarModal;
