import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { saveAs } from "file-saver";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import ImagesContext from "../../context/ImagesContext/ImagesContext";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { Loader } from "../Mode/Loader";
import Header from "../Header";
import Footer from "../Footer";
import Image from "../Image";
import canva from "../Mode/icons8-canva-48.png";
import {
  fetchImageStats,
  toggleLike,
  trackDownload,
  fetchComments,
  postComment,
  deleteComment,
} from "../../services/interactionService";

const FILTER_PRESETS = [
  { id: "normal", name: "Normal", class: "filter-normal" },
  { id: "vivid", name: "Vivid", class: "filter-vivid" },
  { id: "noir", name: "Noir (B&W)", class: "filter-noir" },
  { id: "golden", name: "Golden Hour", class: "filter-golden" },
  { id: "cinematic", name: "Cinematic", class: "filter-cinematic" },
  { id: "cyberpunk", name: "Cyberpunk", class: "filter-cyberpunk" },
  { id: "matte", name: "Matte", class: "filter-matte" },
  { id: "dramatic", name: "Dramatic", class: "filter-dramatic" },
];

const QUICK_REACTIONS = [
  "🔥 Stunning wallpaper!",
  "📸 Incredible composition!",
  "✨ Love the lighting & atmosphere!",
  "🎨 Colors are out of this world!",
  "❤️ Instant desktop background!",
];

function ImagePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { images, image, searchSingleImage, SearchImage } = useContext(ImagesContext);
  const { isLoading: isAuthLoading } = useAuthStatus();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Active filter preset
  const [activeFilter, setActiveFilter] = useState("normal");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Interaction stats
  const [stats, setStats] = useState({
    likes: 0,
    downloads: 0,
    comments: 0,
    isLiked: false,
  });

  // Comments state
  const [commentsList, setCommentsList] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);

  const [isLiking, setIsLiking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Parse previewed image
  const previewedImage = Array.isArray(image) ? image[0] : image?.id ? image : null;

  // Fetch image on route param change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const enteredData = localStorage.getItem("searchedData") || "isFalse";
    if (id.length > 10) {
      searchSingleImage(id, enteredData);
    } else {
      searchSingleImage(+id, enteredData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Load persistent stats and comments
  useEffect(() => {
    if (!previewedImage || !previewedImage.id) return;

    let isMounted = true;
    const imgId = previewedImage.id;

    // Fetch stats from Firestore / local cache
    fetchImageStats(
      imgId,
      previewedImage.likes || 0,
      previewedImage.downloads || 0,
      previewedImage.comments || 0,
      currentUser?.uid
    ).then((res) => {
      if (isMounted) setStats(res);
    });

    // Fetch comments
    setLoadingComments(true);
    fetchComments(imgId)
      .then((data) => {
        if (isMounted) {
          setCommentsList(data || []);
          setLoadingComments(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingComments(false);
      });

    return () => {
      isMounted = false;
    };
  }, [previewedImage, currentUser?.uid]);

  // Handle Like Toggle
  const handleLike = async () => {
    if (!currentUser) {
      toast.info("Please log in to like this photo and save to your profile ❤️", { theme: "dark" });
      navigate("/login");
      return;
    }

    if (isLiking || !previewedImage) return;
    setIsLiking(true);

    try {
      const res = await toggleLike(previewedImage, currentUser);
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
  const handleDownload = async () => {
    if (isDownloading || !previewedImage) return;
    setIsDownloading(true);

    try {
      const filename = `lumina-${previewedImage.id || "wallpaper"}.jpg`;
      const urlToDownload = previewedImage.largeImageURL || previewedImage.webformatURL;

      toast.info("Preparing high-res download... 🚀", { theme: "dark", autoClose: 2000 });
      saveAs(urlToDownload, filename);

      const newDownloads = await trackDownload(previewedImage);
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

  // Handle Add Comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const trimmed = newCommentText.trim();
    if (!trimmed || !previewedImage) return;

    if (!currentUser) {
      toast.info("Please log in to leave a comment", { theme: "dark" });
      navigate("/login");
      return;
    }

    setIsSubmittingComment(true);
    try {
      const res = await postComment(previewedImage, currentUser, trimmed);
      if (res && res.comment) {
        setCommentsList((prev) => [res.comment, ...prev]);
        setNewCommentText("");
        setStats((prev) => ({
          ...prev,
          comments: res.commentsCount,
        }));
        toast.success("Comment added to discussion! 💬", { theme: "dark" });
      }
    } catch (err) {
      toast.error("Failed to post comment", { theme: "dark" });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (!previewedImage) return;
    try {
      await deleteComment(commentId, previewedImage.id);
      setCommentsList((prev) => prev.filter((c) => c.id !== commentId));
      setStats((prev) => ({
        ...prev,
        comments: Math.max(0, prev.comments - 1),
      }));
      toast.info("Comment deleted", { theme: "dark" });
    } catch (err) {
      toast.error("Could not delete comment", { theme: "dark" });
    }
  };

  // Handle Share / Copy Link
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Preview link copied to clipboard! 📋", { theme: "dark" });
  };

  // Handle Click on Tag
  const handleTagClick = (tag) => {
    const cleanTag = tag.trim();
    localStorage.setItem("searchedData", cleanTag);
    SearchImage(cleanTag);
    navigate("/");
  };

  if (isAuthLoading || !previewedImage) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader fill="#10b981" />
          <p className="text-slate-400 text-sm font-medium">Loading ultra-HD preview...</p>
        </div>
      </div>
    );
  }

  // Tags list
  const rawTags = previewedImage.tags || "";
  const tagList = typeof rawTags === "string" ? rawTags.split(",").map((t) => t.trim()) : Array.isArray(rawTags) ? rawTags : [];
  const currentFilterClass = FILTER_PRESETS.find((f) => f.id === activeFilter)?.class || "filter-normal";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Header />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 flex-1 w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors py-1 px-3 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-sm"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Gallery
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white py-1.5 px-3.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Photo
          </button>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Image Canvas & Studio Filter Bar (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Image Canvas with Glow */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl group">
              <img
                src={previewedImage.largeImageURL || previewedImage.webformatURL}
                alt={tagList[0] || "Wallpaper preview"}
                className={`w-full max-h-[580px] sm:max-h-[640px] object-contain mx-auto transition-all duration-300 ${currentFilterClass}`}
              />

              {/* Lightbox / Zoom Button */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                title="Fullscreen Lightbox"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>

              {/* Applied Filter Badge */}
              {activeFilter !== "normal" && (
                <div className="absolute bottom-4 left-4 z-10 px-3 py-1 rounded-full bg-slate-950/80 text-emerald-400 border border-emerald-500/30 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-md">
                  <span>✨ Filter:</span>
                  <span className="capitalize">{activeFilter}</span>
                  <button
                    onClick={() => setActiveFilter("normal")}
                    className="ml-1 text-slate-400 hover:text-white"
                    title="Reset filter"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Photo Studio Filter Playground */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">🎨</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Photo Studio Presets
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Click to apply live preview filter</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {FILTER_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setActiveFilter(preset.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                      activeFilter === preset.id
                        ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                        : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700/60"
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Pills */}
            {tagList.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-slate-400 font-medium">Tags:</span>
                {tagList.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTagClick(tag)}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/30 transition-all"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details, Actions & Stats (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Author / Creator Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-lg shadow-md">
                  {(previewedImage.user || "P")[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base leading-tight">
                    {previewedImage.user || "Featured Creator"}
                  </h3>
                  <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Lumina Photographer
                  </p>
                </div>
              </div>

              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                Free License
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Views */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-center">
                <span className="text-xs text-slate-400 block mb-1">Views</span>
                <span className="font-bold text-lg text-white">
                  {Number(previewedImage.views || 0).toLocaleString()}
                </span>
              </div>

              {/* Likes (Interactive) */}
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`p-3.5 rounded-2xl border transition-all text-center group cursor-pointer ${
                  stats.isLiked
                    ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                    : "bg-slate-900/80 border-slate-800/80 hover:border-rose-500/40 text-slate-300 hover:text-white"
                }`}
                title="Toggle Like"
              >
                <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mb-1">
                  <span>Likes</span>
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
                </div>
                <span className={`font-bold text-lg ${stats.isLiked ? "text-rose-400" : "text-white"}`}>
                  {stats.likes}
                </span>
              </button>

              {/* Downloads (Interactive) */}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/40 text-slate-300 hover:text-white transition-all text-center"
                title="Download Photo"
              >
                <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mb-1">
                  <span>Downloads</span>
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <span className="font-bold text-lg text-white">{stats.downloads}</span>
              </button>

              {/* Comments */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-center">
                <span className="text-xs text-slate-400 block mb-1">Comments</span>
                <span className="font-bold text-lg text-white">{stats.comments}</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>{isDownloading ? "Downloading..." : "Download Free 4K"}</span>
              </button>

              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`py-3 px-5 rounded-2xl border font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                  stats.isLiked
                    ? "bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30"
                    : "bg-slate-900 text-slate-200 hover:text-white border-slate-800 hover:border-slate-700"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${stats.isLiked ? "fill-rose-500 text-rose-500" : "fill-none stroke-current"}`}
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>{stats.isLiked ? "Liked" : "Like"}</span>
              </button>

              <a
                href={`https://www.canva.com/design/${previewedImage.previewURL || ""}/edit`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <img src={canva} alt="Canva" className="w-5 h-5 inline-block" />
                <span>Edit in Canva</span>
              </a>
            </div>

            {/* Image Details Collapsible */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
              <div
                className="flex items-center justify-between cursor-pointer font-semibold text-slate-300"
                onClick={() => setShowDetails(!showDetails)}
              >
                <span>Image Specifications & Details</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {showDetails && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span>Dimensions</span>
                    <span className="text-white font-medium">
                      {previewedImage.imageWidth || "3840"} × {previewedImage.imageHeight || "2160"} (4K Ultra HD)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>File Format</span>
                    <span className="text-white font-medium">High Quality JPG / WebP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>License</span>
                    <span className="text-emerald-400 font-medium">Free for commercial & personal use</span>
                  </div>
                  {previewedImage.description && (
                    <div className="pt-2">
                      <span className="block font-medium text-slate-300 mb-1">Description</span>
                      <p className="text-slate-400 leading-relaxed">{previewedImage.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section of Comments (Requested Feature) */}
        <section className="mb-20 pt-8 border-t border-slate-800/80">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">
                💬
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  Community Discussion
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {commentsList.length}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Share your impressions or thoughts with photographers and community members
                </p>
              </div>
            </div>

            {/* Quick Reactions */}
            <div className="mb-4">
              <span className="text-xs text-slate-400 font-medium block mb-2">Quick Reaction:</span>
              <div className="flex flex-wrap gap-2">
                {QUICK_REACTIONS.map((qr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setNewCommentText((prev) => (prev ? `${prev} ${qr}` : qr))}
                    className="text-xs px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              {currentUser ? (
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
                  <div className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xs flex-shrink-0 mt-0.5 shadow-sm">
                      {(currentUser.displayName || currentUser.email || "U")[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <textarea
                        rows={3}
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Write a comment or critique..."
                        className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-sm text-white placeholder-slate-500 outline-none resize-none transition-colors"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[11px] text-slate-500">
                          Posting as{" "}
                          <strong className="text-slate-300">
                            {currentUser.displayName || currentUser.email}
                          </strong>
                        </span>
                        <button
                          type="submit"
                          disabled={isSubmittingComment || !newCommentText.trim()}
                          className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20"
                        >
                          {isSubmittingComment ? "Posting..." : "Post Comment"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <h4 className="font-semibold text-sm text-white">Join the conversation</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Log in to post your comment and save photos across sessions.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors whitespace-nowrap shadow-sm"
                  >
                    Log in to Comment
                  </button>
                </div>
              )}
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {loadingComments ? (
                <div className="py-12 text-center text-slate-400">
                  <div className="w-7 h-7 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs">Loading community discussion...</p>
                </div>
              ) : commentsList.length === 0 ? (
                <div className="py-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80">
                  <span className="text-3xl block mb-2">💬</span>
                  <p className="text-sm font-semibold text-white">No comments yet</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Be the first photographer or enthusiast to share your thoughts on this shot!
                  </p>
                </div>
              ) : (
                commentsList.map((comm) => {
                  const initial = (comm.userName || "U")[0].toUpperCase();
                  const isAuthor = currentUser?.uid && comm.userId === currentUser.uid;

                  return (
                    <div
                      key={comm.id}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex gap-3.5 items-start group"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xs flex-shrink-0 shadow-sm">
                        {initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-white truncate">
                              {comm.userName || "Community Member"}
                            </span>
                            {isAuthor && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium">
                                You
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-500">
                              {comm.createdAt
                                ? new Date(comm.createdAt).toLocaleDateString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : "Recent"}
                            </span>
                            {isAuthor && (
                              <button
                                onClick={() => handleDeleteComment(comm.id)}
                                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 text-xs transition-opacity"
                                title="Delete comment"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1.5 whitespace-pre-wrap break-words leading-relaxed">
                          {comm.text}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* Related Wallpapers Section */}
        {images && images.length > 0 && (
          <section className="pt-12 border-t border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  Similar Wallpapers You Might Like
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Hand-picked visual companions matching this aesthetic
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {images.slice(0, 8).map((rel) => (
                <Image image={rel} key={rel.id} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 transition-colors z-10 border border-white/10"
            title="Close Lightbox"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <img
            src={previewedImage.largeImageURL || previewedImage.webformatURL}
            alt="Fullscreen view"
            className={`max-w-full max-h-[92vh] object-contain rounded-xl shadow-2xl transition-all ${currentFilterClass}`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ImagePreview;
