import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { 
  AlertTriangle, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Siren,
  ArrowRight,
  X
} from "lucide-react";
import { toast } from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";
import { 
  getAllEmergenciesThunk, 
  updateEmergencyStatusThunk, 
  addNewEmergency 
} from "../../redux/slices/emergency.slice";

const ManageEmergency = ({ socket }) => {
  const dispatch = useDispatch();
  const { emergencies, loading } = useSelector((state) => state.emergency);
  const [selectedEmergency, setSelectedEmergency] = useState(null);

  useEffect(() => {
    dispatch(getAllEmergenciesThunk());

    if (socket) {
      const handleNewAlert = (data) => {
        dispatch(addNewEmergency(data.emergency));
      };
      
      socket.on("emergency_alert", handleNewAlert);
      return () => socket.off("emergency_alert", handleNewAlert);
    }
  }, [dispatch, socket]);

  const updateStatus = async (id, status) => {
    try {
      const resultAction = await dispatch(updateEmergencyStatusThunk({ id, status })).unwrap();
      if (selectedEmergency && selectedEmergency._id === id) {
        setSelectedEmergency(resultAction.data);
      }
      toast.success(status === "Dispatched" ? "Ambulance Dispatched Successfully!" : `Status updated to ${status}`);
    } catch (err) {
      toast.error(err || "Failed to update status");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Siren className="animate-bounce text-purple-600" size={48} />
      <p className="text-sm font-black text-purple-600 uppercase tracking-widest">Scanning Communication Channels...</p>
    </div>
  );

  return (
    <div className="relative">
      <div className="bg-white rounded-sm border border-purple-100 shadow-xl overflow-hidden animate-in fade-in duration-500">
        {/* HEADER */}
        <div className="p-6 border-b border-purple-100 bg-linear-to-r from-purple-50/30 to-white flex justify-between items-center">
          <div>
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <div className="w-1 h-5 bg-linear-to-b from-purple-600 to-indigo-600 rounded-full"></div>
              Emergency Response Management
            </h3>
            <p className="text-[9px] text-purple-500 mt-1 uppercase tracking-widest">Real-time SOS Monitoring & Dispatch Control</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-rose-100 text-rose-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-ping"></div>
              {emergencies.filter(e => e.status === "Pending").length} Critical
            </span>
            <span className="text-[10px] bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              {emergencies.length} Total Logs
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-purple-50/50 text-[10px] uppercase tracking-wider text-purple-600 font-black border-b border-purple-100">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Patient / Contact</th>
                <th className="px-6 py-4">Location & Severity</th>
                <th className="px-6 py-4">Timing</th>
                <th className="px-6 py-4 text-center">Dispatch Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {emergencies.length > 0 ? (
                emergencies.map((e) => (
                  <tr 
                    key={e._id} 
                    onClick={() => setSelectedEmergency(e)}
                    className={`hover:bg-purple-50 transition-colors cursor-pointer group ${e.status === 'Pending' ? 'bg-rose-50/10' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-sm border inline-block w-fit ${
                          e.status === "Pending" ? "bg-rose-100 text-rose-700 border-rose-200" :
                          e.status === "Dispatched" ? "bg-indigo-100 text-indigo-700 border-indigo-200" :
                          "bg-emerald-100 text-emerald-700 border-emerald-200"
                        }`}>
                          {e.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{e.patientName}</p>
                      <div className="flex items-center gap-1.5 text-indigo-600 mt-1">
                        <PhoneCall size={12} strokeWidth={3} />
                        <span className="text-[10px] font-bold">{e.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <MapPin size={12} />
                          <span className="text-[10px] font-medium truncate max-w-[180px]">{e.address || "GPS Location"}</span>
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${
                          e.severity === "Critical" ? "text-rose-600" : "text-amber-600"
                        }`}>
                          {e.severity} Priority
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock size={12} />
                        <span className="text-[10px] font-bold">{new Date(e.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-[8px] text-slate-400 font-medium uppercase mt-0.5">{new Date(e.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {e.status === "Pending" && (
                          <button 
                            onClick={() => updateStatus(e._id, "Dispatched")}
                            className="p-2 bg-indigo-600 text-white rounded-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                            title="Dispatch Unit"
                          >
                            <Siren size={14} />
                          </button>
                        )}
                        {e.status === "Dispatched" && (
                          <button 
                            onClick={() => updateStatus(e._id, "Resolved")}
                            className="p-2 bg-emerald-600 text-white rounded-sm hover:bg-emerald-700 transition-all shadow-md active:scale-95"
                            title="Mark Resolved"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${e.location.lat},${e.location.lng}`}
                          target="_blank" rel="noreferrer"
                          className="p-2 bg-slate-100 text-slate-600 rounded-sm hover:bg-slate-200 transition-all"
                          title="View Location"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center opacity-50">
                      <Siren size={48} className="text-purple-200 mb-4" />
                      <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest">No emergency logs available</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedEmergency && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-sm shadow-2xl overflow-hidden border border-purple-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-linear-to-r from-purple-600 via-purple-700 to-indigo-700 p-8 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <AlertTriangle size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Emergency Details</h2>
                    <p className="text-[10px] font-bold text-purple-100 uppercase tracking-widest mt-1">Ref ID: {selectedEmergency._id?.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedEmergency(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8 bg-purple-50/30">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-[9px] font-black uppercase text-purple-400 tracking-widest mb-1">Patient Info</p>
                    <p className="text-xl font-black text-slate-800">{selectedEmergency.patientName}</p>
                    <div className="flex items-center gap-2 text-indigo-600 mt-2">
                       <PhoneCall size={14} strokeWidth={3} />
                       <p className="text-sm font-bold">{selectedEmergency.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-purple-400 tracking-widest mb-1">Alert Level</p>
                    <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-100 rounded-full w-fit">
                      <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-rose-600 uppercase italic">{selectedEmergency.severity} Priority</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-[9px] font-black uppercase text-purple-400 tracking-widest mb-1">Time Reported</p>
                    <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                       <Clock size={14} className="text-purple-500" />
                       {new Date(selectedEmergency.createdAt).toLocaleTimeString()}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">{new Date(selectedEmergency.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-purple-400 tracking-widest mb-1">Current Status</p>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                      selectedEmergency.status === "Pending" ? "bg-amber-100 text-amber-700" :
                      selectedEmergency.status === "Dispatched" ? "bg-indigo-100 text-indigo-700" :
                      "bg-emerald-100 text-emerald-700"
                    }`}>
                      {selectedEmergency.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div className="bg-white p-6 rounded-sm border border-purple-100 shadow-sm space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-50 rounded-sm">
                    <MapPin size={24} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Reported Address</p>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                      {selectedEmergency.address || "Live GPS Tracking Data (Approx. Accuracy +/- 10m)"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                   <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedEmergency.location.lat},${selectedEmergency.location.lng}`}
                    target="_blank" rel="noreferrer"
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                   >
                     <ExternalLink size={14} /> Open In Navigation
                   </a>
                </div>
              </div>

              {/* ACTION AREA - SEND AMBULANCE */}
              <div className="pt-4 border-t border-purple-100">
                {selectedEmergency.status === "Pending" ? (
                  <button 
                    onClick={() => updateStatus(selectedEmergency._id, "Dispatched")}
                    className="w-full bg-linear-to-r from-purple-600 via-purple-700 to-indigo-700 text-white py-5 rounded-sm font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:shadow-xl hover:scale-[1.01] transition-all group"
                  >
                    <Siren size={20} className="group-hover:animate-shake" />
                    SEND AMBULANCE NOW
                    <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-2 transition-transform" />
                  </button>
                ) : selectedEmergency.status === "Dispatched" ? (
                  <button 
                    onClick={() => updateStatus(selectedEmergency._id, "Resolved")}
                    className="w-full bg-emerald-600 text-white py-5 rounded-sm font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:shadow-xl hover:scale-[1.01] transition-all"
                  >
                    <CheckCircle size={20} />
                    MARK AS RESOLVED
                  </button>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-sm flex items-center justify-center gap-3 text-emerald-700">
                    <ShieldCheck size={20} />
                    <p className="text-xs font-black uppercase tracking-widest tracking-widest">Incident Fully Resolved</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEmergency;
