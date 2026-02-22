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
  Activity
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
      <div className="min-h-screen bg-[#0A0F1E] text-white flex items-center justify-center">
        <h2 className="text-xl font-bold">Loading Profile...</h2>
      </div>
    );
  }

  // 🔹 Error UI
  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] text-red-500 flex items-center justify-center">
        <h2 className="text-xl font-bold">{error}</h2>
      </div>
    );
  }

  // 🔹 Safe destructuring
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
    <div className="min-h-screen bg-[#0A0F1E] text-white pt-16 pb-20 px-6">
      <div className="max-w-6xl mx-auto py-10">

        {/* ---------- HEADER ---------- */}
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
                  src={avatar?.url || DEFAULT_IMAGE}
                  alt="Admin"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute -bottom-3 -right-3 bg-primary p-2 rounded-xl border-4 border-[#0A0F1E]">
                <ShieldCheck size={20} className="text-white" />
              </div>
            </div>

            {/* Identity */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-4xl font-black tracking-tight">
                  {firstName} {lastName}
                </h1>

                <span className="w-fit mx-auto md:mx-0 px-3 py-1 bg-primary/20 text-primary border border-primary/30 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">
                  {role}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-400">
                <IdentityStat icon={<Key size={14} />} label="Role" value={role} />
                <IdentityStat icon={<Clock size={14} />} label="Status" value={status} />
                <IdentityStat icon={<Terminal size={14} />} label="Admin ID" value={_id} />
                <IdentityStat icon={<Activity size={14} />} label="System" value="Online" />
              </div>
            </div>

            <button className="bg-white text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary hover:text-white transition-all">
              <Edit size={18} /> Edit Profile
            </button>

          </div>
        </motion.div>

        {/* ---------- DETAILS SECTION ---------- */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left */}
          <div className="lg:col-span-2">
            <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
              <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                <Settings size={20} className="text-primary" />
                Admin Details
              </h3>

              <div className="grid sm:grid-cols-2 gap-8">
                <AdminDetail label="Email Address" value={email} icon={<Mail />} />
                <AdminDetail label="Contact Number" value={phone} icon={<Phone />} />
                <AdminDetail label="Account Status" value={status} icon={<ShieldCheck />} />
                <AdminDetail label="Admin ID" value={_id} icon={<Terminal />} />
              </div>
            </section>
          </div>

          {/* Right */}
          <aside>
            <div className="bg-primary/10 border border-primary/20 rounded-[2.5rem] p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Terminal size={20} className="text-primary" />
                System Info
              </h3>

              <div className="space-y-4 text-sm text-gray-300">
                <p><strong>Role:</strong> {role}</p>
                <p><strong>Status:</strong> {status}</p>
                <p><strong>Registered:</strong> {profile?.createdAt?.slice(0, 10)}</p>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

// ---------- Helper Components ----------

const IdentityStat = ({ icon, label, value }) => (
  <div>
    <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-1 mb-1">
      {icon} {label}
    </p>
    <p className="text-xs font-bold text-white">{value || "N/A"}</p>
  </div>
);

const AdminDetail = ({ label, value, icon }) => (
  <div className="space-y-2">
    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
      {label}
    </p>
    <div className="flex items-center gap-3 p-4 bg-black/20 border border-white/5 rounded-2xl">
      <div className="text-primary">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <p className="text-sm font-bold text-gray-300">
        {value || "N/A"}
      </p>
    </div>
  </div>
);

export default AdminProfile;