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
  UserPlus
} from "lucide-react";

// --- Dummy Data ---
const STATS = [
  { label: "Total Patients", value: "842", icon: <Users size={20} />, color: "bg-blue-500" },
  { label: "Today's Visits", value: "12", icon: <Calendar size={20} />, color: "bg-purple-500" },
  { label: "Avg. Wait Time", value: "15m", icon: <Clock size={20} />, color: "bg-emerald-500" },
  { label: "Urgent Cases", value: "2", icon: <Activity size={20} />, color: "bg-red-500" },
];

const RECENT_APPOINTMENTS = [
  { name: "Sarah Jenkins", time: "09:00 AM", type: "Check-up", status: "Completed" },
  { name: "Michael Ross", time: "10:30 AM", type: "Follow-up", status: "In-Progress" },
  { name: "David Miller", time: "11:15 AM", type: "Consultation", status: "Waiting" },
  { name: "Emma Wilson", time: "12:00 PM", type: "Routine", status: "Scheduled" },
];

const DoctorDashboard = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex pt-16">

      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col p-6 sticky top-16 h-[calc(100vh-64px)]">
        <div className="space-y-1 mb-8">
          <h2 className="text-xl font-black text-slate-900">Dr. Sterling</h2>
          <p className="text-xs font-bold text-primary uppercase tracking-widest">Cardiology Dept.</p>
        </div>

        <nav className="flex-1 space-y-2">
          <NavBtn icon={<Activity size={18} />} label="Overview" active />
          <NavBtn icon={<Calendar size={18} />} label="Schedule" />
          <NavBtn icon={<Users size={18} />} label="My Patients" />
          <NavBtn icon={<MessageSquare size={18} />} label="Messages" />
          <NavBtn icon={<Clipboard size={18} />} label="Medical Reports" />
        </nav>

        <div className="bg-slate-50 p-4 rounded-3xl mt-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">System Health</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-slate-700">All systems online</span>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 lg:p-12 pb-24 max-w-7xl mx-auto w-full">

        {/* Top Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Clinical Overview</h1>
            <p className="text-slate-500 text-sm mt-1">Welcome back, Doctor. You have 12 appointments today.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search patient..."
                className="bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm w-64"
              />
            </div>
            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-colors">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
            >
              <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-black/5`}>
                {stat.icon}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Appointment Queue */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-900">Patient Queue</h3>
              <button className="text-primary text-sm font-bold hover:underline">View All</button>
            </div>

            <div className="space-y-4">
              {RECENT_APPOINTMENTS.map((apt, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-200 group-hover:border-primary/30 transition-colors">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{apt.name}</p>
                      <p className="text-xs text-slate-500">{apt.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-slate-900">{apt.time}</p>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{apt.status}</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-8">
            <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20 relative overflow-hidden">
              <Activity size={120} className="absolute -bottom-10 -right-10 opacity-10 rotate-12" />
              <h4 className="text-xl font-bold mb-2">New Entry</h4>
              <p className="text-primary-light/80 text-sm mb-6">Instantly create a new medical record for a walk-in patient.</p>
              <button className="w-full bg-white text-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                <UserPlus size={18} /> Add Patient
              </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8">
              <h4 className="text-lg font-bold text-slate-900 mb-6">Upcoming Events</h4>
              <div className="space-y-6">
                <EventItem time="02:00 PM" label="Board Meeting" />
                <EventItem time="04:30 PM" label="Dept. Sync" />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const NavBtn = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:bg-slate-50 hover:text-primary"
    }`}>
    {icon} <span className="text-sm">{label}</span>
  </button>
);

const EventItem = ({ time, label }) => (
  <div className="flex items-center gap-4">
    <div className="w-1.5 h-10 bg-primary/20 rounded-full" />
    <div>
      <p className="text-sm font-bold text-slate-900">{label}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase">{time}</p>
    </div>
  </div>
);

export default DoctorDashboard;