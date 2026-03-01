import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Lock,
  ShieldAlert,
  ChevronRight,
  Fingerprint,
  Terminal,
  Activity
} from "lucide-react";
import {
  adminLoginThunk,
  resetAdminState,
} from "../../redux/slices/admin.slice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAdminAuthenticated, loading, error } = useSelector(
    (state) => state.admin
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Security Protocol: Credentials Required");
      return;
    }

    try {
      await dispatch(adminLoginThunk({ email, password })).unwrap();
      toast.success("Access Granted: Dashboard Initialized");
      dispatch(resetAdminState());
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err || "Authentication Failed");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAdminState());
    }
  }, [error, dispatch]);

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center px-6 relative overflow-hidden font-sans">

      {/* --- THEME ACCENTS (Light Indigo/Purple Blurs) --- */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Branding Terminal */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white border border-slate-100 rounded-sm mb-6 shadow-xl shadow-indigo-100/30 relative group">
            <div className="absolute inset-0 bg-linear-to-tr from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm" />
            <ShieldAlert size={36} className="text-indigo-600 relative z-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">
            Admin<span className="text-indigo-600">.</span>Control
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Activity size={12} className="text-purple-500 animate-pulse" />
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
              Secure Node Access
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-100 p-8 md:p-10 rounded-sm shadow-2xl shadow-indigo-900/5 relative">
          {/* Top Decorative Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-600 to-purple-600 rounded-t-sm" />

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                Authorized Personnel Mail
              </label>
              <div className="relative group">
                <Terminal
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors"
                />
                <input
                  type="email"
                  placeholder="ID_REFERENCE@SYS.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-sm py-4 pl-12 pr-4 text-slate-900 font-bold text-xs placeholder:text-slate-300 placeholder:font-normal outline-none focus:bg-white focus:border-indigo-600/50 transition-all uppercase"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                Access Encryption Key
              </label>
              <div className="relative group">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600 transition-colors"
                />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-sm py-4 pl-12 pr-4 text-slate-900 outline-none focus:bg-white focus:border-purple-600/50 transition-all"
                />
              </div>
            </div>

            {/* Biometric Notice */}
            <div className="flex items-center gap-4 p-4 bg-indigo-50/40 border border-indigo-100/50 rounded-sm">
              <Fingerprint size={24} className="text-indigo-600" />
              <p className="text-[10px] text-indigo-900 font-bold uppercase tracking-tight leading-tight">
                Layer 2 Biometric verification <br /> will be required post-authorization.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-indigo-700 text-white py-5 rounded-sm font-black uppercase tracking-[0.3em] text-[11px] shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 group disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Execute Authentication
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Warning */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-rose-600 text-[10px] font-black uppercase tracking-[0.2em]">
            Security Warning
          </p>
          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest leading-relaxed px-4">
            All unauthorized attempts are intercepted. <br />
            IP and Biometric data is being logged for audit.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;