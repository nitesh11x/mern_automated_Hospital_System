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
  Stethoscope
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

  // Redux State - Added fallback empty objects/arrays to prevent crashes
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

  const renderPaymentBadge = (paymentStatus) => {
    const s = (paymentStatus || "").toLowerCase();
    if (s === "paid") {
      return (
        <span className="px-3 py-1 text-xs font-bold rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
          Paid
        </span>
      );
    }
    const label = paymentStatus ? paymentStatus : "Not Paid";
    return (
      <span className="px-3 py-1 text-xs font-bold rounded-sm bg-rose-50 text-rose-700 border border-rose-100 uppercase">
        {label}
      </span>
    );
  };

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
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left Side - Recent Consultations */}
            <section className="lg:col-span-2 bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-[0.2em]">
                  Recent Consultations
                </h3>
                <button onClick={() => setActiveTab("visits")} className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest hover:text-indigo-800 flex items-center gap-2 group">
                  Full History <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-125">
                  <thead>
                    <tr className="bg-white border-b border-slate-100">
                      <th className="px-8 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Medical Professional</th>
                      <th className="px-8 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {patientAppointments && patientAppointments.length > 0 ? (
                      patientAppointments.slice(0, 5).map((visit) => {
                        const docObj = typeof visit.doctorId === "object" ? visit.doctorId : doctorMap[visit.doctorId];
                        return (
                          <tr key={visit._id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-8 py-6">
                              <p className="font-extrabold text-slate-900 text-sm uppercase tracking-tight">
                                {docObj ? `${docObj.firstName} ${docObj.lastName}` : visit.name || "—"}
                              </p>
                              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                                {docObj?.specialization || "General"}
                              </p>
                            </td>
                            <td className="px-8 py-6 text-[10px] font-bold text-slate-500 tracking-widest text-right">
                              {renderStatusBadge(visit.status)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-8 py-6 text-center text-slate-500">No recent consultations</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Right Side - Cards */}
            <section className="space-y-8">
              {/* <div className="bg-indigo-600 rounded-sm p-10 text-white relative overflow-hidden group shadow-lg shadow-indigo-100">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Zap size={100} strokeWidth={3} />
                </div>
                <div className="relative z-10">
                  <h4 className="text-3xl font-extrabold uppercase tracking-tight mb-2">
                    Request<br />Appointment
                  </h4>
                  <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8">
                    Schedule a session with a certified specialist.
                  </p>
                  <Link to={"/appointment/book"} className="inline-block text-center w-full bg-slate-900 text-white py-5 rounded-sm font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all">
                    Book Now
                  </Link>
                </div>
              </div> */}

              <div className="bg-white rounded-sm p-8 border border-slate-200 shadow-sm">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Upcoming Appointment</h4>

                {(() => {
                  // 1. Find the first appointment matching the criteria from patientAppointments
                  const nextAppt = patientAppointments?.find(
                    (a) => a.status === "Approved" || a.status === "Pending"
                  );

                  // 2. If nothing is found, return the empty state
                  if (!nextAppt) {
                    return (
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mt-4">
                        No Upcoming Appointments
                      </p>
                    );
                  }

                  // 3. Resolve the doctor object
                  const docId = typeof nextAppt.doctorId === "object" ? nextAppt.doctorId._id : nextAppt.doctorId;
                  const docObj = doctorMap[docId] || nextAppt.doctorId;

                  // 4. Return the UI card
                  return (
                    <div className="flex gap-5 items-center p-6 bg-slate-50 rounded-sm border border-slate-100 hover:border-indigo-200 transition-colors">
                      <div className="bg-indigo-600 p-3 rounded-sm text-white shadow-md shrink-0">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">
                          Dr. {docObj?.lastName || nextAppt.name || "Specialist"}
                        </p>
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mt-1">
                          {new Date(nextAppt.appointmentDate).toLocaleDateString()} • {nextAppt.approvedTimeSlot || nextAppt.requestedTimeSlot}
                        </p>
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
          <section className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-[0.2em]">Appointment Records</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-250">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Doctor</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Requested</th>
                    <th className="px-6 py-4">Approved</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Prescription</th>
                    <th className="px-6 py-4">Reports</th>
                    <th className="px-6 py-4">Get QR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patientAppointments && patientAppointments.length > 0 ? (
                    patientAppointments.map((px) => {
                      const doctorId = typeof px.doctorId === "object" ? px.doctorId._id : px.doctorId;
                      const doctor = doctorMap[doctorId];
                      return (
                        <tr key={px._id} className="hover:bg-slate-50 transition-all duration-200">
                          <td className="px-6 py-5 font-semibold text-slate-800">{px.appointmentId}</td>
                          <td className="px-6 py-5">
                            {doctor ? (
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-900 whitespace-nowrap">Dr. {doctor.firstName} {doctor.lastName}</span>
                                <span className="text-[11px] text-indigo-600 font-medium">{doctor.specialization}</span>
                              </div>
                            ) : <span className="text-slate-400 text-xs">Loading...</span>}
                          </td>
                          <td className="px-6 py-5 text-slate-600 whitespace-nowrap">{new Date(px.appointmentDate).toLocaleDateString()}</td>
                          <td className="px-6 py-5 text-slate-600 whitespace-nowrap">{px.requestedTimeSlot || "-"}</td>
                          <td className="px-6 py-5 text-slate-600 whitespace-nowrap">{px.approvedTimeSlot || "Pending"}</td>
                          <td className="px-6 py-5">{renderStatusBadge(px.status)}</td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="text-slate-700 font-medium whitespace-nowrap">{px.paymentMode || "—"}</span>
                              <span className="mt-1">{renderPaymentBadge(px.paymentStatus)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <button onClick={() => handleOpenPrescriptionFromVisit(px._id)} className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all whitespace-nowrap">
                              View
                            </button>
                          </td>
                          <td className="px-6 py-5">
                            <button className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-sm bg-slate-100 text-slate-600 hover:bg-slate-800 hover:text-white transition-all whitespace-nowrap">
                              View
                            </button>
                          </td>
                          <td className="px-6 py-5">
                            {px.qrCode ? (
                              <button onClick={() => setQrModal(px.qrCode)} className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-all whitespace-nowrap">
                                Get
                              </button>
                            ) : <span className="text-xs text-slate-400">N/A</span>}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center py-12 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        No Appointments Found
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
          <section className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em]">Prescriptions & Records</h3>
            </div>
            <div className="p-8 grid gap-6">
              {prescriptions && prescriptions.length > 0 ? (
                prescriptions.map((px) => (
                  <div key={px._id} onClick={() => setPrescriptionModal(px)} className="p-6 border border-slate-200 rounded-sm hover:border-indigo-600 transition-all cursor-pointer flex justify-between items-center group">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-lg uppercase mb-2">Diagnosis: {px.diagnosis}</h4>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                        Dr. {px.doctorId?.lastName} • {new Date(px.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-full group-hover:bg-indigo-50 transition-colors">
                      <ChevronRight className="text-slate-400 group-hover:text-indigo-600" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center py-10">
                  No prescriptions found
                </p>
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