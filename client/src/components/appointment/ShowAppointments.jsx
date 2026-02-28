import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Clock,
    User,
    Search,
    Filter,
    CheckCircle2,
    Clock3,
    XCircle,
    Stethoscope,
    ArrowUpRight,
    Loader2,
    MapPin
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { getAllAppointments } from "../../redux/slices/appointment.slice";
import { getAllDoctorsThunk } from "../../redux/slices/doctor.slice";

// --- Helper Stat Card Component ---
const StatCard = ({ title, value, icon, color }) => {
    const colors = {
        indigo: "bg-indigo-600 text-white",
        amber: "bg-amber-500 text-white",
        emerald: "bg-emerald-500 text-white"
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">{title}</p>
                <p className="text-2xl font-black text-slate-900">{value}</p>
            </div>
            <div className={`p-3 rounded-xl ${colors[color]}`}>
                {React.cloneElement(icon, { size: 24 })}
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

    const getStatusStyle = (status) => {
        switch (status) {
            case "Approved": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "Pending": return "bg-amber-50 text-amber-600 border-amber-100";
            case "Cancelled": return "bg-rose-50 text-rose-600 border-rose-100";
            default: return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Approved": return <CheckCircle2 size={14} />;
            case "Pending": return <Clock3 size={14} />;
            case "Cancelled": return <XCircle size={14} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] pt-28 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">

                {/* --- HEADER SECTION --- */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-indigo-600 rounded-sm text-white">
                                <Calendar size={16} />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Patient Dashboard</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            My <span className="text-indigo-600">Appointments</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search doctor or patient..."
                                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none w-full md:w-64 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                {/* --- LOADING & ERROR STATES --- */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 text-indigo-600">
                        <Loader2 className="animate-spin mb-4" size={40} />
                        <p className="text-sm font-black uppercase tracking-widest text-slate-400">Loading Appointments...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="bg-rose-50 border border-rose-100 p-6 rounded-xl text-center mb-6">
                        <p className="text-rose-600 font-bold">{error}</p>
                    </div>
                )}

                {/* --- APPOINTMENTS LIST --- */}
                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence mode="popLayout">
                        {!loading && filteredAppointments.map((app, index) => {
                            const docInfo = getDoctorDetails(app.doctorId);

                            return (
                                <motion.div
                                    key={app._id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="group bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-all"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                                        {/* Doctor Block */}
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                                <Stethoscope size={28} />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                    {docInfo ? `Dr. ${docInfo.firstName} ${docInfo.lastName}` : "Doctor Loading..."}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                        {docInfo?.specialization || "General"}
                                                    </span>
                                                    {docInfo?.state && (
                                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded flex items-center gap-1">
                                                            <MapPin size={10} /> {docInfo.state}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-2">
                                                    <User size={12} className="text-indigo-500" />
                                                    Patient: {app.name}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Time Block */}
                                        <div className="grid grid-cols-2 lg:flex items-center gap-10">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Date</span>
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                    <Calendar size={14} className="text-indigo-500" />
                                                    {new Date(app.appointmentDate).toLocaleDateString('en-GB')}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Time</span>
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                    <Clock size={14} className="text-indigo-500" />
                                                    {app.requestedTimeSlot}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status & Actions */}
                                        <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-4 lg:pt-0">
                                            <div className={`px-3 py-1.5 rounded-sm border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${getStatusStyle(app.status)}`}>
                                                {getStatusIcon(app.status)}
                                                {app.status || "Pending"}
                                            </div>
                                            <button 
                                                onClick={() => toast.success("Opening details...")}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                            >
                                                <ArrowUpRight size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {!loading && filteredAppointments.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-200">
                            <h3 className="text-lg font-bold text-slate-400">No appointments found</h3>
                        </div>
                    )}
                </div>

                {/* --- QUICK STATS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <StatCard title="Total" value={appointments.length} icon={<Stethoscope />} color="indigo" />
                    <StatCard title="Pending" value={appointments.filter(a => a.status === "Pending").length} icon={<Clock />} color="amber" />
                    <StatCard title="Approved" value={appointments.filter(a => a.status === "Approved").length} icon={<CheckCircle2 />} color="emerald" />
                </div>
            </div>
        </div>
    );
};

// CRITICAL: Ensure this export line exists exactly like this!
export default ShowAppointments;