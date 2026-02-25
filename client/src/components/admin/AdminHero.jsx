import React from "react";
import { Link } from "react-router-dom";
import {
    UserPlus, Stethoscope, UserCheck, Lock,
    PlusCircle, Users, Calendar, FileText,
    MessageSquarePlus, Edit3, Star, Key,
    ArrowRight, ShieldCheck, Activity
} from "lucide-react";

const AdminHero = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex justify-between items-end mb-8 px-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Console Overview</h1>
                    <p className="text-slate-500 text-xs font-medium">Global Management & Security Systems</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Active Protection</span>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* COLUMN 1: DOCTOR & STAFF */}
                <div className="space-y-6">
                    <SectionHeader title="Staff Management" />
                    <div className="grid grid-cols-1 gap-3">
                        <MiniCard title="Register Doctor" icon={<UserPlus />} to="/doctor/register" primary />
                        <MiniCard title="View All Doctors" icon={<Stethoscope />} to="/doctor/manage" />
                        <MiniCard title="Verify Credentials" icon={<UserCheck />} to="/doctor/verify" />
                        <MiniCard title="Add New Admin" icon={<Lock />} to="/admin/register" />
                    </div>
                </div>

                {/* COLUMN 2: PATIENTS & CLINICAL */}
                <div className="space-y-6">
                    <SectionHeader title="Patient & Records" />
                    <div className="grid grid-cols-1 gap-3">
                        <MiniCard title="Register Patient" icon={<PlusCircle />} to="/patient/register" />
                        <MiniCard title="View All Patients" icon={<Users />} to="/patient/all" />
                        <MiniCard title="View Appointments" icon={<Calendar />} to="/appointments" />
                        <MiniCard title="Medical Records" icon={<FileText />} to="/patient/records" />
                    </div>
                </div>

                {/* COLUMN 3: FEEDBACK & SECURITY */}
                <div className="space-y-6">
                    <SectionHeader title="Reviews & Security" />
                    <div className="grid grid-cols-1 gap-3">
                        <MiniCard title="Add Review" icon={<MessageSquarePlus />} to="/review/add" />
                        <MiniCard title="Edit/Manage Reviews" icon={<Edit3 />} to="/review/edit" />
                        <MiniCard title="View Ratings" icon={<Star />} to="/ratings" />
                        <MiniCard title="Enable OTP / 2FA" icon={<Key />} to="/security" />
                    </div>
                </div>
            </div>

            {/* SYSTEM HEALTH SECTION */}
            <section className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative shadow-2xl">
                <Activity className="absolute -right-6 -bottom-6 text-white/5" size={180} />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h4 className="text-xl font-bold mb-1">System Health</h4>
                        <p className="text-slate-400 text-sm">Security logging and server status monitoring.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/logs" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">View System Logs</Link>
                        <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/30 transition-all hover:scale-105">Moderate Content</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

const SectionHeader = ({ title }) => (
    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{title}</h3>
);

const MiniCard = ({ title, icon, to, primary = false }) => (
    <Link to={to} className="group block">
        <div className={`flex items-center gap-4 p-4 rounded-2xl border border-slate-100 transition-all bg-white hover:border-primary/30 hover:shadow-md hover:shadow-slate-200/50 ${primary ? 'bg-primary/5 border-primary/10' : ''}`}>
            <div className={`p-2.5 rounded-xl shrink-0 ${primary ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400 group-hover:text-primary group-hover:bg-primary/10'}`}>
                {React.cloneElement(icon, { size: 18 })}
            </div>
            <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{title}</p>
                <div className="flex items-center gap-1 text-[9px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
                    Enter Module <ArrowRight size={10} />
                </div>
            </div>
        </div>
    </Link>
);

export default AdminHero;