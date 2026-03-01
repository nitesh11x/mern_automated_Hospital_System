import React from "react";
import { Link } from "react-router-dom";
import {
    UserPlus, Stethoscope, UserCheck, Lock,
    PlusCircle, Users, Calendar, FileText,
    MessageSquarePlus, Edit3, Star, Key,
    ArrowRight, ShieldCheck, Activity, ChevronRight
} from "lucide-react";

const AdminHero = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 font-sans">
            {/* --- HEADER --- */}
            <header className="flex justify-between items-end mb-10 px-1">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Central Command</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">
                        Console <span className="text-indigo-600">Overview</span>
                    </h1>
                </div>

                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white border border-slate-100 rounded-sm shadow-sm">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Integrity: Optimal</span>
                </div>
            </header>

            {/* --- CORE GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                {/* COLUMN 1: STAFF MANAGEMENT */}
                <div className="space-y-6">
                    <SectionHeader title="Staff & Personnel" />
                    <div className="space-y-3">
                        <MiniCard title="Register Doctor" icon={<UserPlus />} to="/doctor/register" highlight />
                        <MiniCard title="View All Doctors" icon={<Stethoscope />} to="/doctor/all" />
                        <MiniCard title="Verify Credentials" icon={<UserCheck />} to="/doctor/verify" />
                        <MiniCard title="Add New Admin" icon={<Lock />} to="/admin/register" />
                    </div>
                </div>

                {/* COLUMN 2: PATIENTS & CLINICAL */}
                <div className="space-y-6">
                    <SectionHeader title="Clinical Workflow" />
                    <div className="space-y-3">
                        <MiniCard title="Register Patient" icon={<PlusCircle />} to="/patient/register" />
                        <MiniCard title="View All Patients" icon={<Users />} to="/patient/all" />
                        <MiniCard title="View Appointments" icon={<Calendar />} to="/appointment/all" />
                        <MiniCard title="Medical Records" icon={<FileText />} to="/patient/records" />
                    </div>
                </div>

                {/* COLUMN 3: SYSTEM AUDIT */}
                <div className="space-y-6">
                    <SectionHeader title="Security & Feedback" />
                    <div className="space-y-3">
                        <MiniCard title="Add Review" icon={<MessageSquarePlus />} to="/review/add" />
                        <MiniCard title="Manage Feedback" icon={<Edit3 />} to="/review/edit" />
                        <MiniCard title="System Ratings" icon={<Star />} to="/ratings" />
                        <MiniCard title="Security Protocols" icon={<Key />} to="/security" />
                    </div>
                </div>
            </div>

            {/* --- SYSTEM TELEMETRY FOOTER --- */}
            <section className="mt-12 bg-white border border-slate-100 rounded-sm p-8 shadow-xl shadow-indigo-900/5 relative overflow-hidden group">
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-linear-to-b from-indigo-600 to-purple-600" />
                <Activity className="absolute -right-10 -bottom-10 text-slate-50 group-hover:text-indigo-50/50 transition-colors" size={200} />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-600 text-white rounded-sm">
                                <Activity size={20} />
                            </div>
                            <h4 className="text-xl font-black text-slate-900 uppercase italic">Network Telemetry</h4>
                        </div>
                        <p className="text-slate-500 text-xs font-medium max-w-md">
                            Monitor real-time security logs, server uptime, and active administrative sessions across the hospital network.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Link to="/logs" className="px-6 py-3 border border-slate-200 hover:border-indigo-600 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] transition-all text-slate-600">
                            Audit Logs
                        </Link>
                        <button className="px-8 py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-sm font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-200 transition-all flex items-center gap-2">
                            Moderate Content <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const SectionHeader = ({ title }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-slate-100" />
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{title}</h3>
    </div>
);

const MiniCard = ({ title, icon, to, highlight = false }) => (
    <Link to={to} className="group block">
        <div className={`
            flex items-center gap-4 p-4 rounded-sm border transition-all duration-300
            ${highlight
                ? 'bg-indigo-50/30 border-indigo-100 hover:border-indigo-600'
                : 'bg-white border-slate-100 hover:border-purple-600 hover:shadow-lg hover:shadow-indigo-900/5'}
        `}>
            <div className={`
                p-2.5 rounded-sm transition-colors
                ${highlight
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-50 text-slate-400 group-hover:bg-purple-600 group-hover:text-white'}
            `}>
                {React.cloneElement(icon, { size: 18, strokeWidth: 2.5 })}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-800 uppercase tracking-tight group-hover:text-slate-900">
                    {title}
                </p>
                <div className="flex items-center gap-1 text-[9px] font-black text-indigo-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all uppercase tracking-widest mt-0.5">
                    Launch Module <ArrowRight size={10} />
                </div>
            </div>
        </div>
    </Link>
);

export default AdminHero;