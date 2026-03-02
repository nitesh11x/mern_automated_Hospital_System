import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Building2 } from "lucide-react";
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
            toast.success("Access Granted");
        } catch (err) {
            toast.error(err || "Authentication failed");
        }
    };

    return (
        <div className="min-h-screen flex items-stretch bg-white font-sans">
            {/* LEFT SIDE: INSTITUTIONAL BRANDING */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex w-1/2 bg-indigo-600 relative items-center justify-center p-16 overflow-hidden"
            >
                {/* Clean background pattern */}
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div className="relative z-10 max-w-lg">
                    <div className="mb-8 inline-flex items-center gap-3 bg-white/10 px-4 py-2 rounded-sm border border-white/20">
                        <Building2 className="text-white" size={18} />
                        <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Patient Care Portal</span>
                    </div>
                    <h2 className="text-5xl font-extrabold text-white mb-8 tracking-tight uppercase leading-[1.1]">
                        Medical <br /> <span className="text-indigo-200">Excellence</span>
                    </h2>
                    <p className="text-indigo-50 text-lg font-medium max-w-sm leading-relaxed border-l-4 border-indigo-300 pl-6">
                        Secure access to your personal health records, appointments, and medical staff communications.
                    </p>
                </div>
            </motion.div>

            {/* RIGHT SIDE: AUTH FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-[#F8FAFC]">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-white p-10 shadow-sm border border-slate-200 rounded-sm"
                >
                    <div className="mb-10 text-center lg:text-left">
                        <h3 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
                            Sign In
                        </h3>
                        <div className="flex items-center justify-center lg:justify-start gap-2 mt-3">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                                New Patient?
                                <Link to="/register" className="text-indigo-600 ml-2 hover:underline transition-all">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="patient@example.com"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:border-indigo-600 focus:ring-0 outline-none transition-all font-bold text-sm uppercase tracking-wider placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-end px-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    Access Key
                                </label>
                                <a href="#" className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800">Recovery?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:border-indigo-600 focus:ring-0 outline-none transition-all font-bold text-sm"
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
                                className="bg-rose-50 border-l-4 border-rose-500 p-4"
                            >
                                <p className="text-rose-700 text-[10px] font-bold uppercase tracking-widest">
                                    Login Failed: {error}
                                </p>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-5 rounded-sm font-bold uppercase tracking-[0.2em] text-xs shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:translate-y-0.5"
                        >
                            {loading ? "Authenticating..." : "Sign Into Account"}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                Encrypted Healthcare Session
                            </p>
                        </div>
                        <p className="text-[8px] font-medium text-slate-300 uppercase tracking-widest">
                            System Compliance: HIPAA / GDPR / HL7
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;