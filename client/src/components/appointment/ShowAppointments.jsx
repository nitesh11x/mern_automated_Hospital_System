import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Clock,
    User,
    Search,
    CheckCircle2,
    Clock3,
    XCircle,
    Stethoscope,
    ArrowUpRight,
    Loader2,
    MapPin,
    Zap,
    LayoutGrid
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { getAllAppointments } from "../../redux/slices/appointment.slice";
import { getAllDoctorsThunk } from "../../redux/slices/doctor.slice";

// --- THEMED STAT CARD ---
const StatCard = ({ title, value, icon, isGradient }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-indigo-50 shadow-sm hover:shadow-indigo-100/50 transition-all flex items-center justify-between group">
            <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">{title}</p>
                <p className="text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{value}</p>
            </div>
            <div className={`p-4 rounded-xl ${isGradient ? 'bg-linear-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-200' : 'bg-slate-50 text-indigo-600'}`}>
                {React.cloneElement(icon, { size: 24, className: isGradient ? "text-white" : "" })}
            </div>
        </div>
    );
};

const ShowAppointments = () => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const { appointments = [], loading, error } = useSelector((state) => state.appointment);
    const { doctors = [] } = useSelector((state) => state.doctor);

    useEffect(() => {
        dispatch(getAllAppointments());
        dispatch(getAllDoctorsThunk());
    }, [dispatch]);

    const getDoctorDetails = (id) => {
        if (!id) return null;
        const targetId = typeof id === 'object' ? id._id : id;
        return doctors.find((doc) => doc._id === targetId);
    };

    const filteredAppointments = useMemo(() => {
        return appointments.filter((app) => {
            const doctor = getDoctorDetails(app.doctorId);
            const docName = doctor
                ? `${doctor.firstName} ${doctor.lastName}`.toLowerCase()
                : "unknown doctor";
            const patientName = app.name?.toLowerCase() || "";
            const search = searchTerm.toLowerCase();
            return docName.includes(search) || patientName.includes(search);
        });
    }, [appointments, doctors, searchTerm]);

    // Theme-specific Status Styling
    const getStatusStyle = (status) => {
        switch (status) {
            case "Approved": return "bg-purple-50 text-purple-600 border-purple-100";
            case "Pending": return "bg-indigo-50 text-indigo-600 border-indigo-100";
            case "Cancelled": return "bg-rose-50 text-rose-600 border-rose-100";
            default: return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFF] pt-28 pb-20 px-4 md:px-8 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* --- HEADER WITH THEME ACCENT --- */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-linear-to-br from-indigo-600 to-purple-600 rounded-lg text-white shadow-md">
                                <LayoutGrid size={18} />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600/60">Registry Management</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">
                            Clinical <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">Timeline</span>
                        </h1>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Filter by physician or patient..."
                            className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold shadow-xl shadow-indigo-900/5 focus:ring-4 focus:ring-purple-500/5 focus:border-purple-400 outline-none w-full md:w-80 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                {/* --- QUICK STATS (MIXING BOTH COLORS) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard title="Total Appointments" value={appointments.length} icon={<Zap fill="currentColor" />} isGradient={true} />
                    <StatCard title="Pending Review" value={appointments.filter(a => a.status === "Pending").length} icon={<Clock3 />} isGradient={false} />
                    <StatCard title="Confirmed Sessions" value={appointments.filter(a => a.status === "Approved").length} icon={<CheckCircle2 />} isGradient={false} />
                </div>

                {/* --- APPOINTMENTS LIST --- */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {!loading && filteredAppointments.map((app) => {
                            const docInfo = getDoctorDetails(app.doctorId);

                            return (
                                <motion.div
                                    key={app._id}
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="group bg-white border-l-4 border-l-indigo-600 border border-slate-100 p-6 rounded-r-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 transition-all"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

                                        {/* Doctor & Patient Info */}
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 bg-linear-to-br from-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                                <Stethoscope size={30} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 uppercase italic leading-none mb-1">
                                                    {docInfo ? `Dr. ${docInfo.firstName} ${docInfo.lastName}` : "Physician Unassigned"}
                                                </h3>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                                                        {docInfo?.specialization || "General Medicine"}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                                                        <User size={12} className="text-indigo-400" /> {app.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Logistic Metadata */}
                                        <div className="flex flex-wrap items-center gap-8 lg:gap-12">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Date Node</span>
                                                <div className="flex items-center gap-2 text-[13px] font-black text-slate-700">
                                                    <Calendar size={14} className="text-indigo-600" />
                                                    {new Date(app.appointmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Time Slot</span>
                                                <div className="flex items-center gap-2 text-[13px] font-black text-slate-700">
                                                    <Clock size={14} className="text-purple-600" />
                                                    {app.requestedTimeSlot}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status & Deep Link */}
                                        <div className="flex items-center justify-between lg:justify-end gap-5 border-t lg:border-t-0 pt-4 lg:pt-0">
                                            <div className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 ${getStatusStyle(app.status)}`}>
                                                {app.status || "Pending"}
                                            </div>
                                            <button className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-purple-600 hover:text-white rounded-xl transition-all group/btn">
                                                <ArrowUpRight size={20} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {!loading && filteredAppointments.length === 0 && (
                        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-indigo-100">
                            <div className="inline-flex p-4 bg-indigo-50 rounded-full text-indigo-300 mb-4">
                                <Search size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-300 uppercase italic">No Matches Found in Registry</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShowAppointments;