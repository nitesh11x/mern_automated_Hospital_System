import React from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Stethoscope,
    ArrowRight,
    Lock,
    ChevronRight,
    Activity,
    Cpu,
    Database
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FBFBFF] flex items-center justify-center px-6 py-20 relative overflow-hidden font-sans">
            {/* Architectural Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `linear-gradient(#4F46E5 1px, transparent 1px), linear-gradient(90deg, #4F46E5 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

            <div className="max-w-5xl w-full relative z-10">
                {/* Tactical Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 bg-slate-900 text-white px-5 py-2 rounded-sm shadow-xl mb-8"
                    >
                        <Cpu size={14} className="text-indigo-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.5em]">Central Auth Gateway</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-none"
                    >
                        Select <span className="text-indigo-600">Protocol</span>
                    </motion.h1>
                    <p className="text-slate-400 mt-6 text-[11px] font-black uppercase tracking-[0.3em] max-w-lg mx-auto leading-loose">
                        Identify your access level to initialize the secure <br />
                        multi-factor authentication sequence.
                    </p>
                </div>

                {/* Selection Grid */}
                <div className="grid md:grid-cols-2 gap-10">
                    <SelectionCard
                        title="System Admin"
                        desc="Global node management, personnel database control, and high-level platform telemetry."
                        icon={<Database size={32} />}
                        type="admin"
                        color="hover:bg-slate-900 hover:border-slate-900"
                        onClick={() => navigate("/admin/login")}
                    />

                    <SelectionCard
                        title="Medical Staff"
                        desc="Patient registry access, clinical documentation terminal, and real-time diagnostic logs."
                        icon={<Stethoscope size={32} />}
                        type="doctor"
                        color="hover:bg-indigo-600 hover:border-indigo-600"
                        onClick={() => navigate("/doctor/login")}
                    />
                </div>

                {/* System Compliance Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 flex flex-col items-center gap-4"
                >
                    <div className="flex items-center gap-4 opacity-30">
                        <div className="h-px w-20 bg-slate-400" />
                        <ShieldCheck size={20} className="text-slate-900" />
                        <div className="h-px w-20 bg-slate-400" />
                    </div>
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">
                        ISO-27001 Compliant // AES-256 Encrypted Session
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

const SelectionCard = ({ title, desc, icon, onClick, type, color }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`group relative bg-white border border-slate-200 p-12 rounded-sm cursor-pointer transition-all duration-300 shadow-sm hover:shadow-2xl ${color}`}
        >
            {/* Priority Indicator */}
            <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors duration-300 ${type === 'admin' ? 'bg-slate-900 group-hover:bg-white/20' : 'bg-indigo-600 group-hover:bg-white/20'
                }`} />

            {/* Icon Workstation */}
            <div className={`w-20 h-20 rounded-sm flex items-center justify-center mb-10 border transition-all duration-500 ${type === 'admin'
                ? 'bg-slate-50 border-slate-100 text-slate-900 group-hover:bg-white/10 group-hover:border-white/20 group-hover:text-white'
                : 'bg-indigo-50 border-indigo-100 text-indigo-600 group-hover:bg-white/10 group-hover:border-white/20 group-hover:text-white'
                }`}>
                {icon}
            </div>

            {/* Title & Metadata */}
            <div className="mb-6">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-white/50 transition-colors">
                    Security Level: {type === 'admin' ? 'Level 01' : 'Level 02'}
                </span>
                <h2 className="text-3xl font-black text-slate-900 group-hover:text-white transition-colors duration-300 uppercase italic tracking-tighter mt-1 flex items-center gap-3">
                    {title}
                    <ChevronRight size={24} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </h2>
            </div>

            {/* Description Terminal */}
            <p className="text-slate-500 group-hover:text-white/70 transition-colors duration-300 leading-relaxed font-black uppercase text-[10px] tracking-widest opacity-80">
                {desc}
            </p>

            {/* Status Footer */}
            <div className="mt-12 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 group-hover:text-white transition-colors">
                    Initialize <ArrowRight size={14} className="group-hover:translate-x-2 transition-all duration-300" />
                </div>
                <Activity size={16} className="text-slate-100 group-hover:text-white/10 transition-colors" />
            </div>
        </motion.div>
    );
};

export default LoginDashboard;