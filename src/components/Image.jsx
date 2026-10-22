import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import CommentModal from "./CommentModal";
import { fetchImageStats, toggleLike, trackDownload } from "../services/interactionService";

const Image = ({ image }) => {
  const { webformatURL, previewURL, id, tags, downloads = 0, likes = 0, comments = 0 } = image;

  const [stats, setStats] = useState({
    likes: Number(likes) || 0,
    downloads: Number(downloads) || 0,
    comments: Number(comments) || 0,
    isLiked: false,
  });

  const [isLiking, setIsLiking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  // Load persistent stats & user like state from Firestore / local cache
  useEffect(() => {
    let isMounted = true;
    fetchImageStats(id, likes, downloads, comments, currentUser?.uid).then((res) => {
      if (isMounted) {
        setStats(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [id, likes, downloads, comments, currentUser?.uid]);

  // Handle Like Toggle
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      toast.info("Please log in to save photos to your favorites ❤️", { theme: "dark" });
      navigate("/login");
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    try {
      const res = await toggleLike(image, currentUser);
      setStats((prev) => ({
        ...prev,
        isLiked: res.isLiked,
        likes: res.likesCount,
      }));

      if (res.isLiked) {
        toast.success("Added to your favorites! ❤️", { theme: "dark", autoClose: 2000 });
      } else {
        toast.info("Removed from favorites", { theme: "dark", autoClose: 1500 });
      }
    } catch (err) {
      toast.error("Could not update like status", { theme: "dark" });
    } finally {
      setIsLiking(false);
    }
  };

  // Handle Download
  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const filename = `lumina-${id || "wallpaper"}.jpg`;
      const urlToDownload = webformatURL || previewURL;

      toast.info("Starting download... 🚀", { theme: "dark", autoClose: 2000 });
      saveAs(urlToDownload, filename);

      const newDownloads = await trackDownload(image);
      setStats((prev) => ({
        ...prev,
        downloads: newDownloads,
      }));
    } catch (err) {
      toast.error("Download failed, please try again", { theme: "dark" });
    } finally {
      setIsDownloading(false);
    }
  };

  // Tag list preview
  const tagList = typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : Array.isArray(tags) ? tags : [];

  return (
    <>
      <div className="group relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 hover:border-slate-700 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
        {/* Image Container with Zoom */}
        <div className="relative aspect-[4/5] sm:aspect-square md:aspect-[4/5] w-full overflow-hidden bg-slate-950">
          <Link to={`/image-preview/${encodeURIComponent(tags || "wallpaper")}/${id}`} className="block w-full h-full">
            <img
              src={webformatURL || previewURL}
              alt={tagList[0] || "Curated wallpaper"}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";
              }}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Gradient Overlay for Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Top Left: Tag Badge */}
          {tagList.length > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase bg-slate-950/70 text-slate-200 backdrop-blur-md rounded-full border border-white/10 shadow-sm">
                #{tagList[0]}
              </span>
            </div>
          )}

          {/* Top Right: Like Button */}
          <button
            onClick={handleLike}
            className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-md ${
              stats.isLiked
                ? "bg-rose-500/90 text-white shadow-rose-500/30 scale-105"
                : "bg-slate-950/60 text-slate-200 hover:text-white hover:bg-slate-900 border border-white/10"
            }`}
            title={stats.isLiked ? "Unlike photo" : "Like photo"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 transition-transform duration-300 ${
                stats.isLiked ? "fill-white scale-110" : "fill-none stroke-current"
              }`}
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Bottom Right Floating Quick Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="absolute bottom-3 right-3 z-10 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0"
            title="Download wallpaper"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Save</span>
          </button>
        </div>

        {/* Card Footer Bar */}
        <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs text-slate-400">
          {/* Likes Metric */}
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 hover:text-rose-400 transition-colors"
            title="Likes"
          >
            <svg
              className={`w-3.5 h-3.5 ${stats.isLiked ? "fill-rose-500 text-rose-500" : "fill-none stroke-current"}`}
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className={stats.isLiked ? "font-semibold text-rose-400" : ""}>{stats.likes}</span>
          </button>

          {/* Comments Metric */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setCommentModalOpen(true);
            }}
            className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            title="View or add comments"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>{stats.comments}</span>
          </button>

          {/* Downloads Metric */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
            title="Downloads"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>{stats.downloads}</span>
          </button>
        </div>
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        image={image}
        onCommentAdded={(newCount) => {
          setStats((prev) => ({
            ...prev,
            comments: newCount,
          }));
        }}
      />
    </>
  );
};

export default Image;
