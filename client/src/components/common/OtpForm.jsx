import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ShieldCheck, ArrowRight, X, RefreshCcw, Lock, Key } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { sendOtpThunk, verifyOtpThunk } from "../../redux/slices/otp.slice";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const OtpForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.otp || { loading: false });

    const [email, setEmail] = useState(localStorage.getItem("patientEmail") || "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputsRef = useRef([]);

    /* ================= SYSTEM LOGIC ================= */
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("IDENTIFIER_REQUIRED");
            return;
        }
        try {
            await dispatch(sendOtpThunk(email)).unwrap();
            toast.success("Verification packet dispatched.");
            setIsModalOpen(true);
            localStorage.setItem("patientEmail", email);
            setTimeout(() => inputsRef.current[0]?.focus(), 150);
        } catch (err) {
            toast.error(err || "DISPATCH_FAILED");
        }
    };

    const handleOtpChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && inputsRef.current[index + 1]) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && inputsRef.current[index - 1]) {
            inputsRef.current[index - 1].focus();
        }
    };

    const verifyOtp = async () => {
        const finalOtp = otp.join("");
        if (finalOtp.length !== 6) {
            toast.error("COMPLETE_SEQUENCE_REQUIRED");
            return;
        }
        const storedEmail = localStorage.getItem("patientEmail");
        try {
            await dispatch(verifyOtpThunk({ email: storedEmail, otp: finalOtp })).unwrap();
            toast.success("Identity Authenticated.");
            setOtp(["", "", "", "", "", ""]);
            setIsModalOpen(false);
            navigate("/patient/register", { replace: true });
        } catch (err) {
            toast.error(err || "INVALID_SEQUENCE");
        }
    };

    const handleResend = async () => {
        const storedEmail = localStorage.getItem("patientEmail");
        if (!storedEmail) {
            toast.error("IDENTIFIER_REQUIRED");
            return;
        }
        try {
            await dispatch(sendOtpThunk(storedEmail)).unwrap();
            toast.success("Verification packet dispatched.");
        } catch (err) {
            toast.error(err || "DISPATCH_FAILED");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFF] px-6 font-sans">

            {/* STEP 1: INITIAL DISPATCH */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white p-12 lg:p-16 rounded-sm shadow-2xl border border-slate-200"
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-1 bg-indigo-600" />
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Auth Protocol 02</span>
                </div>

                <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase italic tracking-tighter">
                    Access <span className="text-indigo-600">Verification</span>
                </h2>
                <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest leading-loose mb-10">
                    Enter your registered email to receive a 6-digit authentication sequence.
                </p>

                <form onSubmit={handleSendOtp} className="space-y-8">
                    <div className="relative group">
                        <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            required
                            type="email"
                            placeholder="USER@SYSTEM-NETWORK.COM"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-sm outline-none focus:bg-white focus:border-indigo-600 transition-all text-[11px] font-black tracking-widest uppercase placeholder:opacity-30"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-6 rounded-sm font-black uppercase tracking-[0.3em] text-[12px] shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                        {loading ? "INITIALIZING DISPATCH..." : "GENERATE ACCESS CODE"}
                        {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>

                    <div className="text-center pt-8 border-t border-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Existing Node?
                        <Link to="/patient/login" className="text-indigo-600 ml-2 hover:text-slate-900">
                            Return to Login
                        </Link>
                    </div>
                </form>
            </motion.div>

            {/* STEP 2: VERIFICATION TERMINAL (MODAL) */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-md bg-white rounded-sm p-12 shadow-2xl border-t-4 border-indigo-600"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors">
                                <X size={20} />
                            </button>

                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 border border-slate-100 rounded-sm mb-8">
                                    <Key size={28} className="text-indigo-600" />
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Sequence Entry</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">
                                    Input 6-digit key sent to your terminal
                                </p>

                                <div className="flex justify-between gap-2 mb-10">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputsRef.current[index] = el)}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(e.target.value, index)}
                                            onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                            className="w-full h-16 text-xl font-black text-center bg-slate-50 border border-slate-200 rounded-sm focus:border-indigo-600 focus:bg-white outline-none transition-all text-slate-900"
                                        />
                                    ))}
                                </div>

                                <button onClick={verifyOtp} disabled={loading} className="w-full bg-indigo-600 text-white py-6 rounded-sm font-black uppercase tracking-[0.3em] text-[11px] mb-6 shadow-lg shadow-indigo-600/20 hover:bg-slate-900 transition-all">
                                    {loading ? "VALIDATING..." : "AUTHENTICATE SESSION"}
                                </button>

                                <button onClick={handleResend} className="flex items-center justify-center gap-2 mx-auto text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors">
                                    <RefreshCcw size={12} /> Request New Sequence
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OtpForm;