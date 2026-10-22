import React from "react";
import { Link } from "react-router-dom";
import { CameraLogo } from "./Mode/CameraLogo";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <CameraLogo />
            <p className="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Lumina Photo Studio is a modern visual discovery platform delivering curated 4K wallpapers and photography for creatives worldwide.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {["github", "twitter", "instagram"].map((icon) => (
                <a
                  key={icon}
                  href={`https://${icon}.com`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                >
                  <i className={`fa fa-${icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Wallpaper Themes
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {["Wallpapers", "Nature & Landscapes", "Cyberpunk & Neon", "Architecture", "Minimalist"].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    onClick={() => localStorage.setItem("searchedData", item.toLowerCase())}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore Studio
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Trending Gallery
                </Link>
              </li>
              <li>
                <Link to="/image-upload" className="hover:text-emerald-400 transition-colors">
                  Upload Wallpaper
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-emerald-400 transition-colors">
                  My Profile & Likes
                </Link>
              </li>
              <li>
                <Link to="/sign-up" className="hover:text-emerald-400 transition-colors">
                  Creator Membership
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Creative License
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              All wallpapers on Lumina Studio are free for personal and non-commercial desktop and mobile wallpaper customization.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="font-semibold text-emerald-400 block mb-0.5">Need custom licensing?</span>
              <span className="text-slate-500">Contact our studio team anytime.</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {year} Lumina Photo Studio. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
