import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Lock,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Mail,
  Building2,
  AlertCircle
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
  const { loading, error } = useSelector((state) => state.admin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Administrative credentials are required.");
      return;
    }

    try {
      await dispatch(adminLoginThunk({ email, password })).unwrap();
      toast.success("Access Granted");
      dispatch(resetAdminState());
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err || "Authentication failed. Please check your credentials.");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAdminState());
    }
  }, [error, dispatch]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 relative font-sans">

      {/* Background Architectural Grid (Very Subtle) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `linear-gradient(#4F46E5 1px, transparent 1px), linear-gradient(90deg, #4F46E5 1px, transparent 1px)`, backgroundSize: '40px 40px' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Hospital Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white border border-slate-200 rounded-sm mb-4 shadow-sm">
            <Building2 size={28} className="text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">
            Admin <span className="text-indigo-600">Portal</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            Health Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-xl shadow-indigo-900/5 relative">
          {/* Top Decorative Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-600 to-purple-600" />

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">
                Staff Email Address
              </label>
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  placeholder="admin@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-sm py-3.5 pl-11 pr-4 text-sm outline-none focus:bg-white focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">
                  Secure Password
                </label>
              </div>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-sm py-3.5 pl-11 pr-4 text-sm outline-none focus:bg-white focus:border-purple-600 transition-all"
                />
              </div>
            </div>

            {/* Notice Box */}
            <div className="flex items-start gap-3 p-3 bg-indigo-50/50 border border-indigo-100 rounded-sm">
              <ShieldCheck size={18} className="text-indigo-600 mt-0.5" />
              <p className="text-[11px] text-indigo-900 font-medium leading-normal">
                Unauthorized access is strictly prohibited under healthcare privacy regulations.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-sm font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 group disabled:bg-slate-200 disabled:text-slate-500"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In to System
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Warning */}
        <div className="mt-8 text-center flex items-center justify-center gap-2 text-slate-400">
          <AlertCircle size={12} />
          <p className="text-[9px] font-bold uppercase tracking-[0.15em]">
            Institutional Access Point // Session Encrypted
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;