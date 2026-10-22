import { useContext, useEffect } from "react";
import Image from "./Image";
import ImagesContext from "../context/ImagesContext/ImagesContext";
import Pagination from "./Pagination";

const ImageList = () => {
  const { images, FetchImages } = useContext(ImagesContext);
  const newImages = images.slice(0, 16);

  useEffect(() => {
    // Only fetch if images is empty
    if (!images || images.length === 0) {
      FetchImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2 border-b border-slate-800/80 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Trending Wallpapers
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              4K Ultra HD
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Free high-resolution downloads for desktop, mobile & creators
          </p>
        </div>
        <div className="text-xs text-slate-500 self-start sm:self-auto">
          Showing <span className="text-slate-300 font-semibold">{newImages.length}</span> results
        </div>
      </div>

      {/* Grid */}
      {images.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {newImages.map((image) => (
              <Image image={image} key={image.id} />
            ))}
          </div>
          <Pagination />
        </>
      ) : (
        <div className="py-24 text-center bg-slate-900/50 rounded-3xl border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4 text-3xl">
            🔍
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No wallpapers found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
            We couldn't find matching wallpapers for your query. Try searching for "nature", "neon", or "minimalist".
          </p>
          <button
            onClick={() => {
              localStorage.setItem("searchedData", "isFalse");
              FetchImages();
            }}
            className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
          >
            Reset Search
          </button>
        </div>
      )}
    </section>
  );
};

export default ImageList;
