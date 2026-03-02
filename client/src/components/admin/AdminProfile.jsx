import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Mail,
  Phone,
  Key,
  Terminal,
  Clock,
  Settings,
  Edit,
  Activity,
  Fingerprint,
  Database
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { adminProfileThunk } from "../../redux/slices/admin.slice";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400";

const AdminProfile = () => {
  const dispatch = useDispatch();

  const { profile, loading, error } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    dispatch(adminProfileThunk());
  }, [dispatch]);

  // 🔹 Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFF] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Dossier...</h2>
      </div>
    );
  }

  // 🔹 Error UI
  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center">
        <div className="p-6 bg-rose-50 border border-rose-100 rounded-sm">
          <h2 className="text-sm font-black text-rose-600 uppercase tracking-widest">{error}</h2>
        </div>
      </div>
    );
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    role,
    status,
    _id,
    profile: avatar
  } = profile || {};

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 pt-24 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto py-10">

        {/* ---------- HEADER / CREDENTIAL CARD ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-100 rounded-sm p-8 md:p-12 mb-8 shadow-xl shadow-indigo-900/5 relative overflow-hidden"
        >
          {/* Theme Accent Strip */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-indigo-600 to-purple-600" />

          <div className="flex flex-col md:flex-row items-center gap-10">

            {/* Avatar with Clinical Styling */}
            <div className="relative">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-sm border border-slate-100 p-1 flex items-center justify-center bg-slate-50 overflow-hidden shadow-inner">
                <img
                  src={avatar?.url || DEFAULT_IMAGE}
                  alt="Admin Credentials"
                  className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all"
                />
              </div>

              <div className="absolute -bottom-3 -right-3 bg-indigo-600 p-2.5 rounded-sm shadow-lg shadow-indigo-200">
                <ShieldCheck size={20} className="text-white" />
              </div>
            </div>

            {/* Identity Block */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900">
                  {firstName} <span className="text-indigo-600">{lastName}</span>
                </h1>

                <span className="w-fit mx-auto md:mx-0 px-4 py-1.5 bg-purple-50 text-purple-600 border border-purple-100 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm">
                  {role || "System Admin"}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <IdentityStat icon={<Key size={14} />} label="Access Level" value={role} />
                <IdentityStat icon={<Clock size={14} />} label="Registry Status" value={status} color="text-emerald-500" />
                <IdentityStat icon={<Fingerprint size={14} />} label="Node ID" value={_id?.slice(-8)} />
                <IdentityStat icon={<Activity size={14} />} label="Core Health" value="Stable" />
              </div>
            </div>

            <button className="bg-slate-900 text-white px-8 py-4 rounded-sm font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 active:scale-95">
              <Edit size={16} /> Update Bio-Data
            </button>

          </div>
        </motion.div>

        {/* ---------- INFORMATION GRID ---------- */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Detailed Specifications */}
          <div className="lg:col-span-2">
            <section className="bg-white border border-slate-100 rounded-sm p-10 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-10 flex items-center gap-3">
                <Settings size={18} />
                Contact Specifications
              </h3>

              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
                <AdminDetail label="Network Mail" value={email} icon={<Mail />} />
                <AdminDetail label="Secure Line" value={phone} icon={<Phone />} />
                <AdminDetail label="Validation Status" value={status} icon={<ShieldCheck />} />
                <AdminDetail label="Database ID" value={_id} icon={<Database />} />
              </div>
            </section>
          </div>

          {/* System Context Sidebar */}
          <aside className="space-y-6">
            <div className="bg-linear-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-sm p-8">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 mb-6 flex items-center gap-3">
                <Terminal size={18} />
                Technical Logs
              </h3>

              <div className="space-y-5">
                <LogItem label="Authority" value={role} />
                <LogItem label="Connectivity" value="Active Layer 7" />
                <LogItem label="Initialization" value={profile?.createdAt?.slice(0, 10)} />
                <div className="pt-4 mt-4 border-t border-indigo-100">
                  <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                    <Activity size={12} /> Live Telemetry
                  </div>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

// ---------- Helper Components (Themed) ----------

const IdentityStat = ({ icon, label, value, color = "text-slate-900" }) => (
  <div>
    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1.5 mb-2">
      <span className="text-purple-500">{icon}</span> {label}
    </p>
    <p className={`text-xs font-black uppercase italic ${color}`}>{value || "Pending..."}</p>
  </div>
);

const AdminDetail = ({ label, value, icon }) => (
  <div className="space-y-3 group">
    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
      {label}
    </p>
    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-sm group-hover:border-indigo-200 transition-colors">
      <div className="text-indigo-600">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <p className="text-[13px] font-bold text-slate-700 truncate">
        {value || "Not Configured"}
      </p>
    </div>
  </div>
);

const LogItem = ({ label, value }) => (
  <div className="flex justify-between items-center text-[11px]">
    <span className="font-black uppercase text-slate-400 tracking-tighter">{label}</span>
    <span className="font-bold text-indigo-900">{value}</span>
  </div>
);

export default AdminProfile;