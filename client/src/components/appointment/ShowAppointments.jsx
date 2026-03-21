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
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  QrCode,
  User,
  Stethoscope,
  MoreVertical,
  Send,
  DollarSign
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  getAllAppointments,
  updateAppointmentPaymentStatus,
  updateAppointmentStatus,
  reScheduelAppointmentByIdThunk,
  generateAppointmentQRThunk,
  deleteAppointmentByIdThunk,
} from "../../redux/slices/appointment.slice";
import { getAllDoctorsThunk } from "../../redux/slices/doctor.slice";
import { notifyPatientAppointmentThunk } from "../../redux/slices/notification.slice";

const ShowAppointments = () => {
  const dispatch = useDispatch();
  const { appointments = [], loading } = useSelector(
    (state) => state.appointment,
  );
  const { doctors = [] } = useSelector((state) => state.doctor);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [editingApp, setEditingApp] = useState(null);
  const [payingApp, setPayingApp] = useState(null);
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    dispatch(getAllAppointments());
    dispatch(getAllDoctorsThunk());
  }, [dispatch]);

  const doctorMap = useMemo(() => {
    return doctors.reduce((acc, doc) => {
      acc[doc._id] = `Dr. ${doc.firstName} ${doc.lastName}`;
      return acc;
    }, {});
  }, [doctors]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      const docName = doctorMap[app.doctorId] || "Unassigned";
      const searchLower = searchTerm.toLowerCase();

      const matchesSearch =
        docName.toLowerCase().includes(searchLower) ||
        (app.name?.toLowerCase() || "").includes(searchLower) ||
        (app.appointmentId?.toLowerCase() || "").includes(searchLower) ||
        (app.email?.toLowerCase() || "").includes(searchLower);

      const matchesStatus =
        statusFilter === "All" || app.status === statusFilter;

      const matchesPayment =
        paymentFilter === "All" || app.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [appointments, doctorMap, searchTerm, statusFilter, paymentFilter]);

  const handleStatusUpdate = (id, newStatus) => {
    dispatch(updateAppointmentStatus({ id, status: newStatus }))
      .unwrap()
      .then(() => toast.success(`Status updated to ${newStatus}`))
      .catch(() => toast.error("Update failed"));
  };

  const handleNotifyPatientAppointment = (id) => {
    dispatch(notifyPatientAppointmentThunk(id))
      .unwrap()
      .then(() => toast.success(`Notification sent successfully`))
      .catch(() => toast.error("Sending failed"));
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
        approvedTimeSlot: editingApp.requestedTimeSlot,
      }),
    )
      .unwrap()
      .then(() => {
        toast.success("Appointment rescheduled successfully");
        setEditingApp(null);
        dispatch(getAllAppointments());
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

  const getStatusIcon = (status) => {
    const icons = {
      Approved: <CheckCircle size={12} />,
      Pending: <AlertCircle size={12} />,
      Completed: <CheckCircle size={12} />,
      Cancelled: <XCircle size={12} />,
    };
    return icons[status] || null;
  };

  const stats = useMemo(() => ({
    total: appointments.length,
    pending: appointments.filter(a => a.status === "Pending").length,
    approved: appointments.filter(a => a.status === "Approved").length,
    completed: appointments.filter(a => a.status === "Completed").length,
    cancelled: appointments.filter(a => a.status === "Cancelled").length,
    paid: appointments.filter(a => a.paymentStatus === "Paid").length,
    unpaid: appointments.filter(a => a.paymentStatus !== "Paid").length,
  }), [appointments]);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-indigo-50 p-6 md:p-10 font-sans">
      <div className="max-w-full mx-auto">

        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
            </div>
            <button
              onClick={() => dispatch(getAllAppointments())}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-purple-200 rounded-sm text-sm font-bold text-purple-600 hover:border-purple-400 hover:shadow-md transition-all group"
            >
              <RefreshCcw size={16} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
              Refresh
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-6">
            <div className="bg-white rounded-sm border border-purple-100 p-3 shadow-sm">
              <p className="text-[9px] font-bold text-purple-500 uppercase">Total</p>
              <p className="text-xl font-black text-gray-800">{stats.total}</p>
            </div>
            <div className="bg-white rounded-sm border border-purple-100 p-3 shadow-sm">
              <p className="text-[9px] font-bold text-amber-500 uppercase">Pending</p>
              <p className="text-xl font-black text-amber-600">{stats.pending}</p>
            </div>
            <div className="bg-white rounded-sm border border-purple-100 p-3 shadow-sm">
              <p className="text-[9px] font-bold text-emerald-500 uppercase">Approved</p>
              <p className="text-xl font-black text-emerald-600">{stats.approved}</p>
            </div>
            <div className="bg-white rounded-sm border border-purple-100 p-3 shadow-sm">
              <p className="text-[9px] font-bold text-blue-500 uppercase">Completed</p>
              <p className="text-xl font-black text-blue-600">{stats.completed}</p>
            </div>
            <div className="bg-white rounded-sm border border-purple-100 p-3 shadow-sm">
              <p className="text-[9px] font-bold text-rose-500 uppercase">Cancelled</p>
              <p className="text-xl font-black text-rose-600">{stats.cancelled}</p>
            </div>
            <div className="bg-white rounded-sm border border-purple-100 p-3 shadow-sm">
              <p className="text-[9px] font-bold text-emerald-500 uppercase">Paid</p>
              <p className="text-xl font-black text-emerald-600">{stats.paid}</p>
            </div>
            <div className="bg-white rounded-sm border border-purple-100 p-3 shadow-sm">
              <p className="text-[9px] font-bold text-amber-500 uppercase">Unpaid</p>
              <p className="text-xl font-black text-amber-600">{stats.unpaid}</p>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="bg-white rounded-sm border border-purple-100 p-5 mb-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={16} />
              <input
                type="text"
                placeholder="Search by patient, doctor, ID, or email..."
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-purple-200 rounded-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-purple-50/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-sm border border-purple-200">
              <AlertCircle size={14} className="text-purple-500" />
              <select
                className="flex-1 text-xs font-semibold text-purple-700 bg-transparent outline-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">ALL STATUS</option>
                <option value="Pending">PENDING</option>
                <option value="Approved">APPROVED</option>
                <option value="Completed">COMPLETED</option>
                <option value="Cancelled">CANCELLED</option>
              </select>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-sm border border-purple-200">
              <DollarSign size={14} className="text-purple-500" />
              <select
                className="flex-1 text-xs font-semibold text-purple-700 bg-transparent outline-none cursor-pointer"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="All">ALL PAYMENTS</option>
                <option value="Paid">PAID</option>
                <option value="Pending">PENDING</option>
              </select>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-linear-to-r from-purple-50 to-indigo-50 rounded-sm border border-purple-200">
              <Calendar size={14} className="text-purple-500" />
              <span className="text-xs font-bold text-purple-600">
                {filteredAppointments.length} Appointments Found
              </span>
            </div>
          </div>
          <div className="flex justify-end mt-3 pt-2 border-t border-purple-100">
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
                setPaymentFilter("All");
              }}
              className="text-[10px] font-bold text-purple-500 hover:text-purple-700 flex items-center gap-1 transition-colors"
            >
              <RefreshCcw size={10} /> Clear All Filters
            </button>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-sm border border-purple-100 shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <Loader2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-600 animate-pulse" size={20} />
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-linear-to-r from-purple-50 to-indigo-50 border-b-2 border-purple-200">
                    <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Appointment</th>
                    <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Doctor</th>
                    <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Schedule</th>
                    <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Time Slot</th>
                    <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Payment</th>
                    <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">QR</th>
                    <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                            <Calendar size={32} className="text-purple-400" />
                          </div>
                          <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">No appointments found</p>
                          <p className="text-xs text-purple-400 mt-1">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((app, index) => (
                      <tr
                        key={app._id}
                        className="hover:bg-purple-50/50 transition-all duration-200 group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Appointment ID */}
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="text-xs font-mono font-bold text-purple-700">
                              {app.appointmentId}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-gray-400">
                              <Clock size={10} />
                              {new Date(app.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </td>

                        {/* Patient Info */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-sm bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                              {app.name?.charAt(0) || "P"}
                            </div>
                            <div>
                              <div className="text-sm font-black text-gray-800 group-hover:text-purple-700 transition-colors">
                                {app.name}
                              </div>
                              <div className="text-[9px] text-gray-400">{app.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Doctor */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Stethoscope size={12} className="text-purple-500" />
                            <span className="text-sm font-semibold text-gray-700">
                              {doctorMap[app.doctorId] || "Unassigned"}
                            </span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-purple-400" />
                            <span className="text-sm text-gray-600">
                              {app.appointmentDate
                                ? new Date(app.appointmentDate).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* Time Slot */}
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="text-[10px] text-gray-400">
                              Req: {app.requestedTimeSlot || "N/A"}
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="text-[11px] font-bold text-purple-600">
                                Appr: {app.approvedTimeSlot || "N/A"}
                              </div>
                              <button
                                onClick={() => setEditingApp(app)}
                                className="p-1 text-purple-400 hover:text-purple-600 hover:bg-purple-100 rounded transition-all"
                                title="Reschedule"
                              >
                                <Pencil size={10} />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                            className={`px-2 py-1 text-[10px] font-bold rounded-full border cursor-pointer outline-none transition-all ${getStatusStyles(app.status)}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Payment */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setPayingApp(app)}
                            className={`flex items-center gap-1.5 px-2 py-1 text-[9px] font-black rounded-full border transition-all ${app.paymentStatus === "Paid"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                              }`}
                          >
                            <CreditCard size={10} />
                            {app.paymentStatus || "Pending"}
                          </button>
                        </td>

                        {/* QR Code */}
                        <td className="px-4 py-3">
                          <button
                            onClick={async () => {
                              if (app.qrCode) {
                                setQrCode(app.qrCode);
                                return;
                              }
                              if (app.status !== "Approved") {
                                toast.error("Please approve the appointment to generate QR");
                                return;
                              }
                              try {
                                const qr = await dispatch(generateAppointmentQRThunk(app._id)).unwrap();
                                if (qr) {
                                  setQrCode(qr);
                                  toast.success("QR generated successfully");
                                  handleNotifyPatientAppointment(app._id);
                                  dispatch(getAllAppointments());
                                }
                              } catch (err) {
                                toast.error(err || "Failed to generate QR");
                              }
                            }}
                            className={`p-1.5 rounded-sm transition-all ${app.qrCode
                                ? "text-emerald-600 hover:bg-emerald-50"
                                : app.status === "Approved"
                                  ? "text-purple-500 hover:bg-purple-50"
                                  : "text-gray-300 cursor-not-allowed"
                              }`}
                            title={app.qrCode ? "View QR" : app.status === "Approved" ? "Generate QR" : "Approve First"}
                          >
                            <QrCode size={16} />
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              title="View Details"
                              className="p-1.5 text-purple-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-sm transition-all"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              title="Medical Records"
                              className="p-1.5 text-purple-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-all"
                            >
                              <FileText size={14} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this appointment?")) {
                                  dispatch(deleteAppointmentByIdThunk(app._id));
                                  toast.success("Deleted successfully");
                                }
                              }}
                              title="Delete"
                              className="p-1.5 text-purple-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                            <button
                              title="Send Notification"
                              onClick={() => handleNotifyPatientAppointment(app._id)}
                              className="p-1.5 text-purple-400 hover:text-amber-600 hover:bg-amber-50 rounded-sm transition-all"
                            >
                              <Send size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modals */}
        <AnimatePresence>
          {/* Payment Modal */}
          {payingApp && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-sm p-6 w-full max-w-sm shadow-2xl border border-purple-100"
              >
                <div className="text-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <CreditCard size={24} className="text-purple-600" />
                  </div>
                  <h3 className="font-black text-lg text-gray-800">Update Payment Status</h3>
                  <p className="text-sm text-gray-500 mt-1">Patient: {payingApp.name}</p>
                  <p className="text-xs text-purple-600 font-mono mt-1">{payingApp.appointmentId}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={() => handlePaymentUpdate(payingApp._id, "Paid")}
                    className="py-2.5 bg-linear-to-r from-emerald-500 to-emerald-600 text-white text-sm font-bold rounded-sm hover:shadow-lg transition-all"
                  >
                    Mark as Paid
                  </button>
                  <button
                    onClick={() => handlePaymentUpdate(payingApp._id, "Pending")}
                    className="py-2.5 border-2 border-amber-200 bg-amber-50 text-amber-700 text-sm font-bold rounded-sm hover:bg-amber-100 transition-all"
                  >
                    Set Pending
                  </button>
                </div>
                <button
                  onClick={() => setPayingApp(null)}
                  className="w-full text-gray-400 text-xs font-bold hover:text-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </motion.div>
            </div>
          )}

          {/* Edit/Reschedule Modal */}
          {editingApp && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-sm p-6 w-full max-w-sm shadow-2xl border border-purple-100"
              >
                <div className="text-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <Calendar size={24} className="text-purple-600" />
                  </div>
                  <h3 className="font-black text-lg text-gray-800">Reschedule Appointment</h3>
                  <p className="text-sm text-gray-500 mt-1">{editingApp.name}</p>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-purple-600 mb-1 block">
                      Appointment Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-2.5 border border-purple-200 rounded-sm text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      value={editingApp.appointmentDate ? editingApp.appointmentDate.split("T")[0] : ""}
                      onChange={(e) =>
                        setEditingApp({
                          ...editingApp,
                          appointmentDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-purple-600 mb-1 block">
                      Time Slot
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 10:30 AM"
                      className="w-full p-2.5 border border-purple-200 rounded-sm text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      value={editingApp.requestedTimeSlot || ""}
                      onChange={(e) =>
                        setEditingApp({
                          ...editingApp,
                          requestedTimeSlot: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingApp(null)}
                    className="flex-1 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditAppointment}
                    className="flex-1 py-2.5 bg-linear-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold rounded-sm hover:shadow-lg transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* QR Modal */}
          {qrCode && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-sm p-6 w-full max-w-sm shadow-2xl border border-purple-100 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <QrCode size={28} className="text-purple-600" />
                </div>
                <h3 className="font-black text-lg text-gray-800 mb-1">Appointment QR Code</h3>
                <p className="text-xs text-gray-500 mb-4">Scan this at reception for verification</p>
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-sm mb-4">
                  <img src={qrCode} alt="Appointment QR" className="w-48 h-48 object-contain" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(qrCode).then(() => {
                        toast.success("QR data copied to clipboard");
                      }).catch(() => { });
                    }}
                    className="flex-1 py-2 text-sm font-bold border border-purple-200 text-purple-600 rounded-sm hover:bg-purple-50 transition-all"
                  >
                    Copy Data
                  </button>
                  <button
                    onClick={() => setQrCode(null)}
                    className="flex-1 py-2 text-sm font-bold bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-sm hover:shadow-lg transition-all"
                  >
                    Close
                  </button>
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