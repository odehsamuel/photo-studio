import { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate, Link } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { db } from "../../firebase.config";
import Header from "../Header";
import Footer from "../Footer";

function ImageUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [formDetails, setFormDetails] = useState({
    image: null,
    tag: "",
    description: "",
  });

  const navigate = useNavigate();
  const auth = getAuth();
  const { image, tag, description } = formDetails;

  const handleFileChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPG, PNG, WebP)", { theme: "dark" });
      return;
    }

    setFormDetails((prev) => ({
      ...prev,
      image: file,
    }));

    // Create local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewSrc(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    if (e.target.id === "image") {
      handleFileChange(e.target.files[0]);
    } else {
      setFormDetails((prev) => ({
        ...prev,
        [e.target.id]: e.target.value,
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please choose a photo to upload", { theme: "dark" });
      return;
    }

    const tagItems = tag.split(",").map((t) => t.trim()).filter(Boolean);
    if (tagItems.length < 2) {
      toast.error("Please provide at least 2 tags separated by commas (e.g. nature, mountains)", {
        theme: "dark",
      });
      return;
    }

    setIsLoading(true);
    setUploadProgress(10);

    try {
      const storage = getStorage();
      const dateStr = new Date().toISOString().slice(0, 10);
      const storagePath = `images/${dateStr}-${uuidv4()}-${image.name}`;
      const storageRef = ref(storage, storagePath);

      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Storage error:", error);
          toast.error("Upload failed, please check your network connection", { theme: "dark" });
          setIsLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          const docData = {
            webformatURL: downloadURL,
            largeImageURL: downloadURL,
            previewURL: downloadURL,
            tags: tagItems,
            description: description || "",
            likes: 0,
            downloads: 0,
            comments: 0,
            views: 1,
            user: auth.currentUser?.displayName || "Studio Creator",
            userRef: auth.currentUser.uid,
            timestamp: serverTimestamp(),
            status: "approved",
            storagePath,
          };

          await addDoc(collection(db, "images"), docData);

          toast.success("Wallpaper uploaded successfully! 🎉", { theme: "dark" });
          setIsLoading(false);
          navigate("/account");
        }
      );
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Error submitting upload", { theme: "dark" });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 flex-1 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            to="/account"
            className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            My Profile
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-xs text-emerald-400 font-semibold">Upload Wallpaper</span>
        </div>

        {/* Form Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Upload to Lumina Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Share high-resolution photography and 4K wallpapers with our global creative community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Drag & Drop Upload Zone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Wallpaper Image File *
              </label>

              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
                  previewSrc
                    ? "border-emerald-500/50 bg-slate-950/40"
                    : "border-slate-700/80 hover:border-emerald-500/50 bg-slate-950/60"
                }`}
              >
                {previewSrc ? (
                  <div className="flex flex-col items-center">
                    <div className="relative max-h-64 rounded-xl overflow-hidden border border-slate-700 shadow-xl mb-4">
                      <img src={previewSrc} alt="Preview" className="max-h-64 object-contain" />
                    </div>
                    <label
                      htmlFor="image"
                      className="px-4 py-2 text-xs font-semibold rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors"
                    >
                      Change Photo
                    </label>
                  </div>
                ) : (
                  <label htmlFor="image" className="cursor-pointer block">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3 text-emerald-400">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      Click to upload <span className="text-slate-400 font-normal">or drag and drop</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      JPG, PNG, or WebP (Recommended resolution 1920×1080 or 3840×2160)
                    </p>
                  </label>
                )}

                <input
                  type="file"
                  id="image"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Tags Input */}
            <div>
              <label htmlFor="tag" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Tags (Separated by commas) *
              </label>
              <input
                type="text"
                id="tag"
                value={tag}
                onChange={handleChange}
                placeholder="e.g. mountains, sunrise, cyberpunk, minimalist"
                className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-colors"
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Add descriptive keywords so users can find your wallpaper through search and category filters.
              </p>
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor="description" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={handleChange}
                placeholder="Share the story behind this shot, camera settings, location, or inspiration..."
                className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none resize-none transition-colors"
              />
            </div>

            {/* Upload Progress Bar if active */}
            {isLoading && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Uploading to Cloud Storage...</span>
                  <span className="text-emerald-400">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <span>Publish Wallpaper</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ImageUpload;
