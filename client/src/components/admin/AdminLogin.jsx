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
  const navigate = useNavigate()
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

      navigate("/admin/dashboard")
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
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-110 relative z-10"
      >
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-white/10 rounded-2xl mb-6 shadow-2xl">
            <ShieldAlert size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight italic">
            Admin<span className="text-primary">Control</span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium">
            Internal Health Systems Access
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
                Authorized Email
              </label>
              <div className="relative group">
                <Terminal
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="email"
                  placeholder="admin@newcare.sys"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
                Security Secret
              </label>
              <div className="relative group">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            {/* Biometric UI */}
            <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
              <Fingerprint size={20} className="text-primary" />
              <p className="text-[11px] text-gray-400 font-medium">
                Biometric verification will be required after this step.
              </p>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
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

        <p className="text-center mt-8 text-gray-600 text-[10px] font-bold uppercase tracking-widest leading-loose">
          Unauthorized Access is Strictly Prohibited <br />
          All actions are logged & monitored by NewCare SecOps
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;