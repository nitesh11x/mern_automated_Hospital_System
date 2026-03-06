import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDoctorAppointments, updateAppointmentStatus } from "../../redux/slices/appointment.slice";
import { createPrescriptionThunk, resetPrescriptionState } from "../../redux/slices/prescription.slice";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, CalendarCheck, Users, FileText, Settings,
  LogOut, Bell, Search, X, CheckCircle2, Clock, AlertCircle, Plus, Trash2, MapPin
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

  // Sync Form when opening Modal (Auto-fill if prescription exists)
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

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar - Same as before */}
      <aside className="w-72 bg-indigo-800 hidden lg:flex flex-col sticky top-0 h-screen shadow-xl z-20">
        <div className="p-8 border-b border-indigo-700">
          <h2 className="text-xl font-bold text-white tracking-tighter">DR. {doctor?.lastName?.toUpperCase()}</h2>
          <p className="text-[10px] font-bold text-indigo-300 uppercase">{doctor?.specialization}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavBtn icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavBtn icon={<CalendarCheck size={18} />} label="Appointments" active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-black text-indigo-900 uppercase tracking-widest">{activeTab}</h1>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'appointments' ? (
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Patient Details</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Apt ID & Schedule</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Prescription Info</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments?.map((apt) => (
                    <tr key={apt._id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Patient Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={apt.patientId?.profileUrl?.url} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" />
                          <div>
                            <p className="text-sm font-bold text-slate-900">{apt.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase font-black">{apt.gender} • {apt.relation}</p>
                          </div>
                        </div>
                      </td>

                      {/* Apt ID & Schedule */}
                      <td className="px-6 py-4">
                        <p className="text-[10px] font-black text-indigo-600 mb-1">{apt.appointmentId || 'PENDING'}</p>
                        <p className="text-xs font-bold text-slate-700">{new Date(apt.appointmentDate).toLocaleDateString()}</p>
                        <p className="text-[10px] text-slate-500">{apt.requestedTimeSlot}</p>
                      </td>

                      {/* Prescription Info - Highlights multi-medicines */}
                      <td className="px-6 py-4">
                        {apt.prescriptionId ? (
                          <div className="max-w-50">
                            <p className="text-[10px] font-bold text-green-600 uppercase flex items-center gap-1"><CheckCircle2 size={10} /> Prescribed</p>
                            <p className="text-[10px] text-slate-600 truncate italic">"{apt.prescriptionId.diagnosis}"</p>
                            <p className="text-[9px] text-indigo-400 font-bold mt-1">
                              {apt.prescriptionId.medicines?.length} Medicines Added
                            </p>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-300 uppercase italic">No Rx Found</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <ActionButtons apt={apt} handleStatusUpdate={handleStatusUpdate} setPrescriptionApptId={setPrescriptionApptId} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Dashboard View - Quick Stats */
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard label="Total Patients" value={appointments?.length} color="indigo" />
              <StatCard label="Today's Paid" value={appointments?.filter(a => a.paymentStatus === "Paid").length} color="green" />
              <StatCard label="Pending Approval" value={appointments?.filter(a => a.status === "Pending").length} color="amber" />
              {/* QR Preview Widget */}
              <div className="bg-white p-4 border border-slate-200 rounded-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Recent QR</p>
                  <p className="text-sm font-bold">{appointments?.[0]?.appointmentId || 'N/A'}</p>
                </div>
                {appointments?.[0]?.qrCode && <img src={appointments[0].qrCode} className="w-10 h-10 opacity-50 hover:opacity-100 transition-opacity" alt="QR" />}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Prescription Modal - Handles Multiple Medicines */}
      <AnimatePresence>
        {prescriptionApptId && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-3xl rounded-sm shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
                <div>
                  <h3 className="text-lg font-black text-indigo-900 uppercase tracking-tighter">Medical Prescription</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Apt ID: {appointments?.find(a => a._id === prescriptionApptId)?.appointmentId}</p>
                </div>
                <button onClick={() => setPrescriptionApptId(null)} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400"><X size={20} /></button>
              </div>

              <form onSubmit={submitPrescription} className="flex-1 overflow-y-auto p-8 space-y-8">
                <Input label="Primary Diagnosis / Findings" required value={prescriptionForm.diagnosis} onChange={(e) => setPrescriptionForm({ ...prescriptionForm, diagnosis: e.target.value })} />

                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h4 className="text-[10px] font-black text-indigo-900 uppercase">Medicines & Dosage</h4>
                    <button type="button" onClick={addMedicineRow} className="flex items-center gap-1 text-[10px] font-black text-white bg-indigo-600 px-3 py-1.5 rounded-sm hover:bg-indigo-700 transition-all uppercase"><Plus size={12} /> Add</button>
                  </div>

                  {prescriptionForm.medicines.map((med, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-3 items-end group animate-in slide-in-from-right-2">
                      <div className="col-span-5">
                        <Input label="Medication Name" placeholder="e.g. Paracetamol" value={med.name} onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)} />
                      </div>
                      <div className="col-span-3">
                        <Input label="Dosage" placeholder="e.g. 500mg" value={med.dosage} onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)} />
                      </div>
                      <div className="col-span-3">
                        <Input label="Duration" placeholder="e.g. 5 Days" value={med.duration} onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)} />
                      </div>
                      <div className="col-span-1 pb-2">
                        {prescriptionForm.medicines.length > 1 && (
                          <button type="button" onClick={() => removeMedicineRow(idx)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 p-4 rounded-sm border border-slate-100">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">General Advice</label>
                  <textarea className="w-full h-24 bg-white border border-slate-200 rounded-sm p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={prescriptionForm.advice} onChange={(e) => setPrescriptionForm({ ...prescriptionForm, advice: e.target.value })} placeholder="Dietary restrictions, rest instructions, etc." />
                </div>

                <button type="submit" className="w-full bg-indigo-900 text-white font-black py-4 rounded-sm hover:bg-indigo-800 transition-all uppercase text-xs tracking-[0.2em] shadow-xl shadow-indigo-100">
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

// --- HELPERS ---
const StatCard = ({ label, value, color }) => (
  <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-3xl font-black text-${color}-600`}>{value || 0}</p>
  </div>
);

const ActionButtons = ({ apt, handleStatusUpdate, setPrescriptionApptId }) => {
  const s = apt.status?.toLowerCase();
  return (
    <div className="flex justify-end gap-2">
      {s === 'pending' && (
        <button onClick={() => handleStatusUpdate(apt._id, 'Approved')} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-sm"><CheckCircle2 size={18} /></button>
      )}
      {s === 'approved' && (
        <button onClick={() => handleStatusUpdate(apt._id, 'Completed')} className="text-[10px] font-black bg-indigo-600 text-white px-4 py-2 rounded-sm uppercase tracking-widest">Finish Visit</button>
      )}
      {s === 'completed' && (
        <button onClick={() => setPrescriptionApptId(apt._id)} className="flex items-center gap-1 text-[10px] font-black border-2 border-indigo-900 text-indigo-900 px-4 py-2 rounded-sm hover:bg-indigo-900 hover:text-white transition-all uppercase tracking-widest">
          <FileText size={12} /> {apt.prescriptionId ? 'Modify Rx' : 'Prescribe'}
        </button>
      )}
    </div>
  );
};

const NavBtn = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-bold transition-all ${active ? "bg-indigo-700 text-white shadow-lg" : "text-indigo-200 hover:bg-indigo-700/50"}`}>
    {icon} <span>{label}</span>
  </button>
);

const Input = ({ label, ...props }) => (
  <div className="w-full">
    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">{label}</label>
    <input {...props} className="w-full border-b-2 border-slate-200 bg-transparent py-2 text-sm focus:border-indigo-600 outline-none transition-all font-bold text-slate-800" />
  </div>
);

export default DoctorDashboard;