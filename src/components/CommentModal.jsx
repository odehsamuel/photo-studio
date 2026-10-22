import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchComments, postComment } from "../services/interactionService";

const QUICK_COMMENTS = [
  "🔥 Stunning wallpaper!",
  "✨ Incredible lighting & mood!",
  "📸 Perfect composition!",
  "🎨 Beautiful colors!",
  "❤️ Added to my favorites!",
];

const CommentModal = ({ isOpen, onClose, image, onCommentAdded }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen || !image) return;

    let isMounted = true;
    setLoadingComments(true);

    fetchComments(image.id)
      .then((res) => {
        if (isMounted) {
          setComments(res || []);
          setLoadingComments(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingComments(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, image]);

  if (!isOpen || !image) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;

    if (!currentUser) {
      toast.info("Please log in to post your comment", { theme: "dark" });
      onClose();
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await postComment(image, currentUser, trimmed);
      if (res && res.comment) {
        setComments((prev) => [res.comment, ...prev]);
        setCommentText("");
        toast.success("Comment posted successfully! 💬", { theme: "dark" });
        if (onCommentAdded) {
          onCommentAdded(res.commentsCount);
        }
      }
    } catch (err) {
      toast.error("Could not post comment, please try again", { theme: "dark" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAdd = (text) => {
    setCommentText((prev) => (prev ? `${prev} ${text}` : text));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10 animate-fade-in text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
              <img
                src={image.previewURL || image.webformatURL}
                alt="thumb"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Community Discussion</h3>
              <p className="text-xs text-slate-400">
                {comments.length} {comments.length === 1 ? "comment" : "comments"} on this photo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Comment List */}
        <div className="my-4 max-h-60 overflow-y-auto pr-1 flex flex-col gap-3">
          {loadingComments ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading discussion...
            </div>
          ) : comments.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <span className="text-3xl block mb-2">💬</span>
              <p className="text-sm font-medium text-slate-300">No comments yet</p>
              <p className="text-xs text-slate-500 mt-1">Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((c) => {
              const initial = (c.userName || "U")[0].toUpperCase();
              return (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 flex gap-3 items-start"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xs flex-shrink-0">
                    {initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-white truncate">
                        {c.userName || "Community Member"}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "Recent"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 whitespace-pre-wrap break-words leading-relaxed">
                      {c.text}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Reactions */}
        <div className="mb-3">
          <p className="text-[11px] text-slate-400 mb-1.5 font-medium">Quick Reactions:</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_COMMENTS.map((qc, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickAdd(qc)}
                className="text-xs px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              >
                {qc}
              </button>
            ))}
          </div>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="pt-2 border-t border-slate-800">
          {currentUser ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-4 py-2 text-xs sm:text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
              />
              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-500/20"
              >
                {isSubmitting ? "Posting..." : "Post"}
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 text-center">
              <p className="text-xs text-slate-400">
                Want to join the conversation?{" "}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate("/login");
                  }}
                  className="text-emerald-400 font-semibold underline hover:text-emerald-300 ml-1"
                >
                  Log in to comment
                </button>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CommentModal;
