import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDoctorAppointments, updateAppointmentStatus } from "../../redux/slices/appointment.slice";
import { createPrescriptionThunk } from "../../redux/slices/prescription.slice";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Calendar,
  Clock,
  Search,
  MessageSquare,
  Bell,
  Clipboard,
  MoreVertical,
  ChevronRight,
  Activity,
  UserPlus,
  ShieldCheck,
  Zap,
  LayoutDashboard,
  LogOut,
  X
} from "lucide-react";

// --- System Telemetry Data ---
const STATS = [
  { label: "Total Registry", value: "842", icon: <Users size={18} />, color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Active Sessions", value: "12", icon: <Calendar size={18} />, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Avg latency", value: "15m", icon: <Clock size={18} />, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Critical Alert", value: "02", icon: <Zap size={18} />, color: "text-red-600", bg: "bg-red-50" },
];

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { doctor } = useSelector((state) => state.doctor);
  const { appointments } = useSelector((state) => state.appointment);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [prescriptionApptId, setPrescriptionApptId] = useState(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: "",
    medicineName: "",
    medicineDosage: "",
    medicineDuration: "",
    advice: ""
  });

  useEffect(() => {
    dispatch(getDoctorAppointments());
  }, [dispatch]);

  const handleStatusUpdate = (id, status) => {
    dispatch(updateAppointmentStatus({ id, status }));
  };

  const submitPrescription = (e) => {
    e.preventDefault();
    const appt = appointments.find(a => a._id === prescriptionApptId);

    dispatch(createPrescriptionThunk({
      appointmentId: appt._id,
      patientId: appt.patientId._id,
      diagnosis: prescriptionForm.diagnosis,
      advice: prescriptionForm.advice,
      medicines: [{
        name: prescriptionForm.medicineName,
        dosage: prescriptionForm.medicineDosage,
        duration: prescriptionForm.medicineDuration
      }]
    })).then(() => {
      setPrescriptionApptId(null);
      setPrescriptionForm({
        diagnosis: "",
        medicineName: "",
        medicineDosage: "",
        medicineDuration: "",
        advice: ""
      });
    });
  };

  return (
    <div className="min-h-screen bg-[#FBFBFF] flex pt-20 font-sans">

      {/* --- TACTICAL SIDEBAR --- */}
      <aside className="w-80 bg-white border-r border-slate-200 hidden lg:flex flex-col p-8 sticky top-20 h-[calc(100vh-80px)] shadow-sm">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-indigo-600 rounded-sm" />
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Dr. {doctor?.lastName || 'Sterling'}</h2>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">{doctor?.specialization || 'Cardiology'} / Node 04</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <NavBtn icon={<LayoutDashboard size={18} />} label="Command Center" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavBtn icon={<Calendar size={18} />} label="Operational Roster" active={activeTab === 'roster'} onClick={() => setActiveTab('roster')} />
          <NavBtn icon={<Users size={18} />} label="Patient Registry" active={activeTab === 'patients'} onClick={() => setActiveTab('patients')} />
          <NavBtn icon={<MessageSquare size={18} />} label="Secure Comms" active={activeTab === 'comms'} onClick={() => setActiveTab('comms')} />
          <NavBtn icon={<Clipboard size={18} />} label="Dossier Archives" active={activeTab === 'archives'} onClick={() => setActiveTab('archives')} />
        </nav>

        <div className="space-y-4 mt-auto">
          <div className="bg-slate-900 p-6 rounded-sm text-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">System Integrity</p>
              <ShieldCheck size={14} className="text-emerald-500" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Encrypted / Online</span>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-3 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-red-600 transition-colors">
            <LogOut size={16} /> Terminate Session
          </button>
        </div>
      </aside>

      {/* --- MAIN COMMAND CONTENT --- */}
      <main className="flex-1 p-8 lg:p-14 pb-24 max-w-7xl mx-auto w-full">

        {/* Tactical Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity size={18} className="text-indigo-600" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Real-time Status Update</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
              {activeTab === 'dashboard' ? 'Clinical Operations' :
                activeTab === 'roster' ? 'Operational Roster' :
                  activeTab === 'patients' ? 'Patient Registry' :
                    activeTab === 'comms' ? 'Secure Comms' : 'Dossier Archives'}
            </h1>
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mt-4">Sector Status: High Volume / 12 Incoming Sessions</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={16} />
              <input
                type="text"
                placeholder="FIND PATIENT ID..."
                className="bg-white border border-slate-200 rounded-sm py-4 pl-14 pr-6 outline-none focus:border-indigo-600 transition-all text-[11px] font-black tracking-widest w-72 uppercase"
              />
            </div>
            <button className="p-4 bg-white border border-slate-200 rounded-sm text-slate-400 hover:text-indigo-600 transition-all relative">
              <Bell size={20} />
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full" />
            </button>
          </div>
        </header>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {STATS.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-600 transition-all">
              <div className="relative z-10">
                <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-sm flex items-center justify-center mb-6`}>
                  {stat.icon}
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-4xl font-black text-slate-900 italic tracking-tighter">{stat.value}</p>
              </div>
              <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                {React.cloneElement(stat.icon, { size: 80 })}
              </div>
            </div>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div className="grid lg:grid-cols-12 gap-10">

            {/* Patient Queue Terminal */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-sm p-10 shadow-sm">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-4 bg-indigo-600" />
                  <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Operational Queue</h3>
                </div>
                <button className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-colors">Open Registry</button>
              </div>

              <div className="space-y-3">
                {appointments && appointments.length > 0 ? appointments.map((apt) => (
                  <div key={apt._id} className="p-5 bg-slate-50 border border-slate-100 rounded-sm hover:border-indigo-600 hover:bg-white transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-6">
                        <span className="text-[10px] font-black text-slate-300 font-mono tracking-tighter group-hover:text-indigo-600">{apt.appointmentId}</span>
                        <div>
                          <p className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">{apt.patientId?.firstName} {apt.patientId?.lastName}</p>
                          <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{apt.gender} • {apt.relation}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-12">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-black text-slate-900 tracking-tighter">{new Date(apt.appointmentDate).toLocaleDateString()}</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{apt.requestedTimeSlot}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${apt.status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                            apt.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                              'bg-slate-200/50 border-slate-300 text-slate-500'
                            }`}>
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Status Actions */}
                    <div className="flex gap-2 justify-end border-t border-slate-100 pt-3 mt-3">
                      {apt.status === 'pending' && (
                        <>
                          <button onClick={() => handleStatusUpdate(apt._id, 'approved')} className="text-[9px] px-3 py-1 font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-sm transition-colors uppercase">Approve</button>
                          <button onClick={() => handleStatusUpdate(apt._id, 'cancelled')} className="text-[9px] px-3 py-1 font-bold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-sm transition-colors uppercase">Cancel</button>
                        </>
                      )}
                      {apt.status === 'approved' && (
                        <button onClick={() => handleStatusUpdate(apt._id, 'completed')} className="text-[9px] px-3 py-1 font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-sm transition-colors uppercase" title="Mark as Completed">Complete</button>
                      )}
                      {apt.status === 'completed' && (
                        <button onClick={() => setPrescriptionApptId(apt._id)} className="text-[9px] px-3 py-1 font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-sm transition-colors uppercase border border-indigo-200">Add Prescription</button>
                      )}
                    </div>
                  </div>
                )) : (
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mt-4">No Appointments in Queue</p>
                )}
              </div>
            </div>

            {/* Quick Command Sidebar */}
            <div className="lg:col-span-4 space-y-10">
              <div className="bg-indigo-600 p-10 rounded-sm text-white shadow-xl shadow-indigo-900/10 relative overflow-hidden group">
                <Activity size={140} className="absolute -bottom-10 -right-10 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-500" />
                <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-2">New Entry</h4>
                <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest leading-loose mb-8 opacity-70">Provision fresh dossier for walk-in patient.</p>
                <button className="w-full bg-white text-indigo-600 py-5 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-900 hover:text-white transition-all">
                  <UserPlus size={18} /> Add to registry
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-sm p-10 shadow-sm">
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 pb-4 border-b border-slate-100">Logistics Schedule</h4>
                <div className="space-y-8">
                  <EventItem time="14:00" label="Surgical Board Sync" type="CONFERENCE" />
                  <EventItem time="16:30" label="Dept. Node Update" type="MAINTENANCE" />
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab !== 'dashboard' && (
          <div className="bg-white border border-slate-200 rounded-sm p-16 shadow-sm flex flex-col items-center justify-center text-center">
            <Activity size={48} className="text-slate-200 mb-6" />
            <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Module Offline</h2>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] max-w-md">
              The {activeTab} module is currently undergoing scheduled maintenance or is pending integration.
            </p>
          </div>
        )}

      </main>

      {/* Prescription Modal */}
      <AnimatePresence>
        {prescriptionApptId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-8 flex flex-col gap-6 max-w-lg w-full rounded-sm border border-slate-200 shadow-2xl relative"
            >
              <button
                onClick={() => setPrescriptionApptId(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>

              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Write Prescription</h3>
                <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-600">Provide medication and advice.</p>
              </div>

              <form onSubmit={submitPrescription} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Diagnosis</label>
                  <input required value={prescriptionForm.diagnosis} onChange={(e) => setPrescriptionForm({ ...prescriptionForm, diagnosis: e.target.value })} type="text" className="w-full text-sm font-bold bg-slate-50 border border-slate-200 p-3 outline-none focus:border-indigo-600" placeholder="e.g. Viral Fever" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Medicine</label>
                    <input required value={prescriptionForm.medicineName} onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medicineName: e.target.value })} type="text" className="w-full text-sm font-bold bg-slate-50 border border-slate-200 p-3 outline-none focus:border-indigo-600" placeholder="e.g. Paracetamol" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Dosage</label>
                    <input required value={prescriptionForm.medicineDosage} onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medicineDosage: e.target.value })} type="text" className="w-full text-sm font-bold bg-slate-50 border border-slate-200 p-3 outline-none focus:border-indigo-600" placeholder="e.g. 500mg, 1-0-1" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Duration</label>
                  <input required value={prescriptionForm.medicineDuration} onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medicineDuration: e.target.value })} type="text" className="w-full text-sm font-bold bg-slate-50 border border-slate-200 p-3 outline-none focus:border-indigo-600" placeholder="e.g. 5 Days" />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Medical Advice</label>
                  <textarea required value={prescriptionForm.advice} onChange={(e) => setPrescriptionForm({ ...prescriptionForm, advice: e.target.value })} className="w-full text-sm font-bold bg-slate-50 border border-slate-200 p-3 outline-none focus:border-indigo-600 h-24" placeholder="Rest and drink plenty of fluids..."></textarea>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-indigo-600 text-white font-bold text-[11px] uppercase tracking-[0.2em] py-4 rounded-sm hover:bg-slate-900 transition-colors">
                    Issue Prescription
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- TACTICAL COMPONENTS ---

const NavBtn = ({ icon, label, active = false, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm font-black transition-all border ${active
    ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20"
    : "text-slate-400 border-transparent hover:bg-slate-50 hover:text-indigo-600"
    }`}>
    {icon} <span className="text-[11px] uppercase tracking-[0.2em]">{label}</span>
  </button>
);

const EventItem = ({ time, label, type }) => (
  <div className="flex items-start gap-4 group">
    <div className="flex flex-col items-center">
      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mb-1" />
      <div className="w-px h-10 bg-slate-100 group-last:hidden" />
    </div>
    <div className="-mt-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{time} / {type}</p>
      <p className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">{label}</p>
    </div>
  </div>
);

export default DoctorDashboard;