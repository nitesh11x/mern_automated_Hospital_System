import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { motion } from "motion/react";
import { motion } from "framer-motion";
import {
  UserPlus,
  Mail,
  Lock,
  Phone,
  User,
  Camera,
  ShieldCheck,
  ChevronRight,
  Fingerprint
} from "lucide-react";
import {
  adminRegisterThunk,
  resetAdminState,
} from "../../redux/slices/admin.slice";
import { toast } from "react-hot-toast";

const AdminRegister = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.admin);

  const [profile, setProfile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const [formDataState, setFormDataState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormDataState({
      ...formDataState,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!profile) {
      toast.error("Security Clearance: Profile Image Required");
      return;
    }
    const formData = new FormData();
    formData.append("profile", profile);
    formData.append("firstName", formDataState.firstName);
    formData.append("lastName", formDataState.lastName);
    formData.append("email", formDataState.email);
    formData.append("phone", formDataState.phone);
    formData.append("password", formDataState.password);

    dispatch(adminRegisterThunk(formData));
  };

  useEffect(() => {
    if (success) {
      toast.success("Credential Node Initialized 🎉");
      setFormDataState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
      });
      setProfile(null);
      setProfilePreview(null);
      dispatch(resetAdminState());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAdminState());
    }
  }, [success, error, dispatch]);

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center px-6 py-20 relative overflow-hidden font-sans">

      {/* --- THEME GRADIENT BACKGROUND ELEMENTS --- */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="bg-white border border-slate-100 rounded-sm overflow-hidden shadow-2xl shadow-indigo-900/10">
          <div className="flex flex-col md:flex-row">

            {/* LEFT SIDE - Profile Upload (Indigo Structural) */}
            <div className="md:w-1/3 bg-slate-50 p-10 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="w-40 h-40 rounded-sm border border-indigo-100 flex items-center justify-center overflow-hidden bg-white shadow-inner group">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Admin"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-300">
                      <Fingerprint size={48} className="mb-2 group-hover:text-indigo-400 transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-tighter">Biometric Placeholder</span>
                    </div>
                  )}
                </div>

                <label className="absolute -bottom-2 -right-2 p-3 bg-purple-600 text-white rounded-sm cursor-pointer hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200">
                  <Camera size={18} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              </div>

              <h2 className="text-slate-900 font-black text-xl tracking-tight uppercase italic">
                System <span className="text-indigo-600">Admin</span>
              </h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Dossier Visual ID</p>
            </div>

            {/* RIGHT SIDE - Registration Form (Purple Hover Accents) */}
            <div className="md:w-2/3 p-8 lg:p-12 bg-white">
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-1.5 bg-linear-to-r from-indigo-600 to-purple-600 rounded-sm text-white">
                    <UserPlus size={18} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Node Initialization</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 uppercase italic">
                  Create <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">Identity</span>
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <AdminInput
                    label="Legal First Name"
                    name="firstName"
                    value={formDataState.firstName}
                    onChange={handleChange}
                    icon={<User size={16} />}
                    placeholder="Enter First Name"
                  />

                  <AdminInput
                    label="Legal Last Name"
                    name="lastName"
                    value={formDataState.lastName}
                    onChange={handleChange}
                    icon={<User size={16} />}
                    placeholder="Enter Last Name"
                  />
                </div>

                <AdminInput
                  label="Network Email"
                  name="email"
                  type="email"
                  value={formDataState.email}
                  onChange={handleChange}
                  icon={<Mail size={16} />}
                  placeholder="admin@hms-network.com"
                />

                <AdminInput
                  label="Contact Frequency"
                  name="phone"
                  type="tel"
                  value={formDataState.phone}
                  onChange={handleChange}
                  icon={<Phone size={16} />}
                  placeholder="+1 000 000 0000"
                />

                <AdminInput
                  label="Access Keyphrase"
                  name="password"
                  type="password"
                  value={formDataState.password}
                  onChange={handleChange}
                  icon={<Lock size={16} />}
                  placeholder="••••••••••••"
                />

                <div className="pt-4 space-y-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50/50 rounded-sm border border-indigo-100/50">
                    <ShieldCheck size={14} className="text-indigo-600" />
                    <span className="text-[9px] font-black text-indigo-700 uppercase tracking-widest">Protocol: Encrypted Peer-to-Peer Transit</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-sm font-black uppercase tracking-[0.3em] text-xs shadow-xl shadow-indigo-100 hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.99]"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Authorize Account Creation
                        <ChevronRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Styled Sub-components ---

const AdminInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  icon,
  placeholder
}) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600 transition-colors">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600 transition-all text-xs font-bold placeholder:text-slate-300 placeholder:font-normal uppercase"
      />
    </div>
  </div>
);

export default AdminRegister;