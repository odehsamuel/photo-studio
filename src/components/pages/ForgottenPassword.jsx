import { Link, NavLink } from "react-router-dom";
import { CameraLogo } from "../Mode/CameraLogo";
import { toast } from "react-toastify";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";

function ForgottenPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your registered email address", { theme: "dark" });
      return;
    }

    setIsLoading(true);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset instructions sent to your email! ✉️", { theme: "dark" });
      setEmail("");
    } catch (error) {
      toast.error("Could not find an account with that email address", { theme: "dark" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient glow circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-8 text-center">
        <NavLink to="/" className="inline-block hover:opacity-90 transition-opacity">
          <CameraLogo />
        </NavLink>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl z-10">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Reset Password
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enter your email and we'll send you a link to reset your password.
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
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Send Reset Link</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-400">
          Remembered your credentials?{" "}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold underline ml-1">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgottenPassword;
