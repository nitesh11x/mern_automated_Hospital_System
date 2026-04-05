import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  Activity,
  Terminal,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginDoctorThunk } from "../../redux/slices/doctor.slice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const DoctorLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.doctor);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(loginDoctorThunk({ email, password })).unwrap();
      toast.success("Identity Verified. Welcome back.");
      if (res.success) {
        navigate("/doctor/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-indigo-50 flex items-center justify-center font-sans relative overflow-hidden">
      {/* Structural Decorative Elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#4F46E5 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="max-w-5xl w-full grid lg:grid-cols-2 bg-white shadow-2xl rounded-sm overflow-hidden border border-indigo-100 m-6">

        {/* Left Column: Visual Branding - Light Purple Theme */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-600 to-purple-700 p-16 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <Activity className="text-indigo-300" size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-200">Personnel Node 01</span>
            </div>
            <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-4">
              Medical <br /> <span className="text-indigo-200 text-7xl">Portal</span>
            </h1>
            <p className="text-indigo-100 text-xs font-black uppercase tracking-widest max-w-xs leading-loose">
              Secure gateway for verified medical practitioners and staff.
            </p>
          </div>

          <div className="relative z-10 border-t border-indigo-400/30 pt-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-500/30 rounded-sm flex items-center justify-center border border-indigo-400/50">
                <Terminal size={18} className="text-indigo-200" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-300">System Status</p>
                <p className="text-[10px] font-black uppercase text-emerald-300">All Modules Operational</p>
              </div>
            </div>
          </div>

          {/* Background Aesthetic */}
          <Stethoscope size={500} className="absolute -right-20 -bottom-20 text-white/5 rotate-12" />
        </div>

        {/* Right Column: Auth Form */}
        <div className="p-10 md:p-16 flex flex-col justify-center bg-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-1 bg-indigo-600 rounded-sm" />
                <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">Login</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 uppercase italic">Doctor Access</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                  Access Identifier (Email)
                </label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="ID@HOSPITAL-NETWORK.COM"
                    className="w-full pl-14 pr-6 py-5 bg-indigo-50 border border-indigo-100 rounded-sm outline-none focus:bg-white focus:border-indigo-500 transition-all text-[11px] font-black uppercase tracking-widest placeholder:opacity-50 text-slate-700"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Security Credentials
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[9px] font-black uppercase text-indigo-600 tracking-widest hover:text-indigo-800"
                  >
                    Reset Password
                  </Link>
                </div>
                <div className="relative group">
                  <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full pl-14 pr-6 py-5 bg-indigo-50 border border-indigo-100 rounded-sm outline-none focus:bg-white focus:border-indigo-500 transition-all text-[11px] font-black uppercase tracking-widest text-slate-700"
                  />
                </div>
              </div>

              {/* Security Protocol */}
              <div className="flex items-center gap-4 p-5 bg-indigo-50 border border-indigo-100 rounded-sm">
                <ShieldCheck size={20} className="text-indigo-600 shrink-0" strokeWidth={3} />
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest leading-relaxed">
                  Encryption active. Unauthorized access is <br />
                  logged and reported to security.
                </p>
              </div>

              {/* Button */}
              <button
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-6 rounded-sm font-black uppercase tracking-[0.3em] text-[12px] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Initialize Session
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-indigo-100 text-center">
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">
                Network Technical Support:{" "}
                <Link to="/contact" className="text-indigo-600 hover:text-indigo-800 ml-2">
                  Request Assistance
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;