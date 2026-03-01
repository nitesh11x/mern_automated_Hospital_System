import React from "react";
import { motion } from "framer-motion";
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
  LogOut
} from "lucide-react";

// --- System Telemetry Data ---
const STATS = [
  { label: "Total Registry", value: "842", icon: <Users size={18} />, color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Active Sessions", value: "12", icon: <Calendar size={18} />, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Avg latency", value: "15m", icon: <Clock size={18} />, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Critical Alert", value: "02", icon: <Zap size={18} />, color: "text-red-600", bg: "bg-red-50" },
];

const RECENT_APPOINTMENTS = [
  { id: "PX-9901", name: "Sarah Jenkins", time: "09:00", type: "CARDIOGRAM", status: "COMPLETED", priority: "NORMAL" },
  { id: "PX-9924", name: "Michael Ross", time: "10:30", type: "FOLLOW-UP", status: "IN-PROGRESS", priority: "HIGH" },
  { id: "PX-9941", name: "David Miller", time: "11:15", type: "CONSULTATION", status: "WAITING", priority: "URGENT" },
  { id: "PX-9950", name: "Emma Wilson", time: "12:00", type: "ROUTINE", status: "SCHEDULED", priority: "NORMAL" },
];

const DoctorDashboard = () => {
  return (
    <div className="min-h-screen bg-[#FBFBFF] flex pt-20 font-sans">

      {/* --- TACTICAL SIDEBAR --- */}
      <aside className="w-80 bg-white border-r border-slate-200 hidden lg:flex flex-col p-8 sticky top-20 h-[calc(100vh-80px)] shadow-sm">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-indigo-600 rounded-sm" />
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Dr. Sterling</h2>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Cardiology / Node 04</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <NavBtn icon={<LayoutDashboard size={18} />} label="Command Center" active />
          <NavBtn icon={<Calendar size={18} />} label="Operational Roster" />
          <NavBtn icon={<Users size={18} />} label="Patient Registry" />
          <NavBtn icon={<MessageSquare size={18} />} label="Secure Comms" />
          <NavBtn icon={<Clipboard size={18} />} label="Dossier Archives" />
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
            <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Clinical <span className="text-indigo-600">Operations</span></h1>
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
              {RECENT_APPOINTMENTS.map((apt, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-sm hover:border-indigo-600 hover:bg-white transition-all cursor-pointer group">
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black text-slate-300 font-mono tracking-tighter group-hover:text-indigo-600">{apt.id}</span>
                    <div>
                      <p className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">{apt.name}</p>
                      <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{apt.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-black text-slate-900 tracking-tighter">{apt.time}</p>
                      <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${apt.priority === 'URGENT' ? 'bg-red-50 border-red-200 text-red-600' :
                          apt.priority === 'HIGH' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                            'bg-slate-200/50 border-slate-300 text-slate-500'
                        }`}>
                        {apt.priority}
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
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
      </main>
    </div>
  );
};

// --- TACTICAL COMPONENTS ---

const NavBtn = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm font-black transition-all border ${active
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