import React from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Stethoscope,
    ArrowRight,
    Lock,
    ChevronRight,
    Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center px-6 py-20 relative overflow-hidden">
            {/* Background Decorative Blurs */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-4xl w-full relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 mb-6"
                    >
                        <Activity size={16} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">System Gateway</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight"
                    >
                        Choose Your <span className="text-primary">Portal</span>
                    </motion.h1>
                    <p className="text-gray-500 mt-4 font-medium italic">Please select your access level to proceed to the secure login.</p>
                </div>

                {/* Selection Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Admin Login Card */}
                    <SelectionCard
                        title="Administrator"
                        desc="Access system settings, manage medical staff, and monitor platform analytics."
                        icon={<Lock size={32} />}
                        type="admin"
                        // Added group-hover:border-transparent to allow the bg color to take over
                        color="hover:bg-slate-900 hover:border-slate-900"
                        onClick={() => navigate("/admin/login")}
                    />

                    {/* Doctor Login Card */}
                    <SelectionCard
                        title="Doctor Login"
                        desc="Manage patient appointments, write prescriptions, and view clinical history."
                        icon={<Stethoscope size={32} />}
                        type="doctor"
                        color="hover:bg-primary hover:border-primary"
                        onClick={() => navigate("/doctor/login")}
                    />
                </div>

                {/* Footer info */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-12 text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]"
                >
                    Secure 256-bit AES Encryption Protected
                </motion.p>
            </div>
        </div>
    );
};

// --- Helper Component ---

const SelectionCard = ({ title, desc, icon, onClick, type, color }) => {
    return (
        <motion.div
            whileHover={{ y: -12 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            // "group" is the key here - it allows children to use group-hover
            className={`group relative bg-white border-2 border-gray-100 p-10 rounded-[3rem] cursor-pointer transition-all duration-500 shadow-xl shadow-gray-200/40 ${color}`}
        >
            {/* Icon Circle */}
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500 ${type === 'admin'
                ? 'bg-slate-100 text-slate-900 group-hover:bg-white/10 group-hover:text-white'
                : 'bg-primary/10 text-primary group-hover:bg-white/10 group-hover:text-white'
                }`}>
                {icon}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-black text-gray-900 group-hover:text-white transition-colors duration-300 mb-4 flex items-center gap-2">
                {title}
                <ChevronRight
                    size={20}
                    className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                />
            </h2>

            {/* Description */}
            <p className="text-gray-500 group-hover:text-white/70 transition-colors duration-300 leading-relaxed font-medium text-sm">
                {desc}
            </p>

            {/* Decorative Badge Icon (Top Right) */}
            <div className="absolute top-10 right-10">
                <ShieldCheck size={24} className="text-gray-100 group-hover:text-white/20 transition-colors duration-300" />
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary group-hover:text-white transition-colors duration-300">
                Enter Portal <ArrowRight size={14} className="group-hover:translate-x-1 transition-all" />
            </div>
        </motion.div>
    );
};

export default LoginDashboard;