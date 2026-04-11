import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Mail,
  Phone,
  Globe,
  Server,
  Lock,
  UserCheck,
  ChevronLeft,
  Settings,
  AlertTriangle,
  Fingerprint,
  Activity
} from "lucide-react";

const AdminDetail = () => {
  // Clinical System Data
  const adminInfo = {
    id: "ADM-9920",
    name: "Dr. James Sterling",
    email: "j.sterling@newcare.sys",
    phone: "+1 (555) 900-4422",
    role: "Senior System Admin",
    status: "Active",
    joinedDate: "Jan 12, 2024",
    lastIp: "192.168.1.105",
    permissions: ["Manage Doctors", "View Billing", "Audit Logs", "System Config"]
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 pt-24 p-6 lg:p-12 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* --- NAVIGATION --- */}
        <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-10 group font-black text-[10px] uppercase tracking-[0.3em]">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Return to Registry
        </button>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* --- LEFT: ADMIN IDENTITY CARD --- */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white border border-slate-100 rounded-sm p-8 text-center sticky top-28 shadow-xl shadow-indigo-900/5 overflow-hidden">
              {/* Top Accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-600 to-purple-600" />

              <div className="relative w-36 h-36 mx-auto mb-6">
                <div className="w-full h-full rounded-sm border border-slate-100 p-1 bg-slate-50">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
                    className="w-full h-full object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
                    alt="System Personnel"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full" />
              </div>

              <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">{adminInfo.name}</h2>
              <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                {adminInfo.role}
              </p>

              <div className="mt-8 pt-8 border-t border-slate-50 space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Node ID</span>
                  <span className="text-xs font-bold font-mono text-slate-700">{adminInfo.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Auth Status</span>
                  <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">● Verified</span>
                </div>
              </div>

              <button className="w-full mt-10 bg-slate-900 text-white py-4 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-600 transition-all shadow-lg shadow-slate-200">
                Revoke Credentials
              </button>
            </div>
          </motion.div>

          {/* --- RIGHT: SYSTEM PERMISSIONS & LOGS --- */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Contact Information */}
            <section className="bg-white border border-slate-100 rounded-sm p-8 md:p-10 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-8 flex items-center gap-3">
                <Fingerprint size={18} /> Personnel Dossier
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <DetailItem label="Secure Mail" value={adminInfo.email} icon={<Mail />} />
                <DetailItem label="Encrypted Line" value={adminInfo.phone} icon={<Phone />} />
                <DetailItem label="Last Access IP" value={adminInfo.lastIp} icon={<Globe />} />
                <DetailItem label="Registration" value={adminInfo.joinedDate} icon={<UserCheck />} />
              </div>
            </section>

            {/* Permissions Grid */}
            <section className="bg-white border border-slate-100 rounded-sm p-8 md:p-10 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600 flex items-center gap-3">
                  <Lock size={18} /> Privilege Matrix
                </h3>
                <Settings size={18} className="text-slate-300 cursor-pointer hover:text-indigo-600 transition-colors" />
              </div>
              <div className="flex flex-wrap gap-3">
                {adminInfo.permissions.map((perm, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-sm flex items-center gap-2 hover:border-indigo-200 hover:text-indigo-600 transition-colors cursor-default"
                  >
                    <ShieldCheck size={12} className="text-indigo-500" /> {perm}
                  </span>
                ))}
              </div>
            </section>

            {/* Danger Zone */}
            <section className="bg-rose-50 border border-rose-100 rounded-sm p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-sm border border-rose-100 text-rose-500">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h4 className="text-rose-600 text-sm font-black uppercase tracking-tighter italic">Emergency Protocol</h4>
                  <p className="text-[11px] text-rose-400 mt-1 font-bold uppercase tracking-tight leading-tight">
                    Instantly terminate all active sessions <br /> & lock global access node.
                  </p>
                </div>
              </div>
              <button className="w-full sm:w-auto px-10 py-4 bg-rose-600 text-white rounded-sm font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200">
                Execute Terminate
              </button>
            </section>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

// --- Helper Component ---
const DetailItem = ({ label, value, icon }) => (
  <div className="space-y-3 group">
    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">{label}</p>
    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-sm group-hover:border-indigo-200 transition-all">
      <div className="text-indigo-600/70">{React.cloneElement(icon, { size: 18, strokeWidth: 2.5 })}</div>
      <p className="text-xs font-black text-slate-700 truncate">{value}</p>
    </div>
  </div>
);

export default AdminDetail;