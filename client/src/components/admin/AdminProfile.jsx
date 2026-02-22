import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  Key, 
  Terminal, 
  Clock, 
  ShieldAlert, 
  Settings,
  Edit,
  Activity
} from "lucide-react";

// --- Dummy Data ---
const ADMIN_DATA = {
  firstName: "James",
  lastName: "Sterling",
  email: "j.sterling@newcare.sys",
  phone: "+1 (555) 900-4422",
  role: "Senior Administrator",
  clearance: "Level 4 (Full Access)",
  lastLogin: "Oct 24, 2025 • 08:14 AM",
  ipAddress: "192.168.1.105"
};

const LOG_ACTIVITIES = [
  { id: 1, action: "Doctor Record Updated", time: "2 hrs ago", status: "Success" },
  { id: 2, action: "Patient Export Generated", time: "5 hrs ago", status: "Success" },
  { id: 3, action: "System Firewall Sync", time: "Yesterday", status: "Auto" },
];

const AdminProfile = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white pt-16 pb-20 px-6">
      <div className="max-w-6xl mx-auto py-10">
        
        {/* --- TOP HEADER: IDENTITY --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-2 border-primary shadow-2xl shadow-primary/20 flex items-center justify-center bg-black/40 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" 
                  alt="Admin" 
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-primary p-2 rounded-xl border-4 border-[#0A0F1E]">
                <ShieldCheck size={20} className="text-white" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-4xl font-black tracking-tight">{ADMIN_DATA.firstName} {ADMIN_DATA.lastName}</h1>
                <span className="w-fit mx-auto md:mx-0 px-3 py-1 bg-primary/20 text-primary border border-primary/30 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">
                  {ADMIN_DATA.clearance}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-400">
                <IdentityStat icon={<Key size={14}/>} label="Role" value={ADMIN_DATA.role} />
                <IdentityStat icon={<Clock size={14}/>} label="Last Active" value="08:14 AM" />
                <IdentityStat icon={<Terminal size={14}/>} label="Node ID" value="SYS-99X" />
                <IdentityStat icon={<Activity size={14}/>} label="Status" value="Online" />
              </div>
            </div>

            <button className="bg-white text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary hover:text-white transition-all">
              <Edit size={18} /> Edit Profile
            </button>
          </div>
        </motion.div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left: Detailed Info */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
              <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                <Settings size={20} className="text-primary" /> Admin Settings
              </h3>
              <div className="grid sm:grid-cols-2 gap-8">
                <AdminDetail label="Email Address" value={ADMIN_DATA.email} icon={<Mail />} />
                <AdminDetail label="Contact Line" value={ADMIN_DATA.phone} icon={<Phone />} />
                <AdminDetail label="IP Restricted" value={ADMIN_DATA.ipAddress} icon={<ShieldAlert />} />
                <AdminDetail label="Auth Method" value="Biometric + 2FA" icon={<ShieldCheck />} />
              </div>
            </section>
          </div>

          {/* Right: System Log Activity */}
          <aside className="space-y-8">
            <div className="bg-primary/10 border border-primary/20 rounded-[2.5rem] p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Terminal size={20} className="text-primary" /> Security Log
              </h3>
              <div className="space-y-6">
                {LOG_ACTIVITIES.map((log) => (
                  <div key={log.id} className="flex justify-between items-center group">
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{log.action}</p>
                      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">{log.time}</p>
                    </div>
                    <span className="text-[10px] font-black text-primary px-2 py-1 bg-primary/10 rounded-md">
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all uppercase tracking-widest">
                Export Audit Log
              </button>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const IdentityStat = ({ icon, label, value }) => (
  <div>
    <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-1 mb-1">
      {icon} {label}
    </p>
    <p className="text-xs font-bold text-white">{value}</p>
  </div>
);

const AdminDetail = ({ label, value, icon }) => (
  <div className="space-y-2">
    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{label}</p>
    <div className="flex items-center gap-3 p-4 bg-black/20 border border-white/5 rounded-2xl">
      <div className="text-primary">{React.cloneElement(icon, { size: 18 })}</div>
      <p className="text-sm font-bold text-gray-300">{value}</p>
    </div>
  </div>
);

export default AdminProfile;