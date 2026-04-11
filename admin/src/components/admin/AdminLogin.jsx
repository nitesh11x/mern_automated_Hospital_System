import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Mail,
  ShieldAlert,
  Server,
  Activity,
  ChevronRight,
  Fingerprint
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
  const [isFocused, setIsFocused] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Security keys are required.");
      return;
    }

    try {
      await dispatch(adminLoginThunk({ email, password })).unwrap();
      toast.success("SYSTEM OVERRIDE: ACCESS GRANTED");
      dispatch(resetAdminState());
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error("ACCESS DENIED: " + (err || "Invalid credentials"));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAdminState());
    }
  }, [error, dispatch]);

  return (
    <div className="min-h-screen bg-[#F8F9FE] pt-24 flex items-center justify-center p-6 relative font-sans overflow-hidden selection:bg-purple-500/30">

      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-300/40 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-300/40 blur-[120px]" />

        {/* Soft Grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) scale(2.5)',
            transformOrigin: 'top center'
          }}
        />

        {/* Scanning Line */}
        <motion.div
          animate={{ y: ["-10vh", "110vh"] }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-purple-400 to-transparent opacity-40 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="relative group perspective-1000">

          {/* Glassmorphism Container */}
          <div className="bg-white/60 backdrop-blur-3xl border border-white p-10 rounded-xl shadow-2xl relative overflow-hidden transition-all duration-500 hover:shadow-purple-500/10 hover:border-purple-200">

            {/* Top decorative bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90" />

            {/* Header */}
            <div className="text-center mb-10 mt-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="inline-flex items-center justify-center p-4 rounded-full bg-white border border-purple-100 mb-6 shadow-xl shadow-purple-500/10"
              >
                <Server size={32} className="text-indigo-600" />
              </motion.div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase mb-2">
                Central <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">Command</span>
              </h1>
              <div className="flex items-center justify-center gap-2 text-indigo-600">
                <Activity size={14} className="animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Secure Admin Uplink</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <span>Terminal ID</span>
                </label>
                <div className={`relative flex items-center transition-all duration-300 ${isFocused === 'email' ? 'scale-[1.02]' : ''}`}>
                  <div className={`absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center transition-colors ${isFocused === 'email' ? 'text-indigo-600' : 'text-slate-400'}`}>
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onFocus={() => setIsFocused('email')}
                    onBlur={() => setIsFocused(null)}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter clearance email..."
                    className="w-full bg-white/80 border border-slate-200 rounded-lg py-4 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:bg-indigo-50/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono shadow-sm"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <span>Security Cipher</span>
                </label>
                <div className={`relative flex items-center transition-all duration-300 ${isFocused === 'password' ? 'scale-[1.02]' : ''}`}>
                  <div className={`absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center transition-colors ${isFocused === 'password' ? 'text-indigo-600' : 'text-slate-400'}`}>
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onFocus={() => setIsFocused('password')}
                    onBlur={() => setIsFocused(null)}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full bg-white/80 border border-slate-200 rounded-lg py-4 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:bg-indigo-50/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono shadow-sm"
                  />
                </div>
              </div>

              {/* Security Warning Box */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-start gap-3 relative overflow-hidden mt-6 shadow-sm">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                <ShieldAlert size={18} className="text-indigo-600 shrink-0 animate-pulse mt-0.5" />
                <p className="text-[10px] font-bold text-indigo-900/80 leading-relaxed uppercase tracking-wider">
                  Level 5 Authorization Required. All unauthorized intrusion attempts are logged and traced.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full mt-8 group overflow-hidden rounded-lg shadow-xl shadow-indigo-600/20"
              >
                <div className="absolute inset-0 bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-transparent text-white py-4 flex items-center justify-center gap-3">
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <Fingerprint size={18} className="animate-pulse text-white/80" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Decrypting...</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Initiate Uplink</span>
                      <ChevronRight size={16} className="text-indigo-200 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center flex flex-col items-center gap-2 text-indigo-900/40">
          <p className="text-[8px] font-bold uppercase tracking-[0.4em]">
            SYSTEM V.2.0.4 // ENCRYPTED NODE
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;