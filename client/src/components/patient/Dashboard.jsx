import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Calendar,
    FileText,
    Settings,
    LogOut,
    Bell,
    Search,
    Activity,
    Droplets,
    Thermometer,
    ChevronRight,
    ArrowUpRight,
    Zap
} from "lucide-react";

// --- Metrics Data ---
const RECENT_VISITS = [
    { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Cardiology", date: "OCT 12, 2026", status: "Completed" },
    { id: 2, doctor: "Dr. Michael Chen", specialty: "General Medicine", date: "SEP 28, 2026", status: "Follow-up" },
    { id: 3, doctor: "Dr. Emily Blunt", specialty: "Dermatology", date: "AUG 15, 2026", status: "Completed" },
];

const HEALTH_STATS = [
    { label: "Heart Rate", value: "72 bpm", icon: <Activity size={18} />, color: "text-rose-500", border: "border-rose-200" },
    { label: "Glucose", value: "95 mg/dL", icon: <Droplets size={18} />, color: "text-indigo-500", border: "border-indigo-200" },
    { label: "Body Temp", value: "36.6 °C", icon: <Thermometer size={18} />, color: "text-amber-500", border: "border-amber-200" },
];

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");

    return (
        <div className="flex min-h-screen bg-[#FBFBFF] pt-16 font-sans">

            {/* --- SIDEBAR (ARCHITECTURAL RIGIDITY) --- */}
            <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col p-8 sticky top-16 h-[calc(100vh-64px)]">
                <div className="mb-10 px-4">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Patient Terminal v3</p>
                </div>

                <nav className="flex-1 space-y-1">
                    <SidebarItem
                        icon={<LayoutDashboard size={18} />}
                        label="System Overview"
                        active={activeTab === "dashboard"}
                        onClick={() => setActiveTab("dashboard")}
                    />
                    <SidebarItem
                        icon={<Calendar size={18} />}
                        label="Appointments"
                        active={activeTab === "visits"}
                        onClick={() => setActiveTab("visits")}
                    />
                    <SidebarItem icon={<FileText size={18} />} label="Health Records" />
                    <SidebarItem icon={<Settings size={18} />} label="Settings" />
                </nav>

                <button className="flex items-center gap-3 px-6 py-4 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-all mt-auto font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-red-100">
                    <LogOut size={16} /> Terminate Session
                </button>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 p-6 md:p-12 pb-24 lg:pb-12 max-w-7xl">
                {/* Header Section */}
                <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-10 h-1 bg-indigo-600 rounded-sm" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Biometric Data Log</p>
                        </div>
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            Welcome, <span className="text-indigo-600 underline decoration-4 underline-offset-8">Alex</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="QUERY PATIENT RECORDS..."
                                className="w-full md:w-80 pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-sm shadow-sm focus:border-indigo-600 outline-none font-bold text-[10px] tracking-widest uppercase"
                            />
                        </div>
                        <button className="p-4 bg-white border border-slate-200 rounded-sm text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-indigo-600 rounded-sm border-2 border-white" />
                        </button>
                    </div>
                </header>

                {/* Telemetry Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                    {HEALTH_STATS.map((stat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -2 }}
                            className={`bg-white p-8 rounded-sm shadow-sm border-l-4 ${stat.border} flex flex-col gap-4 group hover:shadow-md transition-all`}
                        >
                            <div className={`${stat.color} flex justify-between items-start`}>
                                {stat.icon}
                                <ArrowUpRight size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                <p className="text-4xl font-black text-slate-900 tracking-tighter italic leading-none">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Visit Protocol Section */}
                    <section className="lg:col-span-2 bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Visit Protocol Logs</h3>
                            <button className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:text-purple-700 flex items-center gap-2 group">
                                View Registry <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white border-b border-slate-100">
                                        <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Medical Officer</th>
                                        <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date Node</th>
                                        <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Auth Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {RECENT_VISITS.map((visit) => (
                                        <tr key={visit.id} className="hover:bg-indigo-50/20 transition-colors group">
                                            <td className="px-8 py-6">
                                                <p className="font-black text-slate-900 text-sm uppercase tracking-tight italic">{visit.doctor}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{visit.specialty}</p>
                                            </td>
                                            <td className="px-8 py-6 text-[10px] font-black text-slate-500 tracking-widest">{visit.date}</td>
                                            <td className="px-8 py-6 text-right">
                                                <span className={`px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-[0.15em] border ${visit.status === 'Completed'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                    : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                                    }`}>
                                                    {visit.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Action Hub */}
                    <section className="space-y-8">
                        <div className="bg-slate-900 rounded-sm p-10 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Zap size={100} strokeWidth={4} />
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Priority<br />Booking</h4>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed mb-8">Direct interface with verified specialists.</p>
                                <button className="w-full bg-indigo-600 text-white py-5 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all">
                                    Iniate Sync
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-sm p-8 border border-slate-200 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Upcoming Event</h4>
                            <div className="flex gap-5 items-center p-6 bg-slate-50 rounded-sm border border-slate-100">
                                <div className="bg-indigo-600 p-3 rounded-sm text-white shadow-lg shadow-indigo-200">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Dr. Emily Blunt</p>
                                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter mt-0.5">24 OCT • 10:00 AM</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm transition-all border-l-4 uppercase tracking-[0.2em] text-[10px] font-black ${active
            ? "bg-indigo-50 text-indigo-600 border-indigo-600"
            : "text-slate-400 border-transparent hover:bg-slate-50 hover:text-slate-900"
            }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

export default Dashboard;