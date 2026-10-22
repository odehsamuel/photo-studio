import { useContext, useState, useEffect } from "react";
import ImagesContext from "../context/ImagesContext/ImagesContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ className = "" }) => {
  const { enteredData, SearchImage } = useContext(ImagesContext);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("searchedData");
    if (saved && saved !== "isFalse") {
      setQuery(saved);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      toast.info("Please enter a keyword to search (e.g., mountains, cyberpunk, neon)", {
        theme: "dark",
      });
      return;
    }
    SearchImage(trimmed);
    enteredData.current = trimmed;
    localStorage.setItem("searchedData", trimmed);
    navigate("/");

    // Smooth scroll down to images container
    setTimeout(() => {
      const el = document.getElementById("gallery-anchor");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const handleClear = () => {
    setQuery("");
    enteredData.current = "";
    localStorage.setItem("searchedData", "isFalse");
  };

  return (
    <form className={`relative flex items-center ${className}`} onSubmit={handleSubmit}>
      <div className="absolute left-3.5 pointer-events-none text-slate-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        className="w-48 sm:w-64 md:w-80 lg:w-96 py-2 pl-10 pr-9 bg-slate-900/80 hover:bg-slate-900 focus:bg-slate-900 text-sm rounded-full border border-slate-700/70 focus:border-emerald-500 text-slate-100 placeholder-slate-400 outline-none transition-all duration-200 shadow-inner focus:ring-2 focus:ring-emerald-500/20"
        placeholder="Search wallpapers, tags, mood..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          enteredData.current = e.target.value;
          localStorage.setItem("searchedData", e.target.value);
        }}
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-slate-400 hover:text-slate-200 transition-colors"
          title="Clear search"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </form>
  );
};

export default SearchBar;
