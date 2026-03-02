import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Loader2,
    RefreshCcw,
    Calendar,
    User,
    Clock,
    MoreHorizontal,
    Pencil,
    ChevronRight
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
    getAllAppointments,
    updateAppointmentStatus
} from "../../redux/slices/appointment.slice";
import { getAllDoctorsThunk } from "../../redux/slices/doctor.slice";

const ShowAppointments = () => {
    const dispatch = useDispatch();
    const { appointments = [], loading } = useSelector((state) => state.appointment);
    const { doctors = [] } = useSelector((state) => state.doctor);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [doctorFilter, setDoctorFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState("");
    const [editingApp, setEditingApp] = useState(null);

    useEffect(() => {
        dispatch(getAllAppointments());
        dispatch(getAllDoctorsThunk());
    }, [dispatch]);

    const getDoctorDetails = (id) => {
        const targetId = typeof id === "object" ? id._id : id;
        return doctors.find((doc) => doc._id === targetId);
    };

    const filteredAppointments = useMemo(() => {
        return appointments.filter((app) => {
            const doctor = getDoctorDetails(app.doctorId);
            const docName = doctor ? `${doctor.firstName} ${doctor.lastName}`.toLowerCase() : "";
            const matchesSearch = docName.includes(searchTerm.toLowerCase()) || app.name?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "All" || app.status === statusFilter;
            const matchesDoctor = doctorFilter === "All" || doctor?._id === doctorFilter;
            const matchesDate = !dateFilter || new Date(app.appointmentDate).toDateString() === new Date(dateFilter).toDateString();
            return matchesSearch && matchesStatus && matchesDoctor && matchesDate;
        });
    }, [appointments, doctors, searchTerm, statusFilter, doctorFilter, dateFilter]);

    const handleStatusUpdate = (id, newStatus) => {
        dispatch(updateAppointmentStatus({ id, status: newStatus }))
            .unwrap()
            .then(() => toast.success(`Status updated`))
            .catch(() => toast.error("Update failed"));
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "Approved": return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "Pending": return "bg-amber-50 text-amber-700 border-amber-100";
            case "Cancelled": return "bg-rose-50 text-rose-700 border-rose-100";
            default: return "bg-slate-50 text-slate-700 border-slate-100";
        }
    };

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen pt-20 font-sans text-slate-900">
            <div className="max-w-7xl mx-auto">

                {/* COMPACT HEADER */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Appointment Registry</h1>
                        <p className="text-sm text-slate-500">Manage and monitor patient schedules</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={() => dispatch(getAllAppointments())} className="p-2 hover:bg-white border rounded-sm transition-colors">
                            <RefreshCcw size={16} className="text-slate-600" />
                        </button>
                    </div>
                </div>

                {/* SLIM FILTER BAR */}
                <div className="bg-white border border-slate-200 rounded-sm p-3 mb-6 flex flex-wrap gap-3 items-center shadow-sm">
                    <div className="relative flex-1 min-w-50">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Patient or doctor..."
                            className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-1.5 text-sm border border-slate-200 rounded-sm outline-none">
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Completed">Completed</option>
                    </select>

                    <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="px-3 py-1.5 text-sm border border-slate-200 rounded-sm outline-none" />
                </div>

                {/* TABLE VIEW */}
                <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Doctor</th>
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Schedule</th>
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-10 text-center"><Loader2 className="animate-spin inline text-indigo-600" /></td>
                                </tr>
                            ) : filteredAppointments.map((app) => {
                                const doctor = getDoctorDetails(app.doctorId);
                                return (
                                    <tr key={app._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-sm bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                    {app.name?.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-slate-700">{app.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm text-slate-600 flex items-center gap-1">
                                                <span className="font-medium text-slate-700">Dr. {doctor?.firstName || "N/A"} <span>{doctor?.lastName}</span></span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-xs text-slate-600">
                                                <div className="font-medium">{new Date(app.appointmentDate).toLocaleDateString()}</div>
                                                <div className="text-slate-400">{app.requestedTimeSlot}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={app.status}
                                                onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                                                className={`text-[11px] font-bold uppercase px-2 py-1 rounded-sm border outline-none ${getStatusStyles(app.status)}`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Approved">Approved</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => setEditingApp(app)}
                                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-sm transition-all"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* COMPACT MODAL */}
                <AnimatePresence>
                    {editingApp && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white p-6 rounded-sm shadow-xl w-full max-w-sm border border-slate-200">
                                <h3 className="text-lg font-bold mb-4 text-slate-800">Reschedule</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Date</label>
                                        <input type="date" value={editingApp.appointmentDate?.split("T")[0]} onChange={(e) => setEditingApp({ ...editingApp, appointmentDate: e.target.value })} className="w-full border border-slate-200 px-3 py-2 rounded-sm text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Time Slot</label>
                                        <input type="time" value={editingApp.requestedTimeSlot} onChange={(e) => setEditingApp({ ...editingApp, requestedTimeSlot: e.target.value })} className="w-full border border-slate-200 px-3 py-2 rounded-sm text-sm" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 mt-6">
                                    <button onClick={() => setEditingApp(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-sm">Cancel</button>
                                    <button onClick={() => { /* dispatch logic */ setEditingApp(null); }} className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-sm hover:bg-indigo-700">Update</button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ShowAppointments;