import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDoctorAppointments, updateAppointmentStatus } from "../../redux/slices/appointment.slice";
import { createPrescriptionThunk, resetPrescriptionState } from "../../redux/slices/prescription.slice";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, CalendarCheck, Users, FileText, Settings,
  LogOut, Bell, Search, X, CheckCircle2, Clock, AlertCircle, Plus, Trash2, MapPin,
  Stethoscope, Heart, Activity, Calendar, ChevronRight, Download, Eye,
  Pill, Award, TrendingUp, User, Phone, Mail, CalendarDays, Clock as ClockIcon
} from "lucide-react";

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { doctor } = useSelector((state) => state.doctor);
  const { appointments } = useSelector((state) => state.appointment);
  const { success: prescriptionSuccess, error: prescriptionError } = useSelector((state) => state.prescription);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [prescriptionApptId, setPrescriptionApptId] = useState(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: "",
    advice: "",
    medicines: [{ name: "", dosage: "", duration: "" }]
  });

  useEffect(() => {
    dispatch(getDoctorAppointments());
  }, [dispatch]);

  useEffect(() => {
    if (prescriptionApptId) {
      const apt = appointments?.find(a => a._id === prescriptionApptId);
      if (apt?.prescriptionId) {
        setPrescriptionForm({
          diagnosis: apt.prescriptionId.diagnosis || "",
          advice: apt.prescriptionId.advice || "",
          medicines: apt.prescriptionId.medicines?.length > 0
            ? apt.prescriptionId.medicines
            : [{ name: "", dosage: "", duration: "" }]
        });
      }
    }
  }, [prescriptionApptId, appointments]);

  useEffect(() => {
    if (prescriptionSuccess) {
      setPrescriptionApptId(null);
      setPrescriptionForm({ diagnosis: "", advice: "", medicines: [{ name: "", dosage: "", duration: "" }] });
      dispatch(getDoctorAppointments());
      setTimeout(() => dispatch(resetPrescriptionState()), 3000);
    }
  }, [prescriptionSuccess, dispatch]);

  const handleStatusUpdate = (id, status) => {
    dispatch(updateAppointmentStatus({ id, status }));
  };

  const addMedicineRow = () => {
    setPrescriptionForm({
      ...prescriptionForm,
      medicines: [...prescriptionForm.medicines, { name: "", dosage: "", duration: "" }]
    });
  };

  const removeMedicineRow = (index) => {
    setPrescriptionForm({
      ...prescriptionForm,
      medicines: prescriptionForm.medicines.filter((_, i) => i !== index)
    });
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = prescriptionForm.medicines.map((med, i) => i === index ? { ...med, [field]: value } : med);
    setPrescriptionForm({ ...prescriptionForm, medicines: updated });
  };

  const submitPrescription = (e) => {
    e.preventDefault();
    const apt = appointments?.find(a => a._id === prescriptionApptId);
    dispatch(createPrescriptionThunk({
      appointmentId: apt._id,
      patientId: apt.patientId?._id || apt.patientId,
      diagnosis: prescriptionForm.diagnosis,
      advice: prescriptionForm.advice,
      medicines: prescriptionForm.medicines
    }));
  };

  const stats = {
    totalPatients: appointments?.length || 0,
    completed: appointments?.filter(a => a.status === "Completed").length || 0,
    pending: appointments?.filter(a => a.status === "Pending").length || 0,
    approved: appointments?.filter(a => a.status === "Approved").length || 0,
    paid: appointments?.filter(a => a.paymentStatus === "Paid").length || 0,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-violet-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-linear-to-b from-purple-900 via-purple-800 to-violet-900 hidden lg:flex flex-col sticky top-0 h-screen shadow-2xl z-20">
        <div className="p-6 border-b border-purple-700/50">
          <div className="flex pt-4 items-center gap-3 mb-3">
            {/* <div className="h-12 w-12  rounded-sm bg-linear-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-lg">
              <Stethoscope size={24} className="text-white" />
            </div> */}
            {/* <div>
              <h2 className="text-lg font-black text-white tracking-tight">DR. {doctor?.lastName?.toUpperCase() || "SPECIALIST"}</h2>
              <p className="text-[9px] font-bold text-purple-300 uppercase tracking-wider">{doctor?.specialization || "General Medicine"}</p>
            </div> */}
          </div>
          {/* <div className="flex items-center gap-2 mt-3 pt-3 border-t border-purple-700/30">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <p className="text-[8px] font-bold text-purple-300 uppercase">Online • Available for Consultations</p>
          </div> */}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavBtn icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavBtn icon={<CalendarCheck size={18} />} label="Appointments" active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
          <NavBtn icon={<Users size={18} />} label="Patients" active={activeTab === 'patients'} onClick={() => setActiveTab('patients')} />
          <NavBtn icon={<Settings size={18} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="p-4 mt-6 border-t border-purple-700/50">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-purple-300 hover:text-white hover:bg-purple-800/50 rounded-sm transition-all text-[10px] font-bold uppercase tracking-widest group">
            <LogOut size={16} className="group-hover:text-purple-300" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-sm border-b border-purple-100 px-6 md:px-10 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div>
            <h1 className="text-xl font-black bg-linear-to-r from-purple-700 to-violet-600 bg-clip-text text-transparent uppercase tracking-wider">
              {activeTab === 'dashboard' ? "Clinical Dashboard" : activeTab === 'appointments' ? "Appointment Manager" : activeTab === 'patients' ? "Patient Registry" : "Practice Settings"}
            </h1>
            <p className="text-[9px] text-purple-400 mt-0.5">Welcome back, Dr. {doctor?.firstName || "Specialist"}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-purple-50 border border-purple-200 rounded-sm text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none w-64"
              />
            </div>
            <button className="p-2 bg-purple-100 rounded-sm hover:bg-purple-200 transition-colors relative">
              <Bell size={18} className="text-purple-600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          {activeTab === 'appointments' ? (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <StatCard label="Total Appointments" value={stats.totalPatients} icon={<Calendar size={20} />} color="purple" trend="+12%" />
                <StatCard label="Pending Review" value={stats.pending} icon={<Clock size={20} />} color="amber" trend="3 awaiting" />
                <StatCard label="Approved" value={stats.approved} icon={<CheckCircle2 size={20} />} color="emerald" trend="ready" />
                <StatCard label="Completed" value={stats.completed} icon={<Award size={20} />} color="blue" trend="+8 this week" />
              </div>

              {/* Appointments Table */}
              <div className="bg-white rounded-sm border border-purple-100 shadow-xl overflow-hidden">
                <div className="p-5 border-b border-purple-100 bg-linear-to-r from-purple-50/30 to-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                        <div className="w-1 h-5 bg-linear-to-b from-purple-600 to-violet-600 rounded-full"></div>
                        Scheduled Consultations
                      </h3>
                      <p className="text-[9px] text-purple-500 mt-1">Manage patient appointments and medical records</p>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">
                      {appointments?.length || 0} Total
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-purple-50/50 border-b border-purple-100">
                      <tr>
                        <th className="px-5 py-4 text-[10px] font-black text-purple-600 uppercase tracking-wider">Patient</th>
                        <th className="px-5 py-4 text-[10px] font-black text-purple-600 uppercase tracking-wider">Appointment Details</th>
                        <th className="px-5 py-4 text-[10px] font-black text-purple-600 uppercase tracking-wider">Prescription</th>
                        <th className="px-5 py-4 text-[10px] font-black text-purple-600 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-50">
                      {appointments?.map((apt, idx) => (
                        <tr key={apt._id} className="hover:bg-purple-50/30 transition-colors group">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-sm bg-linear-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                {apt.name?.charAt(0) || "P"}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-800 group-hover:text-purple-700 transition-colors">{apt.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <Phone size={10} className="text-purple-400" />
                                  <span className="text-[9px] text-slate-500">{apt.phone || "N/A"}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <CalendarDays size={12} className="text-purple-500" />
                                <span className="text-xs font-semibold text-slate-700">
                                  {apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : "TBD"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ClockIcon size={12} className="text-purple-400" />
                                <span className="text-[10px] text-slate-500">{apt.approvedTimeSlot || apt.requestedTimeSlot || "Time TBD"}</span>
                              </div>
                              <span className={`inline-block text-[8px] font-black px-2 py-0.5 rounded-full ${apt.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                                apt.status === "Pending" ? "bg-amber-100 text-amber-700" :
                                  apt.status === "Completed" ? "bg-blue-100 text-blue-700" :
                                    "bg-rose-100 text-rose-700"
                                }`}>
                                {apt.status || "Pending"}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            {apt.prescriptionId ? (
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-emerald-100 rounded-sm">
                                  <FileText size={12} className="text-emerald-600" />
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-emerald-600">Prescribed</p>
                                  <p className="text-[9px] text-slate-500">{apt.prescriptionId.medicines?.length || 0} medications</p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-[10px] text-purple-400 italic">No prescription yet</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <ActionButtons
                              apt={apt}
                              handleStatusUpdate={handleStatusUpdate}
                              setPrescriptionApptId={setPrescriptionApptId}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* Dashboard View */
            <div className="space-y-8">
              {/* Welcome Card */}
              <div className="bg-linear-to-r from-purple-600 to-violet-600 rounded-sm p-8 text-white shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-white/20 rounded-sm flex items-center justify-center">
                        <Activity size={16} className="text-white" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider">Clinical Overview</span>
                    </div>
                    <h2 className="text-3xl font-black mb-2">Welcome, Dr. {doctor?.firstName || "Specialist"}</h2>
                    <p className="text-purple-100 text-sm">You have {stats.pending} pending appointments awaiting your review</p>
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-16 bg-white/20 rounded-sm flex items-center justify-center">
                      <Stethoscope size={32} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Toady Appointments" value={stats.totalPatients} icon={<Users size={20} />} color="purple" trend="+12% vs last month" />
                <StatCard label="Completed Visits" value={stats.completed} icon={<CheckCircle2 size={20} />} color="emerald" trend="+8 this week" />
                <StatCard label="Pending Approvals" value={stats.pending} icon={<Clock size={20} />} color="amber" trend="Requires attention" />
                <StatCard label="Revenue Generated" value={`₹${(stats.completed * 500).toLocaleString()}`} icon={<TrendingUp size={20} />} color="blue" trend="+22% YoY" />
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Appointments */}
                <div className="bg-white rounded-sm border border-purple-100 shadow-lg p-6">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-xs font-black text-purple-700 uppercase tracking-wider flex items-center gap-2">
                      <Calendar size={14} /> Recent Appointments
                    </h3>
                    <button
                      onClick={() => setActiveTab('appointments')}
                      className="text-[9px] font-bold text-purple-500 hover:text-purple-700 flex items-center gap-1"
                    >
                      View All <ChevronRight size={10} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {appointments?.slice(0, 5).map((apt) => (
                      <div key={apt._id} className="flex items-center justify-between p-3 bg-purple-50/30 rounded-sm hover:bg-purple-50 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-sm bg-linear-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs">
                            {apt.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{apt.name}</p>
                            <p className="text-[9px] text-purple-500">{apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : "TBD"}</p>
                          </div>
                        </div>
                        <span className={`text-[8px] font-black px-2 py-1 rounded-full ${apt.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                          apt.status === "Approved" ? "bg-blue-100 text-blue-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>
                          {apt.status || "Pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-sm border border-purple-100 shadow-lg p-6">
                  <h3 className="text-xs font-black text-purple-700 uppercase tracking-wider mb-5 flex items-center gap-2">
                    <Award size={14} /> Practice Insights
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-sm">
                      <span className="text-xs font-bold text-slate-700">Consultation Completion Rate</span>
                      <span className="text-lg font-black text-purple-600">{stats.totalPatients ? Math.round((stats.completed / stats.totalPatients) * 100) : 0}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-sm">
                      <span className="text-xs font-bold text-slate-700">Patient Satisfaction</span>
                      <div className="flex items-center gap-1">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Heart key={i} size={12} className="fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-amber-600">4.8</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-sm">
                      <span className="text-xs font-bold text-slate-700">Prescriptions Issued</span>
                      <span className="text-lg font-black text-purple-600">{appointments?.filter(a => a.prescriptionId).length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Prescription Modal */}
      <AnimatePresence>
        {prescriptionApptId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-3xl rounded-sm shadow-2xl flex flex-col max-h-[90vh] border border-purple-100"
            >
              <div className="p-6 border-b border-purple-100 bg-linear-to-r from-purple-50 to-violet-50 rounded-t-2xl flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Pill size={18} className="text-purple-600" />
                    <h3 className="text-lg font-black text-purple-700 uppercase tracking-tight">Medical Prescription</h3>
                  </div>
                  <p className="text-[9px] text-purple-500 font-bold uppercase tracking-wider">
                    Patient: {appointments?.find(a => a._id === prescriptionApptId)?.name}
                  </p>
                </div>
                <button
                  onClick={() => setPrescriptionApptId(null)}
                  className="p-2 hover:bg-white rounded-full transition-colors text-purple-400"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={submitPrescription} className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Diagnosis */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-purple-600 uppercase tracking-wider flex items-center gap-2">
                    <Stethoscope size={12} /> Primary Diagnosis / Findings
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-purple-200 rounded-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-purple-50/30"
                    placeholder="e.g., Acute Upper Respiratory Infection"
                    value={prescriptionForm.diagnosis}
                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, diagnosis: e.target.value })}
                  />
                </div>

                {/* Medicines Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-purple-100 pb-2">
                    <label className="text-[10px] font-black text-purple-600 uppercase tracking-wider flex items-center gap-2">
                      <Pill size={12} /> Medications & Dosage
                    </label>
                    <button
                      type="button"
                      onClick={addMedicineRow}
                      className="flex items-center gap-1 text-[9px] font-black text-white bg-linear-to-r from-purple-600 to-violet-600 px-3 py-1.5 rounded-sm hover:shadow-md transition-all"
                    >
                      <Plus size={12} /> Add Medicine
                    </button>
                  </div>

                  {prescriptionForm.medicines.map((med, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-3 items-end bg-purple-50/30 p-3 rounded-sm border border-purple-100">
                      <div className="col-span-5">
                        <label className="text-[8px] font-bold text-purple-500 uppercase block mb-1">Medication Name</label>
                        <input
                          placeholder="e.g., Paracetamol"
                          className="w-full px-3 py-2 border border-purple-200 rounded-sm text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                          value={med.name}
                          onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="text-[8px] font-bold text-purple-500 uppercase block mb-1">Dosage</label>
                        <input
                          placeholder="e.g., 500mg"
                          className="w-full px-3 py-2 border border-purple-200 rounded-sm text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                          value={med.dosage}
                          onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="text-[8px] font-bold text-purple-500 uppercase block mb-1">Duration</label>
                        <input
                          placeholder="e.g., 5 Days"
                          className="w-full px-3 py-2 border border-purple-200 rounded-sm text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                          value={med.duration}
                          onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                        />
                      </div>
                      <div className="col-span-1 pb-1">
                        {prescriptionForm.medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedicineRow(idx)}
                            className="p-1.5 text-purple-400 hover:text-rose-500 hover:bg-rose-50 rounded-sm transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Advice */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-purple-600 uppercase tracking-wider flex items-center gap-2">
                    <FileText size={12} /> General Advice
                  </label>
                  <textarea
                    className="w-full h-28 px-4 py-3 border border-purple-200 rounded-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-purple-50/30 resize-none"
                    placeholder="Dietary restrictions, rest instructions, follow-up recommendations..."
                    value={prescriptionForm.advice}
                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, advice: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-purple-600 to-violet-600 text-white font-black py-4 rounded-sm hover:shadow-lg transition-all uppercase text-xs tracking-wider"
                >
                  Authorize & Save Prescription
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper Components
const StatCard = ({ label, value, icon, color, trend }) => {
  const colorClasses = {
    purple: "from-purple-500 to-violet-500",
    emerald: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600",
    blue: "from-blue-500 to-blue-600"
  };

  return (
    <div className="bg-white rounded-sm p-5 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[9px] font-black text-purple-500 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-black text-slate-800">{value}</p>
          {trend && <p className="text-[8px] text-emerald-600 mt-1 font-bold">{trend}</p>}
        </div>
        <div className={`h-10 w-10 rounded-sm bg-linear-to-br ${colorClasses[color]} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const ActionButtons = ({ apt, handleStatusUpdate, setPrescriptionApptId }) => {
  const status = apt.status?.toLowerCase();

  return (
    <div className="flex justify-end gap-2">
      {status === 'pending' && (
        <button
          onClick={() => handleStatusUpdate(apt._id, 'Approved')}
          className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-sm text-[10px] font-bold uppercase hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1"
        >
          <CheckCircle2 size={12} /> Approve
        </button>
      )}
      {status === 'approved' && (
        <button
          onClick={() => handleStatusUpdate(apt._id, 'Completed')}
          className="px-4 py-2 bg-purple-600 text-white rounded-sm text-[10px] font-bold uppercase hover:bg-purple-700 transition-all"
        >
          Complete Visit
        </button>
      )}
      {status === 'completed' && (
        <button
          onClick={() => setPrescriptionApptId(apt._id)}
          className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-sm text-[10px] font-bold uppercase hover:bg-purple-600 hover:text-white transition-all flex items-center gap-1"
        >
          <FileText size={12} /> {apt.prescriptionId ? 'Modify Rx' : 'Prescribe'}
        </button>
      )}
    </div>
  );
};

const NavBtn = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-[10px] font-bold uppercase tracking-wider ${active
      ? "bg-linear-to-r from-purple-600 to-violet-600 text-white shadow-lg"
      : "text-purple-300 hover:bg-purple-800/50 hover:text-white"
      }`}
  >
    <span className={active ? "text-white" : "text-purple-400"}>
      {React.cloneElement(icon, { size: 16 })}
    </span>
    <span>{label}</span>
  </button>
);

export default DoctorDashboard;