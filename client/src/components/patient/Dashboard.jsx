import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatientAppointments } from "../../redux/slices/appointment.slice";
import { getPatientPrescriptionsThunk } from "../../redux/slices/prescription.slice";
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
    Zap,
    ShieldCheck
} from "lucide-react";

const RECENT_VISITS = [
    { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Cardiology", date: "OCT 12, 2026", status: "Completed" },
    { id: 2, doctor: "Dr. Michael Chen", specialty: "General Medicine", date: "SEP 28, 2026", status: "Follow-up" },
    { id: 3, doctor: "Dr. Emily Blunt", specialty: "Dermatology", date: "AUG 15, 2026", status: "Completed" },
];

const HEALTH_STATS = [
    { label: "Heart Rate", value: "72 bpm", icon: <Activity size={18} />, color: "text-rose-600", border: "border-rose-600" },
    { label: "Glucose Level", value: "95 mg/dL", icon: <Droplets size={18} />, color: "text-indigo-600", border: "border-indigo-600" },
    { label: "Body Temp", value: "36.6 °C", icon: <Thermometer size={18} />, color: "text-amber-600", border: "border-amber-600" },
];

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const dispatch = useDispatch();

    const { patient } = useSelector(state => state.patient);
    const { appointments } = useSelector(state => state.appointment);
    const { prescriptions } = useSelector(state => state.prescription);

    useEffect(() => {
        dispatch(getPatientAppointments());
        dispatch(getPatientPrescriptionsThunk());
    }, [dispatch]);


    return (
        <div className="flex min-h-screen bg-slate-50 pt-16 font-sans">

            {/* --- SIDEBAR --- */}
            <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col p-8 sticky top-16 h-[calc(100vh-64px)]">
                <div className="mb-10 px-4 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-indigo-600" />
                    <p className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]">Patient Portal v3.0</p>
                </div>

                <nav className="flex-1 space-y-1">
                    <SidebarItem
                        icon={<LayoutDashboard size={18} />}
                        label="Clinical Summary"
                        active={activeTab === "dashboard"}
                        onClick={() => setActiveTab("dashboard")}
                    />
                    <SidebarItem
                        icon={<Calendar size={18} />}
                        label="Appointments"
                        active={activeTab === "visits"}
                        onClick={() => setActiveTab("visits")}
                    />
                    <SidebarItem
                        icon={<FileText size={18} />}
                        label="Medical Records"
                        active={activeTab === "records"}
                        onClick={() => setActiveTab("records")}
                    />
                    <SidebarItem icon={<Settings size={18} />} label="Account Settings" />
                </nav>

                <button className="flex items-center gap-3 px-6 py-4 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-all mt-auto font-bold text-[10px] uppercase tracking-widest border border-transparent hover:border-rose-100">
                    <LogOut size={16} /> Sign Out
                </button>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 p-6 md:p-12 pb-24 lg:pb-12 max-w-7xl">
                {/* Header Section */}
                <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-10 h-1 bg-indigo-600 rounded-sm" />
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Authenticated Health Profile</p>
                        </div>
                        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight uppercase leading-none">
                            Welcome, <span className="text-indigo-600">{patient?.firstName || "Alex"}</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="SEARCH MEDICAL RECORDS..."
                                className="w-full md:w-80 pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-sm shadow-sm focus:border-indigo-600 outline-none font-bold text-[10px] tracking-widest uppercase"
                            />
                        </div>
                        <button className="p-4 bg-white border border-slate-200 rounded-sm text-slate-400 hover:text-indigo-600 transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
                        </button>
                    </div>
                </header>

                {activeTab === 'dashboard' && (
                    <>
                        {/* Vital Signs Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                            {HEALTH_STATS.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -2 }}
                                    className={`bg-white p-8 rounded-sm shadow-sm border-l-4 ${stat.border} flex flex-col gap-4 group transition-all`}
                                >
                                    <div className={`${stat.color} flex justify-between items-start`}>
                                        {stat.icon}
                                        <ArrowUpRight size={14} className="text-slate-200 group-hover:text-indigo-600 transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                        <p className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">{stat.value}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-3 gap-10">
                            {/* Visit Registry Section */}
                            <section className="lg:col-span-2 bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em]">Recent Consultations</h3>
                                    <button className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest hover:text-indigo-800 flex items-center gap-2 group">
                                        Full History <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-white border-b border-slate-100">
                                                <th className="px-8 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Medical Professional</th>
                                                <th className="px-8 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {appointments && appointments.length > 0 ? appointments.map((visit) => (
                                                <tr key={visit._id} className="hover:bg-slate-50 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <p className="font-extrabold text-slate-900 text-sm uppercase tracking-tight">{visit.doctorId?.firstName} {visit.doctorId?.lastName || visit.name}</p>
                                                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{visit.doctorId?.specialization || 'General'}</p>
                                                    </td>
                                                    <td className="px-8 py-6 text-[10px] font-bold text-slate-500 tracking-widest">
                                                        {new Date(visit.appointmentDate).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <span className={`px-4 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-widest border ${visit.status === 'completed'
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                            : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                                            }`}>
                                                            {visit.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="3" className="px-8 py-6 text-center text-slate-500">No recent consultations</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                </div>
                            </section>

                            {/* Quick Actions Hub */}
                            <section className="space-y-8">
                                <div className="bg-indigo-600 rounded-sm p-10 text-white relative overflow-hidden group shadow-lg shadow-indigo-100">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                        <Zap size={100} strokeWidth={3} />
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className="text-3xl font-extrabold uppercase tracking-tight mb-2">Request<br />Appointment</h4>
                                        <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8">Schedule a session with a certified specialist.</p>
                                        <button className="w-full bg-slate-900 text-white py-5 rounded-sm font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all">
                                            Book Now
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-sm p-8 border border-slate-200 shadow-sm">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Upcoming Appointment</h4>
                                    {appointments?.filter(a => a.status === 'approved' || a.status === 'pending')[0] ? (
                                        (() => {
                                            const nextAppt = appointments.filter(a => a.status === 'approved' || a.status === 'pending')[0];
                                            return (
                                                <div className="flex gap-5 items-center p-6 bg-slate-50 rounded-sm border border-slate-100">
                                                    <div className="bg-indigo-600 p-3 rounded-sm text-white shadow-md">
                                                        <Calendar size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">
                                                            Dr. {nextAppt.doctorId?.lastName || nextAppt.name}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mt-0.5">
                                                            {new Date(nextAppt.appointmentDate).toLocaleDateString()} • {nextAppt.approvedTimeSlot || nextAppt.requestedTimeSlot}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        })()
                                    ) : (
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mt-4">No Upcoming Appointments</p>
                                    )}
                                </div>
                            </section>
                        </div>
                    </>
                )}
                {activeTab === 'records' && (
                    <section className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em]">Prescriptions & Records</h3>
                        </div>
                        <div className="p-8 grid gap-6">
                            {prescriptions && prescriptions.length > 0 ? prescriptions.map((px) => (
                                <div key={px._id} className="p-6 border border-slate-200 rounded-sm hover:border-indigo-600 transition-all cursor-pointer">
                                    <h4 className="font-extrabold text-slate-900 text-lg uppercase mb-2">Diagnosis: {px.diagnosis}</h4>
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                                        Dr. {px.doctorId?.lastName} • {new Date(px.createdAt).toLocaleDateString()}
                                    </p>
                                    <div className="bg-slate-50 p-4 rounded-sm mb-4">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Medicines</p>
                                        <ul className="list-disc pl-4">
                                            {px.medicines?.map((med, idx) => (
                                                <li key={idx} className="text-sm text-slate-700">{med.name} - {med.dosage} ({med.duration})</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <p className="text-sm text-slate-700"><span className="font-bold text-[10px] text-slate-500 uppercase tracking-widest">Advice:</span> {px.advice}</p>
                                </div>
                            )) : (
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center py-10">No prescriptions found</p>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm transition-all border-l-4 uppercase tracking-widest text-[10px] font-bold ${active
            ? "bg-indigo-50 text-indigo-600 border-indigo-600 shadow-sm shadow-indigo-50"
            : "text-slate-400 border-transparent hover:bg-slate-50 hover:text-slate-900"
            }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

export default Dashboard;