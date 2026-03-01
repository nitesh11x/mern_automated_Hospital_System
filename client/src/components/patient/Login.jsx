import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { patientLoginThunk } from "../../redux/slices/patient.slice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, isPatientAuthenticated } = useSelector(
        (state) => state.patient
    );
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    /* Redirect after login */
    useEffect(() => {
        if (isPatientAuthenticated) {
            navigate("/patient/dashboard", { replace: true });
        }
    }, [isPatientAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error("All fields are required");
            return;
        }
        try {
            await dispatch(patientLoginThunk(formData)).unwrap();
            toast.success("Identity Verified 🎉");
        } catch (err) {
            toast.error(err || "Authentication failed");
        }
    };

    return (
        <div className="min-h-screen flex items-stretch bg-white font-sans">
            {/* LEFT SIDE: BRANDING & SECURE OVERLAY */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="hidden lg:flex w-1/2 bg-indigo-700 relative items-center justify-center p-16 overflow-hidden"
            >
                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-10" 
                     style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full blur-[120px] opacity-30" />
                
                <div className="relative z-10 max-w-lg">
                    <div className="mb-10 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-sm border border-white/20">
                        <ShieldCheck className="text-indigo-200" size={20} />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Secure Terminal v3.2</span>
                    </div>
                    <h2 className="text-6xl font-black text-white mb-8 tracking-tighter italic uppercase leading-[0.9]">
                        NewCare <br /> <span className="text-indigo-300">Protocol</span>
                    </h2>
                    <p className="text-indigo-100 text-lg font-medium max-w-sm leading-relaxed border-l-2 border-indigo-400 pl-6">
                        Accessing the central healthcare registry requires verified credentials.
                    </p>
                </div>
            </motion.div>

            {/* RIGHT SIDE: AUTH FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-[#FBFBFF]">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-12">
                        <h3 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
                            Sign In
                        </h3>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="w-8 h-1 bg-indigo-600 rounded-sm" />
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                                New User? 
                                <Link to="/register" className="text-indigo-600 ml-2 hover:text-purple-600 transition-colors">
                                    Register Account
                                </Link>
                            </p>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-indigo-900 uppercase tracking-[0.2em] ml-1">
                                System Identifier (Email)
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="USER@NEWCARE.ORG"
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-sm focus:border-indigo-500 focus:ring-0 outline-none transition-all font-bold text-sm uppercase tracking-wider placeholder:text-slate-200 shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-end px-1">
                                <label className="text-[10px] font-black text-indigo-900 uppercase tracking-[0.2em]">
                                    Security Cipher
                                </label>
                                <a href="#" className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-sm focus:border-indigo-500 focus:ring-0 outline-none transition-all font-bold text-sm shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, x: -5 }} 
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-50 border-l-4 border-red-500 p-4"
                            >
                                <p className="text-red-700 text-[10px] font-black uppercase tracking-widest">
                                    System Error: {error}
                                </p>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-5 rounded-sm font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-indigo-200 hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            {loading ? "Authorizing..." : "Initiate Login"}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] text-center leading-loose">
                            End-to-End Encrypted Session <br />
                            Compliance: HIPAA / GDPR Secure
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;