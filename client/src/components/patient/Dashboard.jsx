import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  LayoutDashboard,
  Calendar,
  FileText,
  LogOut,
  Bell,
  Search,
  Zap,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  Pill,
  Stethoscope,
  ArrowRight,
  User, Phone, Mail, MapPin, Heart, Activity, Star, CheckCircle, CheckCircle2,
  XCircle, Clock, AlertCircle, CreditCard, QrCode, Eye, Download, Settings, ScanLine
} from "lucide-react";
import PatientSettings from "./PatientSettings";

import { getPatientAppointments } from "../../redux/slices/appointment.slice";
import { getPatientPrescriptionsThunk } from "../../redux/slices/prescription.slice";
import { getAllDoctorsThunk } from "../../redux/slices/doctor.slice";
import { patientLogoutThunk } from "../../redux/slices/patient.slice";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [qrModal, setQrModal] = useState(null);
  const [prescriptionModal, setPrescriptionModal] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { patient } = useSelector((state) => state.patient || {});
  const { appointments = [], patientAppointments = [] } = useSelector(
    (state) => state.appointment || {}
  );
  const { doctors = [] } = useSelector((state) => state.doctor || {});
  const { prescriptions = [] } = useSelector((state) => state.prescription || {});

  useEffect(() => {
    dispatch(getPatientAppointments());
    dispatch(getPatientPrescriptionsThunk());
    dispatch(getAllDoctorsThunk());
  }, [dispatch]);

  const doctorMap = useMemo(() => {
    const map = {};
    doctors?.forEach((doc) => {
      if (doc?._id) map[doc._id] = doc;
    });
    return map;
  }, [doctors]);

  const handleLogout = async () => {
    try {
      await dispatch(patientLogoutThunk()).unwrap();
      toast.success("Patient Logged Out");
      navigate("/");
      window.location.reload();
    } catch (error) {
      toast.error("Logout Failed");
    }
  };

  const handleDownloadQR = (qrDataUrl) => {
    try {
      const link = document.createElement("a");
      link.href = qrDataUrl;
      link.download = "appointment-qr.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started");
    } catch (err) {
      toast.error("Failed to download");
    }
  };

  const handleOpenPrescriptionFromVisit = (appointmentId) => {
    const found = prescriptions?.find((p) => p.appointmentId === appointmentId);
    if (found) {
      setPrescriptionModal(found);
    } else {
      toast.error("Prescription not yet uploaded for this visit");
    }
  };

  const renderStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "approved") {
      return (
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-700 border border-purple-200 uppercase">
          {status}
        </span>
      );
    }
    if (s === "pending") {
      return (
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700 border border-amber-200 uppercase">
          {status}
        </span>
      );
    }
    if (s === "completed") {
      return (
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase">
          {status}
        </span>
      );
    }
    if (s === "cancelled" || s === "canceled") {
      return (
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-700 border border-rose-200 uppercase">
          {status}
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase">
        {status || "—"}
      </span>
    );
  };

  const getUpcomingAppointment = () => {
    return patientAppointments?.find(a => a.status === "Approved" || a.status === "Pending");
  };

  const upcomingAppointment = getUpcomingAppointment();

  return (
    <div className="flex min-h-screen bg-linear-to-br  from-purple-50 via-white to-indigo-50 font-sans pt-16 lg:pt-0">

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16  bg-white border-b border-purple-100 z-50 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-sm bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-md">
            <Heart size={14} className="text-white" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest bg-linear-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
            Patient Portal
          </span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-purple-600 hover:bg-purple-50 rounded-sm transition-all">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-linear-to-b from-purple-900 via-purple-800 to-indigo-900 text-purple-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen lg:top-0 flex flex-col shadow-2xl
        ${isSidebarOpen ? "translate-x-0 mt-16 lg:mt-0" : "-translate-x-full"}
      `}>
        <div className="px-6  pb-4 border-b pt-20 border-purple-700/50">
          <div className="flex items-center gap-3">
            {/* <div className="h-10 w-10 rounded-sm bg-linear-to-br  from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <Heart size={20} className="text-white" />
            </div> */}
            {/* <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                MED<span className="text-purple-300">OS</span>
              </h2>
              <p className="text-[8px] font-bold text-purple-300 tracking-[0.2em] uppercase mt-0.5">
                Patient Portal
              </p>
            </div> */}
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Clinical Summary"
            active={activeTab === "dashboard"}
            onClick={() => { setActiveTab("dashboard"); setIsSidebarOpen(false); }}
          />
          <SidebarItem
            icon={<Calendar size={18} />}
            label="Appointments"
            active={activeTab === "visits"}
            onClick={() => { setActiveTab("visits"); setIsSidebarOpen(false); }}
          />
          <SidebarItem
            icon={<FileText size={18} />}
            label="Medical Records"
            active={activeTab === "records"}
            onClick={() => { setActiveTab("records"); setIsSidebarOpen(false); }}
          />
          <SidebarItem
            icon={<Settings size={18} />}
            label="Account Settings"
            active={activeTab === "settings"}
            onClick={() => { setActiveTab("settings"); setIsSidebarOpen(false); }}
          />
        </nav>

        <div className="p-4 mt-6 border-t border-purple-700/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-purple-300 hover:text-white hover:bg-purple-800/50 rounded-sm transition-all text-[10px] font-bold uppercase tracking-widest group"
          >
            <LogOut size={16} className="group-hover:text-purple-300" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 pb-24 lg:pb-12 pt-10 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">

          {/* TOP HEADER */}
          <header className="flex flex-col pt-10 xl:flex-row xl:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-0.5 bg-linear-to-r from-purple-600 to-indigo-600 rounded-full" />
                <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">
                  Authenticated Health Profile
                </p>
              </div>
              <h1 className="text-4xl md:text-4xl font-black bg-linear-to-r from-purple-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                Welcome, <span className="bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{patient?.firstName || "Patient"}</span>
              </h1>
              <p className="text-sm text-purple-400 mt-2 flex items-center gap-2">
                <Activity size={14} />
                Your health journey at a glance
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span className="text-[9px] font-bold text-purple-600 uppercase tracking-wider">Secure Access</span>
                </div>
              </div>
            </div>
          </header>

          {/* DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-500">

              {/* LEFT SIDE - RECENT CONSULTATIONS */}
              <section className="lg:col-span-2 bg-white rounded-sm border border-purple-100 shadow-xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-purple-100 flex justify-between items-center bg-linear-to-r from-white to-purple-50/30">
                  <div>
                    <h3 className="text-[11px] font-black text-purple-700 uppercase tracking-[0.2em] mb-1">
                      Recent Consultations
                    </h3>
                    <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Your latest medical interactions</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("visits")}
                    className="px-4 py-2 bg-purple-50 text-purple-600 font-black text-[10px] uppercase tracking-widest rounded-sm hover:bg-linear-to-r hover:from-purple-600 hover:to-indigo-600 hover:text-white transition-all flex items-center gap-2 group shadow-sm"
                  >
                    View All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-purple-50/50 border-b border-purple-100">
                        <th className="px-6 py-4 text-[9px] font-black text-purple-500 uppercase tracking-widest">Medical Professional</th>
                        <th className="px-6 py-4 text-[9px] font-black text-purple-500 uppercase tracking-widest text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-50">
                      {patientAppointments && patientAppointments.length > 0 ? (
                        patientAppointments.slice(0, 5).map((visit) => {
                          const docObj = typeof visit.doctorId === "object" ? visit.doctorId : doctorMap[visit.doctorId];

                          const getStatusColor = (status) => {
                            const s = status?.toLowerCase();
                            if (s === 'approved' || s === 'completed') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
                            if (s === 'cancelled' || s === 'rejected') return 'bg-rose-100 text-rose-700 border-rose-200';
                            return 'bg-amber-100 text-amber-700 border-amber-200';
                          };

                          return (
                            <tr key={visit._id} className="hover:bg-purple-50/50 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-sm bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-md">
                                    {docObj?.firstName?.[0] || visit.name?.[0] || 'D'}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-800 text-sm group-hover:text-purple-700 transition-colors">
                                      {docObj ? `Dr. ${docObj.firstName} ${docObj.lastName}` : visit.name || "Unknown Specialist"}
                                    </p>
                                    <p className="text-[9px] font-bold text-purple-500 uppercase tracking-wider">
                                      {docObj?.specialization || "General Medicine"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-tighter ${getStatusColor(visit.status)}`}>
                                  {visit.status || 'Pending'}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={2} className="px-6 py-16 text-center">
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                                <Calendar size={24} className="text-purple-400" />
                              </div>
                              <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest">No Recent Activity</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* RIGHT SIDE - ACTION CARDS */}
              <section className="space-y-6">

                {/* Book Consultation Card */}
                <div className="bg-linear-to-br from-purple-600 via-purple-700 to-indigo-700 rounded-sm p-8 text-white relative overflow-hidden group shadow-xl shadow-purple-200">
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-black/10 to-transparent"></div>

                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-sm flex items-center justify-center mb-6 shadow-inner">
                      <Zap size={28} className="text-white" />
                    </div>
                    <h4 className="text-2xl font-black uppercase tracking-tighter mb-2 leading-tight">
                      Book a<br />Consultation
                    </h4>
                    <p className="text-purple-100 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8 opacity-80">
                      Certified specialists available 24/7.
                    </p>
                    <Link
                      to={"/appointment/book"}
                      className="flex items-center justify-center gap-3 w-full bg-white text-purple-700 py-4 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all transform active:scale-95 shadow-lg"
                    >
                      Start Request <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>

                {/* Upcoming Appointment Card */}
                <div className="bg-white rounded-sm p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-center mb-5">
                    <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Clock size={12} /> Next Scheduled
                    </h4>
                    {upcomingAppointment && (
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    )}
                  </div>

                  {!upcomingAppointment ? (
                    <div className="py-8 text-center border-2 border-dashed border-purple-100 rounded-sm">
                      <Calendar size={32} className="mx-auto text-purple-300 mb-2" />
                      <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest">No sessions pending</p>
                    </div>
                  ) : (
                    (() => {
                      const docId = typeof upcomingAppointment.doctorId === "object" ? upcomingAppointment.doctorId._id : upcomingAppointment.doctorId;
                      const docObj = doctorMap[docId];
                      return (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 p-4 bg-linear-to-r from-purple-50 to-indigo-50 rounded-sm border border-purple-100">
                            <div className="w-14 h-14 rounded-sm bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                              <Calendar size={24} strokeWidth={2} />
                            </div>
                            <div className="flex-1">
                              <p className="text-base font-black text-slate-800">
                                Dr. {docObj?.lastName || "Specialist"}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-[10px] font-black text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                                  {upcomingAppointment.appointmentDate ? new Date(upcomingAppointment.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "TBD"}
                                </span>
                                <span className="text-[10px] font-bold text-purple-400 uppercase">
                                  at {upcomingAppointment.approvedTimeSlot || upcomingAppointment.requestedTimeSlot || "TBD"}
                                </span>
                              </div>
                            </div>
                          </div>
                          {upcomingAppointment.status === "Approved" && upcomingAppointment.qrCode && (
                            <button
                              onClick={() => setQrModal(upcomingAppointment.qrCode)}
                              className="w-full py-2.5 bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider rounded-sm hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                            >
                              <QrCode size={14} /> View QR Code
                            </button>
                          )}
                        </div>
                      );
                    })()
                  )}
                </div>

                {/* Health Stats Card */}
                <div className="bg-white rounded-sm p-6 border border-purple-100 shadow-lg">
                  <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Heart size={12} /> Health Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-purple-50 rounded-sm">
                      <p className="text-2xl font-black text-purple-700">{prescriptions?.length || 0}</p>
                      <p className="text-[8px] font-bold text-purple-400 uppercase">Prescriptions</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-sm">
                      <p className="text-2xl font-black text-purple-700">{patientAppointments?.length || 0}</p>
                      <p className="text-[8px] font-bold text-purple-400 uppercase">Appointments</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* VISITS TAB */}
          {activeTab === "visits" && (
            <section className="bg-white rounded-sm border border-purple-100 shadow-xl overflow-hidden transition-all">
              <div className="p-6 border-b border-purple-100 bg-linear-to-r from-purple-50/30 to-white flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <div className="w-1 h-5 bg-linear-to-b from-purple-600 to-indigo-600 rounded-full"></div>
                    Appointment Records
                  </h3>
                  <p className="text-[9px] text-purple-500 mt-1">Complete history of your medical consultations</p>
                </div>
                <span className="text-[10px] bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {patientAppointments?.length || 0} Total
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-purple-50/50 text-[10px] uppercase tracking-wider text-purple-600 font-black border-b border-purple-100">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Doctor Details</th>
                      <th className="px-6 py-4">Schedule</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Payment</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                      <th className="px-6 py-4 text-right">Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-50">
                    {patientAppointments && patientAppointments.length > 0 ? (
                      patientAppointments.map((px) => {
                        const doctorId = typeof px.doctorId === "object" ? px.doctorId?._id : px.doctorId;
                        const doctor = doctorMap ? doctorMap[doctorId] : null;

                        const getStatusStyles = (status) => {
                          const s = status?.toLowerCase();
                          if (s === 'approved' || s === 'completed')
                            return 'bg-emerald-100 text-emerald-700 border-emerald-200';
                          if (s === 'pending' || s === 'requested')
                            return 'bg-amber-100 text-amber-700 border-amber-200';
                          if (s === 'cancelled' || s === 'rejected')
                            return 'bg-rose-100 text-rose-700 border-rose-200';
                          return 'bg-slate-100 text-slate-600 border-slate-200';
                        };

                        return (
                          <tr key={px._id} className="hover:bg-purple-50/30 transition-colors group">
                            <td className="px-6 py-4">
                              <span className="font-mono text-xs font-bold text-purple-500 group-hover:text-purple-700 transition-colors">
                                #{px.appointmentId || px._id?.slice(-6).toUpperCase()}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              {doctor ? (
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-sm bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                                    {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-800 text-sm">Dr. {doctor.firstName} {doctor.lastName}</span>
                                    <p className="text-[9px] text-purple-500 font-semibold">{doctor.specialization}</p>
                                  </div>
                                </div>
                              ) : <span className="text-slate-400 text-xs">Unassigned</span>}
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-700">
                                  {px.appointmentDate ? new Date(px.appointmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "TBD"}
                                </span>
                                <span className="text-[10px] text-purple-400 font-medium">
                                  Slot: {px.approvedTimeSlot || px.requestedTimeSlot || "TBD"}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase inline-block ${getStatusStyles(px.status || 'pending')}`}>
                                {px.status || 'Pending'}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${px.paymentStatus === 'Paid' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></div>
                                <span className={`text-[10px] font-bold ${px.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                  {px.paymentStatus || 'Unpaid'}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleOpenPrescriptionFromVisit(px._id)}
                                  className="px-3 py-1.5 bg-white border border-purple-200 text-purple-600 rounded-sm text-[9px] font-bold uppercase hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all shadow-sm"
                                >
                                  Prescription
                                </button>
                                <button onClick={() => toast("Laboratory reports pending or unavailable. Please refer to Prescription records.", { icon: "ℹ️" })} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-sm hover:bg-blue-600 hover:text-white transition-all">
                                  Reports
                                </button>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-right">
                              {px.qrCode ? (
                                <button
                                  onClick={() => setQrModal(px.qrCode)}
                                  className="bg-linear-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 rounded-sm text-[9px] font-black uppercase tracking-wider hover:shadow-lg transition-all transform active:scale-95"
                                >
                                  Get QR
                                </button>
                              ) : (
                                <span className="text-[9px] font-bold text-purple-300 mr-4">NO QR</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-20 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                              <Calendar size={24} className="text-purple-400" />
                            </div>
                            <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest">No visit history found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* RECORDS TAB */}
          {activeTab === "records" && (
            <section className="bg-white rounded-sm border border-purple-100 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-purple-100 bg-linear-to-r from-purple-50/30 to-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-[11px] font-black text-purple-700 uppercase tracking-[0.2em] mb-1">
                      Prescriptions & Records
                    </h3>
                    <p className="text-[9px] text-purple-400 font-bold uppercase tracking-wider">
                      Secure Digital Health Vault
                    </p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-sm">
                    <FileText size={18} className="text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="p-6 grid gap-4">
                {prescriptions && prescriptions.length > 0 ? (
                  prescriptions.map((px) => (
                    <div
                      key={px._id}
                      onClick={() => setPrescriptionModal(px)}
                      className="group relative p-5 bg-linear-to-r from-purple-50/30 to-white border border-purple-100 rounded-sm hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                          <div className="flex flex-col items-center justify-center w-14 h-14 bg-linear-to-br from-purple-500 to-indigo-500 rounded-sm shadow-md">
                            <span className="text-[9px] font-black text-white uppercase">
                              {new Date(px.createdAt).toLocaleDateString('en-US', { month: 'short' })}
                            </span>
                            <span className="text-lg font-black text-white">
                              {new Date(px.createdAt).getDate()}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-[8px] font-black uppercase tracking-wider rounded-md">
                                Clinical Record
                              </span>
                            </div>
                            <h4 className="font-black text-slate-800 text-base group-hover:text-purple-700 transition-colors">
                              {px.diagnosis || "General Consultation"}
                            </h4>
                            <p className="text-[9px] font-bold text-purple-400 uppercase tracking-wider mt-1">
                              Issued by Dr. {px.doctorId?.lastName || "Specialist"} • {new Date(px.createdAt).getFullYear()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="hidden md:block text-[8px] font-black text-purple-300 uppercase group-hover:text-purple-500 transition-colors">
                            View Details
                          </span>
                          <div className="bg-purple-100 p-2 rounded-sm group-hover:bg-purple-600 transition-all">
                            <ChevronRight size={14} className="text-purple-500 group-hover:text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-purple-100 rounded-sm">
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                      <FileText size={24} className="text-purple-400" />
                    </div>
                    <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest">No Clinical Records Found</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <section className="bg-white rounded-sm border border-purple-100 shadow-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-purple-100 bg-linear-to-r from-purple-50/30 to-white">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-purple-700">Account Settings</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between px-5 py-4 rounded-sm border border-purple-100 bg-white hover:border-purple-300 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-sm group-hover:bg-purple-600 transition-colors">
                        <User size={16} className="text-purple-600 group-hover:text-white" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-bold text-slate-800">Edit Profile</span>
                        <span className="text-[10px] text-purple-400">Update your personal information</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-purple-400" />
                  </button>

                  <button className="w-full flex items-center justify-between px-5 py-4 rounded-sm border border-purple-100 bg-white hover:border-purple-300 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-sm group-hover:bg-purple-600 transition-colors">
                        <ShieldCheck size={16} className="text-purple-600 group-hover:text-white" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-bold text-slate-800">Security Settings</span>
                        <span className="text-[10px] text-purple-400">Manage password and 2FA</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-purple-400" />
                  </button>

                  <button className="w-full flex items-center justify-between px-5 py-4 rounded-sm border border-purple-100 bg-white hover:border-purple-300 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-sm group-hover:bg-purple-600 transition-colors">
                        <Bell size={16} className="text-purple-600 group-hover:text-white" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-bold text-slate-800">Notification Preferences</span>
                        <span className="text-[10px] text-purple-400">Manage email and SMS alerts</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-purple-400" />
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-dashed border-purple-100">
                  <div className="text-center text-[10px] font-bold uppercase tracking-widest text-purple-400">
                    More features coming soon
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* MODALS */}
      <AnimatePresence>
        {/* QR MODAL */}
        {qrModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-sm p-6 shadow-2xl text-center max-w-sm w-full border-t-4 border-purple-600">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <QrCode size={28} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-black mb-2 text-slate-800">Appointment QR</h3>
              <p className="text-[10px] text-purple-500 mb-4">Scan this at reception for verification</p>
              <div className="flex items-center justify-center bg-purple-50 p-4 rounded-sm border border-purple-200">
                <img src={qrModal} alt="QR" className="w-48 h-48 object-contain" />
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => handleDownloadQR(qrModal)} className="flex-1 py-3 text-[10px] font-bold bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-sm uppercase tracking-widest hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <Download size={12} /> Download
                </button>
                <button onClick={() => setQrModal(null)} className="flex-1 py-3 text-[10px] font-bold border border-purple-200 text-purple-600 rounded-sm uppercase tracking-widest hover:bg-purple-50 transition-all">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* PRESCRIPTION MODAL */}
        {prescriptionModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden border border-purple-100">
              <div className="bg-linear-to-r from-purple-600 to-indigo-600 text-white p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Prescription Detail</h2>
                  <p className="text-[9px] text-purple-200 font-bold tracking-[0.2em] uppercase mt-1">Record ID: {prescriptionModal._id?.slice(-8)}</p>
                </div>
                <button onClick={() => setPrescriptionModal(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-6 mb-8 pb-6 border-b border-purple-100">
                  <div>
                    <label className="text-[9px] font-bold text-purple-500 uppercase tracking-widest block mb-2">Doctor</label>
                    <div className="flex items-center gap-2">
                      <Stethoscope size={14} className="text-purple-600" />
                      <p className="font-bold text-slate-800 text-sm">Dr. {prescriptionModal.doctorId?.firstName} {prescriptionModal.doctorId?.lastName}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-purple-500 uppercase tracking-widest block mb-2">Date Issued</label>
                    <p className="font-bold text-slate-800 text-sm">{new Date(prescriptionModal.createdAt).toLocaleDateString('en-GB')}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] mb-3">Clinical Diagnosis</h4>
                  <div className="bg-purple-50 border border-purple-100 p-4 rounded-sm">
                    <p className="text-slate-800 font-medium">{prescriptionModal.diagnosis}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Pill size={12} className="text-purple-600" /> Medication Plan
                  </h4>
                  <div className="space-y-3">
                    {prescriptionModal.medicines?.map((med, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 border border-purple-100 rounded-sm bg-purple-50/30 hover:border-purple-200 transition-colors">
                        <div>
                          <p className="font-bold text-slate-800 text-sm uppercase">{med.name}</p>
                          <p className="text-[9px] font-bold text-purple-500 uppercase tracking-wide">{med.dosage}</p>
                        </div>
                        <span className="text-[9px] font-black bg-white px-3 py-1 border border-purple-200 rounded-full text-purple-600 uppercase">{med.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] mb-3">Professional Advice</h4>
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-sm">
                    <p className="text-sm text-slate-600 italic">"{prescriptionModal.advice}"</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-purple-50 border-t border-purple-100 flex justify-end">
                <button onClick={() => setPrescriptionModal(null)} className="px-6 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:shadow-lg transition-all">
                  Close Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all uppercase tracking-wider text-[10px] font-bold ${active
      ? "bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20"
      : "text-purple-300 hover:bg-purple-800/50 hover:text-white"
      }`}
  >
    <span className={active ? "text-white" : "text-purple-400"}>
      {React.cloneElement(icon, { size: 16 })}
    </span>
    <span>{label}</span>
  </button>
);

export default Dashboard;