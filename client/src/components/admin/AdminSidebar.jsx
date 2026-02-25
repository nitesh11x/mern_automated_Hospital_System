import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Activity, 
  Stethoscope, 
  Users, 
  Settings2, 
  LogOut 
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-4 sticky top-16 h-[calc(100vh-64px)] transition-all">
      <div className="hidden lg:block mb-10 px-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">System Admin</p>
        <h2 className="text-xl font-black text-slate-900 italic">Control.</h2>
      </div>

      <nav className="flex-1 space-y-2">
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
          to="/patient/all" 
          active={location.pathname === "/patient/all"} 
        />
        <SidebarBtn 
          icon={<Settings2 size={20} />} 
          label="System" 
          to="/security" 
          active={location.pathname === "/security"} 
        />
      </nav>

      <button className="flex items-center justify-center lg:justify-start gap-3 p-3 text-slate-400 hover:text-red-500 transition-colors mt-auto font-bold">
        <LogOut size={20} /> <span className="hidden lg:inline text-sm">Logout</span>
      </button>
    </aside>
  );
};

const SidebarBtn = ({ icon, label, to, active = false }) => (
  <Link to={to} className="block w-full">
    <button className={`w-full flex items-center justify-center lg:justify-start gap-4 px-3 py-3 rounded-xl font-bold transition-all ${
      active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:bg-slate-50 hover:text-primary"
    }`}>
      {icon} <span className="hidden lg:inline text-sm">{label}</span>
    </button>
  </Link>
);

export default AdminSidebar;