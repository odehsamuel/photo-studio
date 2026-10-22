import { useContext, useEffect } from "react";
import Footer from "../Footer";
import Header from "../Header";
import ImageCarousel from "../ImageCarousel";
import ImageList from "../ImageList";
import { Loader } from "../Mode/Loader";
import { useAuthStatus } from "../hooks/useAuthStatus";
import ImagesContext from "../../context/ImagesContext/ImagesContext";

function Home() {
  const { isSearchValid, FetchImages } = useContext(ImagesContext);
  const { isLoading } = useAuthStatus();

  useEffect(() => {
    // Keep searchedData or reset if navigating fresh
    const saved = localStorage.getItem("searchedData");
    if (!saved) {
      localStorage.setItem("searchedData", "isFalse");
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader fill="#10b981" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Entering Lumina Studio...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Header />

      <main className="flex-1 w-full">
        {isSearchValid ? (
          <>
            <ImageCarousel />
            <ImageList />
          </>
        ) : (
          <div className="max-w-xl mx-auto px-4 py-36 text-center">
            <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6 text-4xl">
              🔍
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">
              No Wallpapers Found
            </h2>
            <p className="text-sm text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
              We couldn't find any photos matching that search query. Try exploring trending tags like "mountains", "neon", or "minimalist".
            </p>
            <button
              onClick={() => {
                localStorage.setItem("searchedData", "isFalse");
                FetchImages();
              }}
              className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all"
            >
              Reset to Trending Gallery
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Home;
