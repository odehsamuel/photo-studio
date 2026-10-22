import { useContext, useState, useEffect } from "react";
import ImagesContext from "../context/ImagesContext/ImagesContext";

const CATEGORIES = [
  { name: "All", query: "isFalse", icon: "✨" },
  { name: "Wallpapers", query: "wallpaper", icon: "🌌" },
  { name: "Nature", query: "nature", icon: "🌲" },
  { name: "Cyberpunk", query: "cyberpunk neon", icon: "⚡" },
  { name: "Architecture", query: "architecture modern", icon: "🏙️" },
  { name: "Animals", query: "wildlife animals", icon: "🐾" },
  { name: "Cars", query: "sports car supercar", icon: "🏎️" },
  { name: "Minimalist", query: "minimalist aesthetic", icon: "🎨" },
  { name: "Travel", query: "travel landscape", icon: "✈️" },
];

function ImageCarousel() {
  const { images, SearchImage, FetchImages } = useContext(ImagesContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");

  const carouselItems = images && images.length > 0 ? images.slice(0, 5) : [];

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (carouselItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category.name);
    if (category.query === "isFalse") {
      localStorage.setItem("searchedData", "isFalse");
      FetchImages();
    } else {
      localStorage.setItem("searchedData", category.query);
      SearchImage(category.query);
    }

    const anchor = document.getElementById("gallery-anchor");
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!carouselItems || carouselItems.length === 0) {
    return (
      <div className="relative pt-24 pb-12 px-4 max-w-7xl mx-auto text-center">
        <div className="h-72 rounded-3xl bg-slate-900 animate-pulse border border-slate-800"></div>
      </div>
    );
  }

  return (
    <div className="relative pt-24 sm:pt-28 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Banner Container */}
      <div className="relative h-[420px] sm:h-[480px] lg:h-[520px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Background Image with smooth transition */}
        <div className="absolute inset-0 bg-slate-950">
          {carouselItems.map((item, idx) => (
            <img
              key={item.id || idx}
              src={item.largeImageURL || item.webformatURL}
              alt="Curated Background"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                idx === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
              }`}
            />
          ))}
          {/* Multi-layer gradient overlays for readability and luxury feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-10 lg:p-14 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold backdrop-blur-md mb-4 self-start">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Curated 4K Photography & Wallpapers
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
            Visual Inspiration for{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Every Screen
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
            Discover thousands of handpicked ultra-high-definition wallpapers. Like your favorites, join the discussion, and download instantly.
          </p>

          {/* Quick stats badge */}
          <div className="mt-6 flex items-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">10,000+</span> Wallpapers
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">100% Free</span> High-Res
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-400 text-base">Community</span> Driven
            </div>
          </div>
        </div>

        {/* Carousel slide indicators */}
        <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-20 flex items-center gap-2 bg-slate-950/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {carouselItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-6 bg-emerald-400" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Prev / Next controls */}
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-950/40 hover:bg-slate-950/80 text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-all opacity-0 sm:group-hover:opacity-100 hover:scale-110"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % carouselItems.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-950/40 hover:bg-slate-950/80 text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-all opacity-0 sm:group-hover:opacity-100 hover:scale-110"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Category Pills Bar */}
      <div id="gallery-anchor" className="pt-8 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Explore Categories</h2>
          </div>
          <span className="text-xs text-slate-400">Click to filter gallery</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                activeCategory === cat.name
                  ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                  : "bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageCarousel;
