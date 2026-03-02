import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  Stethoscope,
  Users,
  Settings2,
  LogOut,
  Building2,
  LayoutDashboard
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-4 sticky top-0 h-screen transition-all">

      {/* --- BRANDING BLOCK --- */}
      <div className="hidden lg:block mb-10 px-2 pt-4">
        <div className="flex items-center gap-2 mb-1">
          <Building2 size={14} className="text-indigo-600" />
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Main Facility</p>
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">
          HMS<span className="text-indigo-600"> Admin</span>
        </h2>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 space-y-1">
        <SidebarBtn
          icon={<LayoutDashboard size={20} />}
          label="Overview"
          to="/admin/dashboard"
          active={location.pathname === "/admin/dashboard"}
        />
        <SidebarBtn
          icon={<Stethoscope size={20} />}
          label="Medical Staff"
          to="/doctor/manage"
          active={location.pathname === "/doctor/manage"}
        />
        <SidebarBtn
          icon={<Users size={20} />}
          label="Patient Registry"
          to="/patient/manage"
          active={location.pathname === "/patient/manage"}
        />
        <SidebarBtn
          icon={<Settings2 size={20} />}
          label="System Settings"
          to="/security"
          active={location.pathname === "/security"}
        />
      </nav>

      {/* --- LOGOUT --- */}
      <div className="pt-4 border-t border-slate-100">
        <button className="w-full flex items-center justify-center lg:justify-start gap-4 p-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all rounded-sm group">
          <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden lg:inline text-[11px] font-bold uppercase tracking-wider">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

const SidebarBtn = ({ icon, label, to, active = false }) => (
  <Link to={to} className="block w-full">
    <button className={`w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3 rounded-sm font-bold transition-all relative group ${active
      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
      : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"
      }`}>

      {/* Sharp side indicator for active state */}
      {active && (
        <div className="absolute right-0 top-1 bottom-1 w-1 bg-white/40" />
      )}

      <span className={`${active ? "text-white" : "group-hover:text-indigo-600"} transition-colors`}>
        {icon}
      </span>

      <span className="hidden lg:inline text-[12px] tracking-wide uppercase font-bold">
        {label}
      </span>
    </button>
  </Link>
);

export default AdminSidebar;