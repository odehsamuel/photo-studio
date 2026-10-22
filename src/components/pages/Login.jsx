import { Link, useNavigate } from "react-router-dom";
import { CameraLogo } from "../Mode/CameraLogo";
import GoogleImage from "../Mode/pngwing.com.png";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.config";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formDetails;
  const navigate = useNavigate();

  function handleChange(e) {
    setFormDetails((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in your email and password", { theme: "dark" });
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters", { theme: "dark" });
      return;
    }

    setIsLoading(true);
    try {
      const auth = getAuth();
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      toast.success(`Welcome back, ${user.displayName || user.email.split("@")[0]}! 👋`, {
        theme: "dark",
      });
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid credentials. Please verify your email and password.", {
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        toast.info("Welcome to Lumina Studio! Setting up your creator profile...", { theme: "dark" });
      } else {
        toast.success(`Welcome back, ${user.displayName}! 👋`, { theme: "dark" });
      }
      navigate("/");
    } catch (error) {
      toast.error("Google authentication failed. Please try again.", { theme: "dark" });
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient glow circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-8 text-center">
        <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
          <CameraLogo />
        </Link>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl z-10">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Sign in to access your saved likes, uploads, and comments.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-colors pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="px-3 text-xs text-slate-500 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogle}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 transition-colors shadow-sm"
        >
          <img src={GoogleImage} alt="Google" className="w-5 h-5 object-contain" />
          <span>Continue with Google</span>
        </button>

        {/* Switch to SignUp */}
        <p className="mt-8 text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-emerald-400 hover:text-emerald-300 font-bold underline ml-1">
            Join Lumina Free
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
