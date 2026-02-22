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
  AlertTriangle
} from "lucide-react";

const AdminDetail = () => {
  // Dummy data for the specific admin being viewed
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
    <div className="min-h-screen bg-[#0F172A] text-gray-100 pt-16 p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">

        {/* Navigation Header */}
        <button className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 group font-bold text-sm uppercase tracking-widest">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Admin List
        </button>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* --- LEFT: ADMIN IDENTITY CARD --- */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 text-center sticky top-24">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="w-full h-full rounded-3xl border-2 border-primary/30 p-1">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
                    className="w-full h-full object-cover rounded-[1.2rem] grayscale hover:grayscale-0 transition-all duration-500"
                    alt="Admin Profile"
                  />
                </div>
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-slate-900 rounded-full animate-pulse" />
              </div>

              <h2 className="text-2xl font-black text-white">{adminInfo.name}</h2>
              <p className="text-primary text-xs font-black uppercase tracking-widest mt-1">
                {adminInfo.role}
              </p>

              <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-bold uppercase">System ID</span>
                  <span className="text-white font-mono">{adminInfo.id}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-bold uppercase">Status</span>
                  <span className="text-emerald-400 font-bold">● Online</span>
                </div>
              </div>

              <button className="w-full mt-10 bg-white text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                Revoke Access
              </button>
            </div>
          </motion.div>

          {/* --- RIGHT: SYSTEM PERMISSIONS & LOGS --- */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Contact Information */}
            <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 md:p-10">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 mb-8 flex items-center gap-2">
                <Mail size={16} /> Official Contact
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <DetailItem label="Email" value={adminInfo.email} icon={<Mail />} />
                <DetailItem label="Secure Line" value={adminInfo.phone} icon={<Phone />} />
                <DetailItem label="Last Known IP" value={adminInfo.lastIp} icon={<Globe />} />
                <DetailItem label="Registry Date" value={adminInfo.joinedDate} icon={<UserCheck />} />
              </div>
            </section>

            {/* Permissions Grid */}
            <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 md:p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                  <Lock size={16} /> Privilege Level
                </h3>
                <Settings size={18} className="text-gray-600 cursor-pointer hover:text-primary transition-colors" />
              </div>
              <div className="flex flex-wrap gap-3">
                {adminInfo.permissions.map((perm, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-primary/5 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider rounded-xl flex items-center gap-2"
                  >
                    <ShieldCheck size={12} /> {perm}
                  </span>
                ))}
              </div>
            </section>

            {/* Danger Zone */}
            <section className="bg-red-500/5 border border-red-500/10 rounded-[2.5rem] p-8 flex items-center justify-between">
              <div>
                <h4 className="text-red-500 font-bold flex items-center gap-2">
                  <AlertTriangle size={18} /> Forced Termination
                </h4>
                <p className="text-xs text-gray-500 mt-1 font-medium">Instantly kill this admin's active session and lock account.</p>
              </div>
              <button className="px-6 py-3 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-colors">
                Action
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
  <div className="space-y-2">
    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1">{label}</p>
    <div className="flex items-center gap-3 p-4 bg-black/20 border border-white/5 rounded-2xl">
      <div className="text-primary/60">{React.cloneElement(icon, { size: 18 })}</div>
      <p className="text-sm font-bold text-gray-300">{value}</p>
    </div>
  </div>
);

export default AdminDetail;