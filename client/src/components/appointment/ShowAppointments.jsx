import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Loader2,
    RefreshCcw,
    Pencil,
    Trash2,
    FileText,
    Calendar,
    Clock,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
    getAllAppointments,
    updateAppointmentPaymentStatus,
    updateAppointmentStatus,
    reScheduelAppointmentByIdThunk
} from "../../redux/slices/appointment.slice";
import { getAllDoctorsThunk } from "../../redux/slices/doctor.slice";

const ShowAppointments = () => {
    const dispatch = useDispatch();
    const { appointments = [], loading } = useSelector((state) => state.appointment);
    const { doctors = [] } = useSelector((state) => state.doctor);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // Modal States
    const [editingApp, setEditingApp] = useState(null);
    const [payingApp, setPayingApp] = useState(null);

    useEffect(() => {
        dispatch(getAllAppointments());
        dispatch(getAllDoctorsThunk());
    }, [dispatch]);

    const getDoctorDetails = (id) => {
        const targetId = typeof id === "object" ? id?._id : id;
        return doctors.find((doc) => doc._id === targetId);
    };

    const filteredAppointments = useMemo(() => {
        return appointments.filter((app) => {
            const doctor = getDoctorDetails(app.doctorId);
            const docName = doctor ? `${doctor.firstName} ${doctor.lastName}`.toLowerCase() : "";
            const matchesSearch =
                docName.includes(searchTerm.toLowerCase()) ||
                app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.appointmentId?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "All" || app.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [appointments, doctors, searchTerm, statusFilter]);

    const handleStatusUpdate = (id, newStatus) => {
        dispatch(updateAppointmentStatus({ id, status: newStatus }))
            .unwrap()
            .then(() => toast.success(`Status updated to ${newStatus}`))
            .catch(() => toast.error("Update failed"));
    };

    const handlePaymentUpdate = (id, paymentStatus) => {
        dispatch(updateAppointmentPaymentStatus({ id, paymentStatus }))
            .unwrap()
            .then(() => {
                toast.success(`Payment set to ${paymentStatus}`);
                setPayingApp(null);
            })
            .catch(() => toast.error("Payment update failed"));
    };

    const handleEditAppointment = () => {
        if (!editingApp) return;

        dispatch(
            reScheduelAppointmentByIdThunk({
                appointmentId: editingApp._id,
                appointmentDate: editingApp.appointmentDate,
                approvedTimeSlot: editingApp.requestedTimeSlot // Mapping UI edit back to request
            })
        )
            .unwrap()
            .then(() => {
                toast.success("Appointment rescheduled successfully");
                setEditingApp(null);
                dispatch(getAllAppointments()); // Refresh data
            })
            .catch(() => toast.error("Failed to reschedule"));
    };

    const getStatusStyles = (status) => {
        const styles = {
            Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
            Pending: "bg-amber-50 text-amber-700 border-amber-200",
            Completed: "bg-blue-50 text-blue-700 border-blue-200",
            Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
        };
        return styles[status] || "bg-slate-50 text-slate-700 border-slate-200";
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Appointment Registry</h1>
                        <p className="text-slate-500 text-sm">Manage clinical schedules and payments</p>
                    </div>
                    <button
                        onClick={() => dispatch(getAllAppointments())}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <RefreshCcw size={16} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search patients or ID..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 border border-slate-200 rounded text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600">ID & Patient</th>
                                <th className="p-4 font-semibold text-slate-600">Doctor</th>
                                <th className="p-4 font-semibold text-slate-600">Date</th>
                                <th className="p-4 font-semibold text-slate-600">Time (Req/Appr)</th>
                                <th className="p-4 font-semibold text-slate-600">Status</th>
                                <th className="p-4 font-semibold text-slate-600">Payment</th>
                                <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-10 text-center">
                                        <Loader2 className="animate-spin mx-auto text-indigo-600" size={32} />
                                    </td>
                                </tr>
                            ) : filteredAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-10 text-center text-slate-400">No appointments found.</td>
                                </tr>
                            ) : (
                                filteredAppointments.map((app) => {
                                    const doctor = getDoctorDetails(app.doctorId);
                                    return (
                                        <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-slate-800">{app.name}</div>
                                                <div className="text-xs text-slate-400">{app.appointmentId}</div>
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                {doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : "Unassigned"}
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={14} />
                                                    {new Date(app.appointmentDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                <div className="text-xs">Req: {app.requestedTimeSlot}</div>
                                                <div className="text-xs font-medium text-indigo-600">Appr: {app.approvedTimeSlot || "N/A"}</div>
                                            </td>
                                            <td className="p-4">
                                                <select
                                                    value={app.status}
                                                    onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                                                    className={`px-2 py-1 text-xs font-bold rounded border cursor-pointer outline-none ${getStatusStyles(app.status)}`}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Approved">Approved</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => setPayingApp(app)}
                                                    className={`px-3 py-1 text-xs font-bold rounded border transition-colors ${app.paymentStatus === 'Paid'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                                        }`}
                                                >
                                                    {app.paymentStatus || "Pending"}
                                                </button>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => setEditingApp(app)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all">
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all">
                                                        <FileText size={16} />
                                                    </button>
                                                    <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modals */}
                <AnimatePresence>
                    {/* Payment Modal */}
                    {payingApp && (
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white p-6 rounded-lg w-full max-w-sm shadow-xl border border-slate-200"
                            >
                                <h3 className="font-bold text-lg mb-2 text-slate-800">Update Payment</h3>
                                <p className="text-sm text-slate-500 mb-6">Patient: {payingApp.name}</p>
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <button
                                        onClick={() => handlePaymentUpdate(payingApp._id, "Paid")}
                                        className="py-2.5 border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-bold rounded hover:bg-emerald-100 transition-colors"
                                    >
                                        Mark as Paid
                                    </button>
                                    <button
                                        onClick={() => handlePaymentUpdate(payingApp._id, "Pending")}
                                        className="py-2.5 border border-slate-200 bg-white text-slate-700 text-sm font-bold rounded hover:bg-slate-50 transition-colors"
                                    >
                                        Set Pending
                                    </button>
                                </div>
                                <button onClick={() => setPayingApp(null)} className="w-full text-slate-400 text-xs hover:text-slate-600">Cancel</button>
                            </motion.div>
                        </div>
                    )}

                    {/* Edit/Reschedule Modal */}
                    {editingApp && (
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="bg-white p-6 rounded-lg w-full max-w-sm shadow-xl border border-slate-200"
                            >
                                <h3 className="font-bold text-lg mb-1 text-slate-800">Reschedule</h3>
                                <p className="text-sm text-slate-500 mb-6">Adjust date and time for {editingApp.name}</p>
                                <div className="space-y-4 mb-8">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Appointment Date</label>
                                        <input
                                            type="date"
                                            className="w-full p-2.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                            value={editingApp.appointmentDate?.split("T")[0]}
                                            onChange={(e) => setEditingApp({ ...editingApp, appointmentDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Requested Time</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 10:30 AM"
                                            className="w-full p-2.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                            value={editingApp.requestedTimeSlot}
                                            onChange={(e) => setEditingApp({ ...editingApp, requestedTimeSlot: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setEditingApp(null)} className="flex-1 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded transition-colors">Cancel</button>
                                    <button onClick={handleEditAppointment} className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded hover:bg-indigo-700 shadow-md transition-all">Save Changes</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ShowAppointments;