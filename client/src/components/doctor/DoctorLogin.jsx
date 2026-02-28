import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
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
      const res = await dispatch(
        loginDoctorThunk({ email, password })
      ).unwrap();
      toast.success("Login successful 🎉");

      if (res.success) {
        navigate("/doctor/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 py-20 relative overflow-hidden">

      {/* Decorative */}
      <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
        <Stethoscope size={400} />
      </div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-4xl shadow-xl shadow-primary/10 mb-6 border border-primary/5">
            <Stethoscope size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Doctor <span className="text-primary">Portal</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Authorized medical personnel access only
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Work Email
              </label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="dr.smith@hospital.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-slate-700"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-bold text-primary hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                <input
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-slate-700"
                />
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
              <p className="text-[10px] text-emerald-700 font-semibold leading-tight">
                Your session is encrypted and secure.
              </p>
            </div>

            {/* Button */}
            <button
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-slate-400 text-xs font-medium">
          Need technical assistance?{" "}
          <Link
            to="/contact"
            className="text-primary font-bold hover:underline"
          >
            Contact IT Support
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default DoctorLogin;