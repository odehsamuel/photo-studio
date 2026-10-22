import React from "react";

export function CameraLogo({ fill = "currentColor", size = "2.5rem", showText = true, className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300 group-hover:scale-105">
        <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="url(#luminaGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <defs>
              <linearGradient id="luminaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#2dd4bf" />
              </linearGradient>
            </defs>
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
            Lumina<span className="text-emerald-400">Studio</span>
          </span>
          <span className="text-[10px] font-medium tracking-widest text-slate-400 uppercase -mt-1">
            Visual Experience
          </span>
        </div>
      )}
    </div>
  );
}

export default CameraLogo;
