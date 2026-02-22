import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Calendar,
  Star,
  LogOut,
  Activity,
  Settings,
  PlusCircle,
  Stethoscope,
  ClipboardList,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SYSTEM_STATS = [
  { label: "Total Doctors", value: "48", icon: <Stethoscope size={20} />, color: "bg-blue-500" },
  { label: "Total Patients", value: "1,240", icon: <Users size={20} />, color: "bg-emerald-500" },
  { label: "Appointments", value: "85", icon: <Calendar size={20} />, color: "bg-purple-500" },
  { label: "Avg. Rating", value: "4.8", icon: <Star size={20} />, color: "bg-orange-500" },
];

const AdminDashboard = () => {
  const { isAdminAuthenticated } = useSelector((state) => state.admin);

  // --- AUTHENTICATION CHECK ---
  // If not authenticated, show a professional "Access Denied" screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-slate-900 border border-white/10 p-10 rounded-[3rem] text-center"
        >
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={40} />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-8">You must be logged in with administrative privileges to view this console.</p>
          <Link
            to="/admin/login"
            className="flex items-center justify-center gap-2 w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all"
          >
            Go to Login <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0F172A] pt-16 text-gray-100">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-slate-900/50 border-r border-white/5 hidden lg:flex flex-col p-6 sticky top-16 h-[calc(100vh-64px)]">
        <div className="mb-10 px-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">System Admin</p>
          <h2 className="text-xl font-black text-white italic">Control<span className="text-primary text-2xl">.</span></h2>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarBtn icon={<Activity size={18} />} label="Overview" active />
          <SidebarBtn icon={<Stethoscope size={18} />} label="Manage Doctors" />
          <SidebarBtn icon={<Users size={18} />} label="Patient Directory" />
          <SidebarBtn icon={<ClipboardList size={18} />} label="Review Logs" />
          <SidebarBtn icon={<Settings size={18} />} label="System Config" />
        </nav>

        <button className="flex items-center gap-3 p-4 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all mt-auto font-bold text-sm">
          <LogOut size={18} /> Terminate Session
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 lg:p-12 pb-24">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-white">Console Overview</h1>
            <p className="text-gray-500 text-sm mt-1">Real-time system analytics and management.</p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/10">
            <button className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20">Live Feed</button>
            <button className="px-6 py-2.5 text-gray-400 font-bold text-sm">Reports</button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {SYSTEM_STATS.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-slate-900 border border-white/5 p-6 rounded-3xl shadow-xl"
            >
              <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-black/20`}>
                {stat.icon}
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Management Actions</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard title="Register Doctor" desc="Add a new specialist to the staff directory." icon={<UserPlus size={24} />} color="border-primary/20 hover:bg-primary/5" btnText="Add Now" primary />
          <ActionCard title="Review All Doctors" desc="View, edit, or remove medical professionals." icon={<Stethoscope size={24} />} btnText="Manage List" />
          <ActionCard title="Patient Database" desc="Access clinical records and patient history." icon={<Users size={24} />} btnText="Open Directory" />
          <ActionCard title="Appointment Logs" desc="Track and manage all scheduled consultations." icon={<Calendar size={24} />} btnText="View Calendar" />
          <ActionCard title="Patient Reviews" desc="Moderate feedback and service ratings." icon={<Star size={24} />} btnText="Check Reviews" />

          <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 text-center group cursor-pointer hover:border-primary/50 transition-all">
            <PlusCircle className="text-gray-600 group-hover:text-primary transition-colors mb-2" size={32} />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Custom Action</p>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- SUB COMPONENTS ---

const SidebarBtn = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-500 hover:bg-white/5 hover:text-white"
    }`}>
    {icon} <span className="text-sm">{label}</span>
  </button>
);

const ActionCard = ({ title, desc, icon, btnText, primary = false, color = "border-white/5 hover:bg-white/5" }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`bg-slate-900 border p-8 rounded-[2.5rem] flex flex-col items-start transition-all ${color}`}
  >
    <div className={`p-4 rounded-2xl mb-6 ${primary ? 'bg-primary/10 text-primary' : 'bg-white/5 text-gray-400'}`}>
      {icon}
    </div>
    <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
    <p className="text-gray-500 text-sm leading-relaxed mb-8">{desc}</p>
    <button className={`mt-auto px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${primary ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-white/10 text-white hover:bg-white/20'
      }`}>
      {btnText}
    </button>
  </motion.div>
);

export default AdminDashboard;