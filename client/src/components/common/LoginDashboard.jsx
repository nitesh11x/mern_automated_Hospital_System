import React from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Stethoscope,
    ArrowRight,
    Lock,
    ChevronRight,
    Activity,
    Database,
    Building2,
    UserCog
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-20 flex items-center justify-center px-6 py-12 relative overflow-hidden font-sans">
            {/* Subtle Medical Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#4F46E5 0.5px, transparent 0.5px)`,
                    backgroundSize: '30px 30px'
                }}
            />

            <div className="max-w-5xl w-full relative z-10">
                {/* Hospital Branding Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full mb-6"
                    >
                        <Building2 size={16} />
                        <span className="text-[11px] font-bold uppercase tracking-wider">HealthCare Information System</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
                    >
                        Secure <span className="text-indigo-600">Portal</span> Access
                    </motion.h1>
                    <p className="text-slate-500 mt-4 text-sm font-medium max-w-lg mx-auto leading-relaxed">
                        Please select your department to access the clinical management system and patient records.
                    </p>
                </div>

                {/* Selection Grid */}
                <div className="flex justify-center">
                    <div className="max-w-md w-full">
                        <SelectionCard
                            title="Patient Portal"
                            desc="View your medical history, book appointments, and connect with your care team."
                            icon={<Activity size={28} />}
                            type="patient"
                            onClick={() => navigate("/patient/login")}
                        />
                    </div>
                </div>

                {/* Institutional Compliance Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 flex flex-col items-center gap-4"
                >
                    <div className="flex items-center gap-4 opacity-20">
                        <div className="h-px w-24 bg-slate-900" />
                        <ShieldCheck size={24} className="text-slate-900" />
                        <div className="h-px w-24 bg-slate-900" />
                    </div>
                    <div className="text-center">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                            HIPAA Compliant Data Center // End-to-End Encryption
                        </p>
                        <p className="text-slate-300 text-[9px] mt-2 italic">
                            Authorized Personnel Only. All access is logged and monitored.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const SelectionCard = ({ title, desc, icon, onClick, type }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="group relative bg-white border border-slate-200 p-10 rounded-sm cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl hover:border-indigo-200 overflow-hidden"
        >
            {/* Soft Gradient Background on Hover */}
            <div className="absolute inset-0 bg-linear-to-br from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
                {/* Icon Container */}
                <div className={`w-16 h-16 rounded-sm flex items-center justify-center mb-8 border transition-all duration-500 shadow-sm
                    ${type === 'admin'
                        ? 'bg-purple-50 border-purple-100 text-purple-600 group-hover:bg-white/20 group-hover:border-white/30 group-hover:text-white'
                        : type === 'doctor'
                            ? 'bg-indigo-50 border-indigo-100 text-indigo-600 group-hover:bg-white/20 group-hover:border-white/30 group-hover:text-white'
                            : 'bg-emerald-50 border-emerald-100 text-emerald-600 group-hover:bg-white/20 group-hover:border-white/30 group-hover:text-white'
                    }`}>
                    {icon}
                </div>

                {/* Text Content */}
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-slate-900 group-hover:text-white transition-colors duration-300 tracking-tight flex items-center gap-2">
                        {title}
                        <ChevronRight size={20} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </h2>
                </div>

                <p className="text-slate-500 group-hover:text-indigo-50 transition-colors duration-300 leading-relaxed text-sm font-medium">
                    {desc}
                </p>

                {/* Footer Action */}
                <div className="mt-8 pt-6 border-t border-slate-100 group-hover:border-white/20 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 group-hover:text-white transition-colors">
                        Enter Gateway <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                    <Activity size={18} className="text-slate-200 group-hover:text-white/30 transition-colors" />
                </div>
            </div>
        </motion.div>
    );
};

export default LoginDashboard;