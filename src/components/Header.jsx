import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { CameraLogo } from "./Mode/CameraLogo";
import SearchBar from "./SearchBar";
import { useAuthStatus } from "./hooks/useAuthStatus";
import SidebarModal from "./SidebarModal";
import { getAuth } from "firebase/auth";
import ImagesContext from "../context/ImagesContext/ImagesContext";

const Header = () => {
  const { loggedIn, handleClick } = useAuthStatus();
  const { FetchImages, setIsSearchValid } = useContext(ImagesContext);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const location = useLocation();

  const handleExploreClick = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    localStorage.setItem("searchedData", "isFalse");
    if (setIsSearchValid) {
      setIsSearchValid(true);
    }
    if (FetchImages) {
      FetchImages();
    }

    const scrollToGallery = () => {
      const anchor = document.getElementById("gallery-anchor");
      if (anchor) {
        anchor.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 460, behavior: "smooth" });
      }
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollToGallery, 120);
      setTimeout(scrollToGallery, 350);
    } else {
      scrollToGallery();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/90 backdrop-blur-md shadow-xl border-b border-white/5 py-3"
            : "bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <NavLink
            to="/"
            onClick={handleExploreClick}
            className="flex-shrink-0"
          >
            <CameraLogo />
          </NavLink>

          {/* Search bar */}
          <div className="hidden sm:block flex-1 max-w-md mx-4">
            <SearchBar className="w-full" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <NavLink
              to="/"
              onClick={handleExploreClick}
              className={({ isActive }) =>
                `px-3.5 py-2 text-sm font-medium rounded-full transition-colors ${
                  isActive
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`
              }
            >
              Explore
            </NavLink>

            <NavLink
              to="/image-upload"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-full shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Upload
            </NavLink>

            {!loggedIn ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white rounded-full hover:bg-slate-800/60 transition-colors"
                >
                  Log In
                </NavLink>
                <NavLink
                  to="/sign-up"
                  className="px-4 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-700/80 transition-all"
                >
                  Join Free
                </NavLink>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
                <NavLink
                  to="/account"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-800/80 border border-slate-800 transition-colors group"
                  title="My Uploads & Likes"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xs shadow-sm">
                    {(user?.displayName || user?.email || "U")[0].toUpperCase()}
                  </div>
                  <span className="text-xs text-slate-300 group-hover:text-white max-w-[90px] truncate">
                    {user?.displayName || "My Profile"}
                  </span>
                </NavLink>

                <button
                  onClick={handleClick}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-full hover:bg-rose-500/10 transition-colors"
                  title="Sign Out"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 text-slate-300 hover:text-white rounded-xl bg-slate-900/80 border border-slate-800 focus:outline-none"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar below header */}
        <div className="sm:hidden px-4 pt-3 pb-1">
          <SearchBar className="w-full" />
        </div>
      </header>

      {/* Mobile Slide-over Drawer */}
      <SidebarModal
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onExplore={handleExploreClick}
      />
    </>
  );
};

export default Header;
