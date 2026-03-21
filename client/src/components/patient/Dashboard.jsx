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
  ArrowRight
} from "lucide-react";

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
        <span className="px-3 py-1 text-xs font-bold rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
          {status}
        </span>
      );
    }
    if (s === "pending") {
      return (
        <span className="px-3 py-1 text-xs font-bold rounded-sm bg-yellow-50 text-yellow-700 border border-yellow-100 uppercase">
          {status}
        </span>
      );
    }
    if (s === "completed") {
      return (
        <span className="px-3 py-1 text-xs font-bold rounded-sm bg-sky-50 text-sky-700 border border-sky-100 uppercase">
          {status}
        </span>
      );
    }
    if (s === "cancelled" || s === "canceled") {
      return (
        <span className="px-3 py-1 text-xs font-bold rounded-sm bg-rose-50 text-rose-700 border border-rose-100 uppercase">
          {status}
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-bold rounded-sm bg-slate-50 text-slate-700 border border-slate-100 uppercase">
        {status || "—"}
      </span>
    );
  };

  // const renderPaymentBadge = (paymentStatus) => {
  //   const s = (paymentStatus || "").toLowerCase();
  //   if (s === "paid") {
  //     return (
  //       <span className="px-3 py-1 text-xs font-bold rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
  //         Paid
  //       </span>
  //     );
  //   }
  //   const label = paymentStatus ? paymentStatus : "Not Paid";
  //   return (
  //     <span className="px-3 py-1 text-xs font-bold rounded-sm bg-rose-50 text-rose-700 border border-rose-100 uppercase">
  //       {label}
  //     </span>
  //   );
  // };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans pt-16 lg:pt-0">

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-indigo-600" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Patient Portal v3.0</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen lg:top-0 flex flex-col p-8
        ${isSidebarOpen ? "translate-x-0 mt-16 lg:mt-0" : "-translate-x-full"}
      `}>
        <div className="mb-10 px-4 hidden pt-2 lg:flex items-center gap-2">
          <ShieldCheck size={16} className="text-indigo-600" />
          <p className="text-[10px] font-bold  text-slate-900 uppercase tracking-[0.2em]">
            {/* Patient Portal v3.0 */}
          </p>
        </div>

        <nav className="flex-1 space-y-1">
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
            icon={<FileText size={18} />}
            label="Account Settings"
            active={activeTab === "settings"}
            onClick={() => { setActiveTab("settings"); setIsSidebarOpen(false); }}
          />
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-4 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-all mt-auto font-bold text-[10px] uppercase tracking-widest border border-transparent hover:border-rose-100"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-12 pb-24 lg:pb-12 max-w-7xl overflow-x-hidden">

        {/* TOP HEADER (Always visible) */}
        <header className="flex flex-col xl:flex-row xl:items-end pt-10 justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-10 h-1 bg-indigo-600 rounded-sm" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Authenticated Health Profile
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight uppercase leading-none">
              Welcome, <span className="text-indigo-600">{patient?.firstName || "Alex"}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* <div className="relative group flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input
                type="text"
                placeholder="SEARCH MEDICAL RECORDS..."
                className="w-full md:w-80 pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-sm shadow-sm focus:border-indigo-600 outline-none font-bold text-[10px] tracking-widest uppercase"
              />
            </div> */}
            {/* <button className="p-4 bg-white border border-slate-200 rounded-sm text-slate-400 hover:text-indigo-600 transition-all relative shrink-0">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
            </button> */}
          </div>
        </header>

        {/* --- DASHBOARD TAB --- */}
        {activeTab === "dashboard" && (
          <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-500">

            {/* LEFT SIDE - RECENT CONSULTATIONS */}
            <section className="lg:col-span-2 bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <div>
                  <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-1">
                    Recent Consultations
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Your latest medical interactions</p>
                </div>
                <button
                  onClick={() => setActiveTab("visits")}
                  className="px-4 py-2 bg-slate-50 text-indigo-600 font-black text-[10px] uppercase tracking-widest rounded-sm hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 group shadow-sm"
                >
                  View All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-125">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Medical Professional</th>
                      <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {patientAppointments && patientAppointments.length > 0 ? (
                      patientAppointments.slice(0, 5).map((visit) => {
                        const docObj = typeof visit.doctorId === "object" ? visit.doctorId : doctorMap[visit.doctorId];

                        // Dynamic Status Styles
                        const getStatusColor = (status) => {
                          const s = status?.toLowerCase();
                          if (s === 'approved' || s === 'completed') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
                          if (s === 'cancelled' || s === 'rejected') return 'bg-rose-100 text-rose-700 border-rose-200';
                          return 'bg-amber-100 text-amber-700 border-amber-200';
                        };

                        return (
                          <tr key={visit._id} className="hover:bg-indigo-50/20 transition-colors group">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                                  {docObj?.firstName?.[0] || visit.name?.[0] || 'D'}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 text-sm tracking-tight">
                                    {docObj ? `Dr. ${docObj.firstName} ${docObj.lastName}` : visit.name || "Unknown Specialist"}
                                  </p>
                                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                                    {docObj?.specialization || "General Medicine"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <span className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-tighter ${getStatusColor(visit.status)}`}>
                                {visit.status || 'Pending'}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-8 py-20 text-center">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Recent Activity</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* RIGHT SIDE - ACTION CARDS */}
            <section className="space-y-6">

              {/* 1. Request Appointment Card (The "Hero" Card) */}
              <div className="bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-sm p-8 text-white relative overflow-hidden group shadow-xl shadow-indigo-200">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-sm flex items-center justify-center mb-6 shadow-inner">
                    <Zap size={24} className="text-white fill-white animate-pulse" />
                  </div>
                  <h4 className="text-2xl font-black uppercase tracking-tighter mb-2 leading-tight">
                    Book a<br />Consultation
                  </h4>
                  <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8 opacity-80">
                    Certified specialists available 24/7.
                  </p>
                  <Link
                    to={"/appointment/book"}
                    className="flex items-center justify-center gap-3 w-full bg-white text-indigo-700 py-4 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all transform active:scale-95 shadow-lg"
                  >
                    Start Request <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* 2. Upcoming Appointment Card */}
              <div className="bg-white rounded-sm p-6 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Next Scheduled</h4>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                </div>

                {(() => {
                  const nextAppt = patientAppointments?.find(a => a.status === "Approved" || a.status === "Pending");

                  if (!nextAppt) {
                    return (
                      <div className="py-4 text-center border-2 border-dashed border-slate-100 rounded-sm">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No sessions pending</p>
                      </div>
                    );
                  }

                  const docId = typeof nextAppt.doctorId === "object" ? nextAppt.doctorId._id : nextAppt.doctorId;
                  const docObj = doctorMap[docId];

                  return (
                    <div className="flex gap-5 items-center p-4 bg-slate-50 rounded-sm border border-slate-100 hover:border-indigo-200 transition-all cursor-default">
                      <div className="bg-indigo-600 w-12 h-12 rounded-sm flex items-center justify-center text-white shadow-lg shadow-indigo-100 shrink-0">
                        <Calendar size={20} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">
                          Dr. {docObj?.lastName || "Specialist"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
                            {new Date(nextAppt.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            at {nextAppt.approvedTimeSlot || nextAppt.requestedTimeSlot}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </section>
          </div>
        )}
        {/* --- VISITS TAB (Full List) --- */}
        {activeTab === "visits" && (
          <section className="bg-white rounded-sm border border-slate-200 shadow-lg overflow-hidden transition-all">
            {/* Header with a subtle colored accent */}
            <div className="p-5 border-b border-slate-100 bg-linear-to-r from-indigo-50/50 to-white flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="w-1 h-4 bg-indigo-600 rounded-full"></span>
                Appointment Records
              </h3>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {patientAppointments?.length || 0} Total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-275">
                <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
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
                <tbody className="divide-y divide-slate-50">
                  {patientAppointments && patientAppointments.length > 0 ? (
                    patientAppointments.map((px) => {
                      const doctorId = typeof px.doctorId === "object" ? px.doctorId?._id : px.doctorId;
                      const doctor = doctorMap ? doctorMap[doctorId] : null;

                      // Color Logic for Status
                      const getStatusStyles = (status) => {
                        const s = status?.toLowerCase();
                        if (s === 'approved' || s === 'completed')
                          return 'bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-50';
                        if (s === 'pending' || s === 'requested')
                          return 'bg-amber-100 text-amber-700 border-amber-200 shadow-sm shadow-amber-50';
                        if (s === 'cancelled' || s === 'rejected')
                          return 'bg-rose-100 text-rose-700 border-rose-200 shadow-sm shadow-rose-50';
                        return 'bg-slate-100 text-slate-600 border-slate-200';
                      };

                      return (
                        <tr key={px._id} className="hover:bg-indigo-50/30 transition-colors group">
                          <td className="px-6 py-4">
                            <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                              #{px.appointmentId || px._id?.slice(-5).toUpperCase()}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            {doctor ? (
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                  {doctor.firstName[0]}{doctor.lastName[0]}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-900 whitespace-nowrap">Dr. {doctor.firstName} {doctor.lastName}</span>
                                  <span className="text-[10px] text-indigo-500 font-semibold">{doctor.specialization}</span>
                                </div>
                              </div>
                            ) : <span className="text-slate-300 italic">Unassigned</span>}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-slate-700 font-semibold whitespace-nowrap">
                                {new Date(px.appointmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                              <span className="text-[11px] text-slate-400 font-medium">
                                Slot: {px.approvedTimeSlot || px.requestedTimeSlot || "TBD"}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-sm border text-[10px] font-black uppercase tracking-wider inline-block ${getStatusStyles(px.status || 'pending')}`}>
                              {px.status || 'Pending'}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${px.paymentStatus === 'Paid' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                              <div className="flex flex-col">
                                <span className="text-slate-700 font-bold text-[11px]">{px.paymentStatus || 'Unpaid'}</span>
                                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">{px.paymentMode || 'N/A'}</span>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenPrescriptionFromVisit(px._id)}
                                className="flex-1 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95 shadow-sm"
                              >
                                Prescription
                              </button>
                              <button className="flex-1 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase hover:border-slate-800 hover:text-slate-800 transition-all active:scale-95 shadow-sm">
                                Reports
                              </button>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-right">
                            {px.qrCode ? (
                              <button
                                onClick={() => setQrModal(px.qrCode)}
                                className="bg-indigo-600 text-white px-5 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all transform active:scale-90"
                              >
                                Get QR
                              </button>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-300 mr-4">NO QR</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-20 text-center bg-slate-50/30">
                        <div className="inline-flex flex-col items-center">
                          <div className="w-12 h-12 bg-white rounded-sm shadow-sm border border-slate-100 flex items-center justify-center mb-3">
                            <span className="text-slate-300 text-xl">📂</span>
                          </div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No visit history found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {/* --- RECORDS TAB --- */}
        {activeTab === "records" && (
          <section className="bg-white rounded-4xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-linear-to-r from-slate-50/50 to-white">
              <div>
                <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] mb-1">
                  Prescriptions & Records
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Secure Digital Health Vault
                </p>
              </div>
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                <FileText size={20} className="text-indigo-500" />
              </div>
            </div>

            {/* Content Grid */}
            <div className="p-8 grid gap-4">
              {prescriptions && prescriptions.length > 0 ? (
                prescriptions.map((px) => (
                  <div
                    key={px._id}
                    onClick={() => setPrescriptionModal(px)}
                    className="group relative p-6 bg-slate-50/30 border border-slate-100 rounded-3xl hover:bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all cursor-pointer flex justify-between items-center overflow-hidden"
                  >
                    {/* Subtle background decoration */}
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                      <FileText size={100} strokeWidth={1} />
                    </div>

                    <div className="relative z-10 flex gap-6 items-center">
                      {/* Date Badge */}
                      <div className="flex flex-col items-center justify-center w-16 h-16 bg-white rounded-2xl border border-slate-100 shadow-sm group-hover:border-indigo-100 transition-colors">
                        <span className="text-[10px] font-black text-indigo-600 uppercase">
                          {new Date(px.createdAt).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-lg font-black text-slate-900">
                          {new Date(px.createdAt).getDate()}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest rounded-md">
                            Clinical Record
                          </span>
                        </div>
                        <h4 className="font-black text-slate-900 text-lg tracking-tight group-hover:text-indigo-600 transition-colors">
                          {px.diagnosis || "General Consultation"}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          Issued by <span className="text-slate-600">Dr. {px.doctorId?.lastName || "Specialist"}</span> • {new Date(px.createdAt).getFullYear()}
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-4">
                      <span className="hidden md:block text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] group-hover:text-indigo-400 transition-colors">
                        View Details
                      </span>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all transform group-hover:rotate-12">
                        <ChevronRight className="text-slate-400 group-hover:text-white transition-colors" size={18} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-4xl">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Search size={24} className="text-slate-300" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    No Clinical Records Found
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* --- SETTINGS TAB --- */}
        {activeTab === "settings" && (
          <section className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
              <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-900">Account Settings</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li>
                  <button className="w-full flex items-center justify-between px-5 py-3 rounded-sm border border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-200 transition-all duration-200">
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-semibold text-slate-800">Edit Profile</span>
                      <span className="text-xs text-slate-500">Update your personal information</span>
                    </div>
                    <span className="text-xs font-bold uppercase text-indigo-600">Open</span>
                  </button>
                </li>
              </ul>
              <div className="my-6 border-t border-dashed border-slate-200"></div>
              <div className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
                More features coming soon
              </div>
            </div>
          </section>
        )}
      </main>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {/* QR MODAL */}
        {qrModal && (
          <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white p-6 rounded-sm shadow-xl text-center max-w-sm w-full border-t-4 border-indigo-600">
              <h3 className="text-lg font-bold mb-4 uppercase tracking-tighter text-slate-900">Appointment QR</h3>
              <div className="flex items-center justify-center bg-slate-50 p-4 rounded-sm border border-slate-200">
                <img src={qrModal} alt="QR" className="w-56 h-56 object-contain mix-blend-multiply" />
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => handleDownloadQR(qrModal)} className="flex-1 py-3 text-[10px] font-bold bg-indigo-600 text-white rounded-sm uppercase tracking-widest hover:bg-indigo-700">Download</button>
                <button onClick={() => setQrModal(null)} className="flex-1 py-3 text-[10px] font-bold border border-slate-200 text-slate-600 rounded-sm uppercase tracking-widest hover:bg-slate-50">Close</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* PRESCRIPTION DETAIL MODAL */}
        {prescriptionModal && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden border border-slate-200">

              <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold uppercase tracking-tight">Prescription Detail</h2>
                  <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-1">Record ID: {prescriptionModal._id.slice(-8)}</p>
                </div>
                <button onClick={() => setPrescriptionModal(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-8 mb-8 border-b border-slate-100 pb-8">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Doctor</label>
                    <div className="flex items-center gap-2">
                      <Stethoscope size={16} className="text-indigo-600" />
                      <p className="font-bold text-slate-900 uppercase text-sm">Dr. {prescriptionModal.doctorId?.firstName} {prescriptionModal.doctorId?.lastName}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Date Issued</label>
                    <p className="font-bold text-slate-900 text-sm">{new Date(prescriptionModal.createdAt).toLocaleDateString('en-GB')}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-[0.2em] mb-3">Clinical Diagnosis</h4>
                  <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-sm">
                    <p className="text-slate-800 font-medium uppercase">{prescriptionModal.diagnosis}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-[10px] font-extrabold text-slate-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Pill size={14} /> Medication Plan
                  </h4>
                  <div className="space-y-3">
                    {prescriptionModal.medicines?.map((med, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 border border-slate-100 rounded-sm bg-slate-50/30 hover:border-indigo-200 transition-colors">
                        <div>
                          <p className="font-bold text-slate-900 text-sm uppercase">{med.name}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{med.dosage}</p>
                        </div>
                        <span className="text-[10px] font-extrabold bg-white px-3 py-1 border border-slate-200 rounded-sm text-slate-600 uppercase">{med.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-extrabold text-slate-900 uppercase tracking-[0.2em] mb-3">Professional Advice</h4>
                  <p className="text-sm text-slate-600 leading-relaxed italic border-l-4 border-slate-200 pl-4 bg-slate-50 py-3">
                    "{prescriptionModal.advice}"
                  </p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button onClick={() => setPrescriptionModal(null)} className="px-8 py-3 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all rounded-sm">
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