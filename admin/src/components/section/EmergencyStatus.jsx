import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Phone, AlertTriangle, X, Info } from 'lucide-react';
import NearbyHospitals from './NearbyHospitals';

const EmergencyStatus = ({ emergency, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900 z-[2000] overflow-y-auto font-sans">
      {/* Background Pulse Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="relative max-w-4xl mx-auto min-h-screen py-10 px-6 flex flex-col gap-8">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-800/40 p-8 rounded-sm border border-slate-700 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-purple-600 rounded-sm flex items-center justify-center shadow-2xl shadow-purple-600/30">
              <AlertTriangle size={36} className="text-white animate-bounce" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">SOS ACTIVE</h1>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-600/20 text-purple-500 rounded-sm text-[10px] font-black uppercase tracking-widest border border-purple-500/30">
                  Dispatcher Alerted
                </span>
                <span className="text-xs text-slate-400 font-bold">Request ID: #{emergency._id.slice(-6)}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-sm text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <X size={16} /> Cancel SOS
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Live Status Card */}
            <div className="bg-white rounded-sm p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase text-slate-800">Mission Health Bridge</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Our team is responding</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                   <div className="w-2 h-12 bg-slate-100 rounded-full relative overflow-hidden shrink-0">
                     <div className="absolute top-0 left-0 w-full h-1/2 bg-indigo-500 animate-pulse"></div>
                   </div>
                   <div>
                     <p className="text-xs font-black text-slate-800 uppercase tracking-wide">Ambulance Dispatching</p>
                     <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Nearest ambulance is being assigned based on your location: <span className="text-indigo-600 font-bold">{emergency.address}</span></p>
                   </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-sm flex items-start gap-3">
                  <Info size={16} className="text-indigo-400 mt-0.5" />
                  <p className="text-[10px] text-slate-600 font-bold leading-relaxed uppercase">The hospital admin is reviewing your vitals/history. Keep your phone line <span className="text-purple-600">{emergency.phone}</span> free for incoming calls.</p>
                </div>
              </div>

              <div className="pt-4 grid grid-cols-2 gap-4">
                 <button className="flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all">
                    <Phone size={14} /> Call Dispatcher
                 </button>
                 <a 
                   href={`https://www.google.com/maps/search/?api=1&query=${emergency.location.lat},${emergency.location.lng}`}
                   target="_blank" rel="noreferrer"
                   className="flex items-center justify-center gap-2 py-4 border border-slate-200 text-slate-700 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                 >
                    <MapPin size={14} /> View On Map
                 </a>
              </div>
            </div>

            {/* Nearby Section */}
            <div className="bg-slate-800/40 border border-slate-700 p-8 rounded-sm backdrop-blur-md">
              <NearbyHospitals location={emergency.location} />
            </div>
          </div>

          {/* Safety Sidebar */}
          <div className="space-y-6">
            <div className="bg-indigo-900 border border-indigo-700/50 p-6 rounded-sm text-white">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-4">First Aid Instructions</h3>
              <ul className="space-y-4">
                {[
                  "Stay calm and breathe steadily.",
                  "Loosen any restrictive clothing.",
                  "If conscious, try to sit up or lie comfortably.",
                  "Clear a path for emergency personnel."
                ].map((text, i) => (
                  <li key={i} className="flex gap-3 text-[11px] font-bold leading-relaxed">
                    <span className="text-indigo-400">0{i+1}.</span> {text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800 p-6 rounded-sm border border-slate-700">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Logged Coordinates</h3>
               <p className="text-xs font-mono text-indigo-400">{emergency.location.lat.toFixed(5)}, {emergency.location.lng.toFixed(5)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyStatus;
