import React from "react";
import { Link } from "react-router-dom";
import {
    UserPlus, Stethoscope, UserCheck, Lock,
    PlusCircle, Users, Calendar, FileText,
    MessageSquarePlus, Edit3, Star, Key,
    ArrowRight, ShieldCheck, Activity, ChevronRight,
    ClipboardList, HeartPulse
} from "lucide-react";

const AdminHero = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 font-sans py-8">
            {/* --- INSTITUTIONAL HEADER --- */}
            <header className="flex justify-between items-end mb-10 px-1">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">Administration Portal</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
                        Dashboard <span className="text-indigo-600">Overview</span>
                    </h1>
                </div>

                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-sm shadow-sm">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">System Status: Secure</span>
                </div>
            </header>

            {/* --- CORE MANAGEMENT GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                {/* COLUMN 1: STAFF MANAGEMENT */}
                <div className="space-y-6">
                    <SectionHeader title="Staff & Personnel" />
                    <div className="space-y-2">
                        <MiniCard title="Register Doctor" icon={<UserPlus />} to="/doctor/register" highlight />
                        <MiniCard title="Manage Doctos" icon={<Stethoscope />} to="/doctor/all" />
                        <MiniCard title="Registe New Staff" icon={<UserCheck />} to="/doctor/verify" />
                        <MiniCard title="Register Admin" icon={<Lock />} to="/admin/register" />
                    </div>
                </div>

                {/* COLUMN 2: PATIENT CARE */}
                <div className="space-y-6">
                    <SectionHeader title="Patient Management" />
                    <div className="space-y-2">
                        <MiniCard title="Register Patient" icon={<PlusCircle />} to="/patient/register" />
                        <MiniCard title="Patient Registry" icon={<Users />} to="/patient/all" />
                        <MiniCard title="Appointment Schedule" icon={<Calendar />} to="/appointment/all" />
                        <MiniCard title="Clinical Records" icon={<FileText />} to="/patient/records" />
                    </div>
                </div>

                {/* COLUMN 3: QUALITY & FEEDBACK */}
                <div className="space-y-6">
                    <SectionHeader title="Quality Assurance" />
                    <div className="space-y-2">
                        <MiniCard title="Submit Internal Review" icon={<MessageSquarePlus />} to="/review/add" />
                        <MiniCard title="Feedback Management" icon={<Edit3 />} to="/review/edit" />
                        <MiniCard title="Facility Ratings" icon={<Star />} to="/ratings" />
                        <MiniCard title="Security Protocols" icon={<Key />} to="/security" />
                    </div>
                </div>
            </div>

            {/* --- FACILITY MONITORING FOOTER --- */}
            <section className="mt-12 bg-white border border-slate-200 rounded-sm p-8 shadow-md relative overflow-hidden group">
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
                <HeartPulse className="absolute -right-10 -bottom-10 text-slate-50 group-hover:text-indigo-50 transition-colors" size={200} />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-600 text-white rounded-sm">
                                <ClipboardList size={20} />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 uppercase tracking-tight">System Performance</h4>
                        </div>
                        <p className="text-slate-500 text-xs font-medium max-w-md">
                            Access comprehensive logs regarding institutional data integrity, staff access records, and facility-wide system metrics.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link to="/logs" className="px-6 py-3 border border-slate-200 hover:border-indigo-600 rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all text-slate-600 bg-white">
                            View Audit Logs
                        </Link>
                        <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-sm font-bold text-[10px] uppercase tracking-widest shadow-md transition-all flex items-center gap-2">
                            Facility Management <ChevronRight size={14} />
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
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">{title}</h3>
        <div className="h-px flex-1 bg-slate-200" />
    </div>
);

const MiniCard = ({ title, icon, to, highlight = false }) => (
    <Link to={to} className="group block">
        <div className={`
            flex items-center gap-4 p-4 rounded-sm border transition-all duration-200
            ${highlight
                ? 'bg-indigo-50/50 border-indigo-100 hover:border-indigo-600'
                : 'bg-white border-slate-100 hover:border-indigo-300 hover:shadow-sm'}
        `}>
            <div className={`
                p-2 rounded-sm transition-colors
                ${highlight
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white'}
            `}>
                {React.cloneElement(icon, { size: 18, strokeWidth: 2 })}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                    {title}
                </p>
            </div>

            <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </div>
    </Link>
);

export default AdminHero;