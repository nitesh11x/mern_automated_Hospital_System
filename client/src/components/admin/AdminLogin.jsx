import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Lock,
  ShieldAlert,
  ChevronRight,
  Fingerprint,
  Terminal,
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
      toast.error("All fields are required");
      return;
    }

    try {
      await dispatch(adminLoginThunk({ email, password })).unwrap();
      toast.success("Login successful 🎉");
      dispatch(resetAdminState());
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err || "Login failed");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAdminState());
    }
  }, [error, dispatch]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 relative overflow-hidden">

      {/* Decorative background blurs */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-blue-400/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-slate-200 rounded-2xl mb-6 shadow-xl shadow-slate-200/50">
            <ShieldAlert size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">
            Admin<span className="text-primary">Control</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Internal Health Systems Access
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-100 p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-slate-200/60">
          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                Authorized Email
              </label>
              <div className="relative group">
                <Terminal
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors"
                />
                <input
                  type="email"
                  placeholder="admin@newcare.sys"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-700 placeholder:text-slate-300 outline-none focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                Security Secret
              </label>
              <div className="relative group">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors"
                />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-700 placeholder:text-slate-300 outline-none focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                />
              </div>
            </div>

            {/* Biometric UI Notice */}
            <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
              <Fingerprint size={20} className="text-primary" />
              <p className="text-[11px] text-slate-500 font-medium leading-tight">
                Biometric verification will be required after this step.
              </p>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-2 group disabled:bg-slate-300 disabled:shadow-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Authorize Access
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-loose">
          Unauthorized Access is Strictly Prohibited <br />
          All actions are logged & monitored by NewCare SecOps
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;