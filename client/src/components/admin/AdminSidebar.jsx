import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  Stethoscope,
  Users,
  Settings2,
  LogOut,
  ShieldAlert
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-20 lg:w-64 bg-white border-r border-slate-100 hidden md:flex flex-col p-4 sticky top-16 h-[calc(100vh-64px)] transition-all">
      {/* --- BRANDING BLOCK --- */}
      <div className="hidden lg:block mb-10 px-2">
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert size={14} className="text-purple-600" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Secure Node</p>
        </div>
        <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">
          Admin<span className="text-indigo-600">.</span>
        </h2>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 space-y-1.5">
        <SidebarBtn
          icon={<Activity size={20} />}
          label="Overview"
          to="/admin/dashboard"
          active={location.pathname === "/admin/dashboard"}
        />
        <SidebarBtn
          icon={<Stethoscope size={20} />}
          label="Doctors"
          to="/doctor/manage"
          active={location.pathname === "/doctor/manage"}
        />
        <SidebarBtn
          icon={<Users size={20} />}
          label="Patients"
          to="/patient/manage"
          active={location.pathname === "/patient/manage"}
        />
        <SidebarBtn
          icon={<Settings2 size={20} />}
          label="System"
          to="/security"
          active={location.pathname === "/security"}
        />
      </nav>

      {/* --- LOGOUT --- */}
      <button className="flex items-center justify-center lg:justify-start gap-4 p-3 text-slate-400 hover:text-rose-600 transition-colors mt-auto font-black uppercase text-[11px] tracking-widest group">
        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="hidden lg:inline">Terminate</span>
      </button>
    </aside>
  );
};

const SidebarBtn = ({ icon, label, to, active = false }) => (
  <Link to={to} className="block w-full">
    <button className={`w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3 rounded-sm font-bold transition-all relative overflow-hidden group ${active
        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
        : "text-slate-500 hover:bg-purple-50 hover:text-purple-700"
      }`}>

      {/* Subtle indicator for active state */}
      {active && (
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-purple-400" />
      )}

      <span className={`${active ? "text-white" : "group-hover:text-purple-600"} transition-colors`}>
        {icon}
      </span>

      <span className="hidden lg:inline text-[13px] tracking-tight uppercase font-black">
        {label}
      </span>
    </button>
  </Link>
);

export default AdminSidebar;