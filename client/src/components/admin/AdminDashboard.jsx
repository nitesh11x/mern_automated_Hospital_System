import React from "react";
import { motion } from "framer-motion";
import {
  Users, UserPlus, Calendar, Star, LogOut, Activity,
  Stethoscope, ClipboardList, ShieldCheck, ArrowRight,
  Lock, Key, Eye, UserCheck, MessageSquarePlus, Edit3, ShieldAlert,
  PlusCircle, UserMinus, Settings2, FileText
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { isAdminAuthenticated } = useSelector((state) => state.admin);

  // If not authenticated, we return null to prevent rendering (Auth Guard handles redirect)
  if (!isAdminAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] pt-16">

      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-4 sticky top-16 h-[calc(100vh-64px)] transition-all">
        <div className="hidden lg:block mb-10 px-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">System Admin</p>
          <h2 className="text-xl font-black text-slate-900 italic">Control.</h2>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarBtn icon={<Activity size={20} />} label="Overview" active />
          <SidebarBtn icon={<Stethoscope size={20} />} label="Doctors" />
          <SidebarBtn icon={<Users size={20} />} label="Patients" />
          <SidebarBtn icon={<Settings2 size={20} />} label="System" />
        </nav>

        <button className="flex items-center justify-center lg:justify-start gap-3 p-3 text-slate-400 hover:text-red-500 transition-colors mt-auto font-bold">
          <LogOut size={20} /> <span className="hidden lg:inline text-sm">Logout</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-8 px-2">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Console Overview</h1>
            <p className="text-slate-500 text-xs font-medium">Global Management & Security Systems</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Active Protection</span>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* COLUMN 1: DOCTOR & STAFF */}
          <div className="space-y-6">
            <SectionHeader title="Staff Management" />
            <div className="grid grid-cols-1 gap-3">
              <MiniCard title="Register Doctor" icon={<UserPlus />} to="/doctor/register" primary />
              <MiniCard title="View All Doctors" icon={<Stethoscope />} to="/doctor/all" />
              <MiniCard title="Verify Credentials" icon={<UserCheck />} to="/doctor/verify" />
              <MiniCard title="Add New Admin" icon={<Lock />} to="/admin/register" />
            </div>
          </div>

          {/* COLUMN 2: PATIENTS & CLINICAL */}
          <div className="space-y-6">
            <SectionHeader title="Patient & Records" />
            <div className="grid grid-cols-1 gap-3">
              <MiniCard title="Register Patient" icon={<PlusCircle />} to="/patient/register" />
              <MiniCard title="View All Patients" icon={<Users />} to="/patient/all" />
              <MiniCard title="View Appointments" icon={<Calendar />} to="/appointments" />
              <MiniCard title="Medical Records" icon={<FileText />} to="/patient/records" />
            </div>
          </div>

          {/* COLUMN 3: FEEDBACK & SECURITY */}
          <div className="space-y-6">
            <SectionHeader title="Reviews & Security" />
            <div className="grid grid-cols-1 gap-3">
              <MiniCard title="Add Review" icon={<MessageSquarePlus />} to="/review/add" />
              <MiniCard title="Edit/Manage Reviews" icon={<Edit3 />} to="/review/edit" />
              <MiniCard title="View Ratings" icon={<Star />} to="/ratings" />
              <MiniCard title="Enable OTP / 2FA" icon={<Key />} to="/security" />
            </div>
          </div>

        </div>

        {/* BOTTOM QUICK TOOLS */}
        <section className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative shadow-2xl">
          <Activity className="absolute -right-6 -bottom-6 text-white/5" size={180} />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-bold mb-1">System Health</h4>
              <p className="text-slate-400 text-sm">Security logging and server status monitoring.</p>
            </div>
            <div className="flex gap-4">
              <Link to="/logs" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">View System Logs</Link>
              <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/30 transition-all hover:scale-105">Moderate Content</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const SectionHeader = ({ title }) => (
  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{title}</h3>
);

const SidebarBtn = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center justify-center lg:justify-start gap-4 px-3 py-3 rounded-xl font-bold transition-all ${active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:bg-slate-50 hover:text-primary"
    }`}>
    {icon} <span className="hidden lg:inline text-sm">{label}</span>
  </button>
);

const MiniCard = ({ title, icon, to, primary = false }) => (
  <Link to={to} className="group block">
    <div className={`flex items-center gap-4 p-4 rounded-2xl border border-slate-100 transition-all bg-white hover:border-primary/30 hover:shadow-md hover:shadow-slate-200/50 ${primary ? 'bg-primary/5 border-primary/10' : ''}`}>
      <div className={`p-2.5 rounded-xl shrink-0 ${primary ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400 group-hover:text-primary group-hover:bg-primary/10'}`}>
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900 truncate">{title}</p>
        <div className="flex items-center gap-1 text-[9px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
          Enter Module <ArrowRight size={10} />
        </div>
      </div>
    </div>
  </Link>
);

// CRITICAL: This line must be present to fix your SyntaxError
export default AdminDashboard;