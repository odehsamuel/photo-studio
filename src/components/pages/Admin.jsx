import React, { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../../firebase.config";

function Admin() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllUploads = async () => {
      try {
        const q = query(collection(db, "images"), orderBy("timestamp", "desc"), limit(20));
        const snap = await getDocs(q);
        const list = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        setImages(list);
      } catch (err) {
        console.warn("Admin fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllUploads();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 flex-1 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">Admin Moderation Studio</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review user-uploaded wallpapers, check engagement metrics, and manage site content.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-4">Latest Uploads for Review ({images.length})</h2>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading moderation queue...
            </div>
          ) : images.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No recent uploads in the moderation queue.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-slate-950/70 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Wallpaper</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Tags</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Metrics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {images.map((img) => (
                    <tr key={img.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                          <img src={img.webformatURL} alt="" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-white">{img.user || "Creator"}</td>
                      <td className="py-3 px-4 text-slate-400">
                        {Array.isArray(img.tags) ? img.tags.slice(0, 3).join(", ") : img.tags}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {img.status || "Approved"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-xs text-slate-400">
                        ❤️ {img.likes || 0} • ⬇️ {img.downloads || 0} • 💬 {img.comments || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Admin;