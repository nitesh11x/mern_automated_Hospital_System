import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  UserPlus,
  Mail,
  Lock,
  Phone,
  User,
  Camera,
  ShieldCheck,
  Plus
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
      toast.error("Please upload profile image");
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
      toast.success("Admin registered successfully 🎉");
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
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      
      {/* Decorative background blurs */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-blue-400/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/60">
          <div className="flex flex-col md:flex-row">

            {/* LEFT SIDE - Profile Section */}
            <div className="md:w-1/3 bg-slate-50 p-10 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-white shadow-inner">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Admin"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-slate-300" />
                  )}
                </div>

                <label className="absolute -bottom-2 -right-2 p-2.5 bg-primary text-white rounded-2xl cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-primary/30">
                  <Camera size={18} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              </div>

              <h2 className="text-slate-900 font-black text-xl tracking-tight">
                Admin <span className="text-primary">Profile</span>
              </h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Identification Image</p>
            </div>

            {/* RIGHT SIDE - Form Section */}
            <div className="md:w-2/3 p-8 lg:p-12 bg-white">
              <div className="mb-10">
                <h3 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <UserPlus className="text-primary" size={24} />
                  </div>
                  New Administrator
                </h3>
                <p className="text-slate-500 text-sm mt-2 font-medium">Initialize a high-level system control account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <AdminInput
                    label="First Name"
                    name="firstName"
                    value={formDataState.firstName}
                    onChange={handleChange}
                    icon={<User size={16} />}
                    placeholder="John"
                  />

                  <AdminInput
                    label="Last Name"
                    name="lastName"
                    value={formDataState.lastName}
                    onChange={handleChange}
                    icon={<User size={16} />}
                    placeholder="Doe"
                  />
                </div>

                <AdminInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formDataState.email}
                  onChange={handleChange}
                  icon={<Mail size={16} />}
                  placeholder="admin@newcare.com"
                />

                <AdminInput
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formDataState.phone}
                  onChange={handleChange}
                  icon={<Phone size={16} />}
                  placeholder="+1 (555) 000-0000"
                />

                <AdminInput
                  label="Security Password"
                  name="password"
                  type="password"
                  value={formDataState.password}
                  onChange={handleChange}
                  icon={<Lock size={16} />}
                  placeholder="••••••••••••"
                />

                <div className="pt-4 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Encrypted Auth Protocol</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/25 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:shadow-none"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Complete Registration
                        <ArrowRightIcon size={18} />
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

// --- Sub-components ---

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
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm placeholder:text-slate-300"
      />
    </div>
  </div>
);

const ArrowRightIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

export default AdminRegister;