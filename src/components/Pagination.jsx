import { useContext, useState } from "react";
import ImagesContext from "../context/ImagesContext/ImagesContext";

const Pagination = () => {
  const { FetchImages, SearchImage } = useContext(ImagesContext);
  const [currentPage, setCurrentPage] = useState(1);
  const searched = localStorage.getItem("searchedData");

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    if (!searched || searched === "isFalse") {
      FetchImages(undefined, pageNum);
    } else {
      SearchImage(searched, undefined, pageNum);
    }

    const anchor = document.getElementById("gallery-anchor");
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="py-10 flex justify-center items-center gap-2">
      <button
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Prev</span>
      </button>

      {[1, 2, 3].map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`w-9 h-9 text-xs font-bold rounded-xl transition-all ${
            currentPage === page
              ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 scale-105"
              : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(Math.min(3, currentPage + 1))}
        disabled={currentPage === 3}
        className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-sm"
      >
        <span>Next</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
