import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Stethoscope, User, Mail, Lock, Phone, Award,
  FileText, Globe, MapPin, DollarSign, Camera, ShieldCheck,
  Plus, ShieldAlert, ArrowRight, Activity, Sparkles,
  Heart, Star, TrendingUp, CheckCircle2
} from "lucide-react";
import { registerDoctorThunk } from "../../redux/slices/doctor.slice";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const DoctorRegister = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.doctor);
  const { isAdminAuthenticated } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "",
    phone: "", specialization: "", experience: "",
    consultationFees: "", bio: "", licenseNumber: "",
    location: "", languages: "",
  });

  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [activeSection, setActiveSection] = useState("personal");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (profile) {
      data.append("profile", profile);
    }

    const result = await dispatch(registerDoctorThunk(data));

    if (registerDoctorThunk.fulfilled.match(result)) {
      toast.success("Personnel Successfully Provisioned");
      setFormData({
        firstName: "", lastName: "", email: "", password: "",
        phone: "", specialization: "", experience: "",
        consultationFees: "", bio: "", licenseNumber: "",
        location: "", languages: "",
      });
      setProfile(null);
      setPreview(null);
    } else {
      toast.error(result.payload || "Authentication/Registration Failure");
    }
  };

  // Section navigation
  const sections = [
    { id: "personal", label: "Personal Data", icon: User },
    { id: "professional", label: "Credentials", icon: Award },
    { id: "security", label: "Security", icon: ShieldCheck },
  ];

  // --- UNAUTHORIZED TERMINAL VIEW ---
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/90 backdrop-blur-xl border border-indigo-100 p-12 rounded-2xl shadow-2xl text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 bg-linear-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg"
          >
            <ShieldAlert size={48} className="text-white" strokeWidth={2} />
          </motion.div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Access Denied</h2>
          <p className="text-sm text-slate-500 mb-8">
            Security Clearance Level 4 Required.<br />
            Only System Administrators may provision credentials.
          </p>
          <Link
            to="/admin/login"
            className="group relative inline-flex items-center justify-center gap-3 w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Authenticate Admin
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </motion.div>
      </div>
    );
  }

  // --- AUTHORIZED PROVISIONING VIEW ---
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-white pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header with Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-1 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full" />
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={12} />
              Administrative Terminal
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
            Provision
            <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block md:inline-block md:ml-4">
              Personnel
            </span>
          </h1>
          <p className="text-slate-500 mt-4 max-w-2xl">
            Register new medical staff members with secure credentials and professional details
          </p>
        </motion.div>

        {/* Section Tabs */}
        <div className="flex gap-2 mb-8 border-b border-indigo-100">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all relative ${activeSection === section.id
                ? "text-indigo-600"
                : "text-slate-400 hover:text-indigo-400"
                }`}
            >
              <section.icon size={16} />
              {section.label}
              {activeSection === section.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-indigo-600 to-purple-600"
                />
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Profile & Quick Stats */}
            <div className="space-y-6">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100"
              >
                <div className="relative group flex flex-col items-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-2xl bg-linear-to-br from-indigo-100 to-purple-100 border-2 border-dashed border-indigo-200 flex items-center justify-center overflow-hidden">
                      {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="text-indigo-300" size={40} />
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 p-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl cursor-pointer hover:shadow-lg transition-all">
                      <Plus size={16} />
                      <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                    </label>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mt-4">
                    Medical License Photo
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-indigo-100">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Status</span>
                      <span className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 size={12} />
                        Active Session
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Role</span>
                      <span className="font-semibold text-indigo-600">Doctor</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Security Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white"
              >
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck size={20} className="text-white/80" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Security Clearance</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 block mb-2">
                      Access Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="admin@hospital.com"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 outline-none focus:bg-white/20 focus:border-white/40 transition-all text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 block mb-2">
                      Terminal Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 outline-none focus:bg-white/20 focus:border-white/40 transition-all text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Data Section */}
              <AnimatePresence mode="wait">
                {activeSection === "personal" && (
                  <motion.div
                    key="personal"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-100"
                  >
                    <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <User size={18} className="text-indigo-600" />
                      Personal Identifier Registry
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        required
                      />
                      <Input
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        required
                      />
                      <Input
                        label="Phone Number"
                        name="phone"
                        icon={<Phone size={16} />}
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 234 567 8900"
                        required
                      />
                      <Input
                        label="Location"
                        name="location"
                        icon={<MapPin size={16} />}
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City, Hospital"
                        required
                      />
                    </div>
                  </motion.div>
                )}

                {/* Professional Credentials Section */}
                {activeSection === "professional" && (
                  <motion.div
                    key="professional"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-100"
                  >
                    <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Award size={18} className="text-indigo-600" />
                      Professional Credentials
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        label="Specialization"
                        name="specialization"
                        icon={<Stethoscope size={16} />}
                        value={formData.specialization}
                        onChange={handleInputChange}
                        placeholder="Cardiology"
                        required
                      />
                      <Input
                        label="Experience (Years)"
                        name="experience"
                        type="number"
                        icon={<TrendingUp size={16} />}
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="10"
                        required
                      />
                      <Input
                        label="License Number"
                        name="licenseNumber"
                        icon={<FileText size={16} />}
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        placeholder="MD-12345"
                        required
                      />
                      <Input
                        label="Consultation Fee"
                        name="consultationFees"
                        type="number"
                        icon={<DollarSign size={16} />}
                        value={formData.consultationFees}
                        onChange={handleInputChange}
                        placeholder="250"
                        required
                      />
                      <div className="md:col-span-2">
                        <Input
                          label="Languages (comma separated)"
                          name="languages"
                          icon={<Globe size={16} />}
                          value={formData.languages}
                          onChange={handleInputChange}
                          placeholder="English, Spanish, French"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 ml-1 block mb-2">
                          Biography & Expertise
                        </label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Enter medical history, board certifications, and areas of expertise..."
                          rows={4}
                          className="w-full p-4 bg-slate-50 border border-indigo-100 rounded-xl outline-none focus:bg-white focus:border-indigo-400 transition-all text-sm text-slate-700"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Security Summary Section */}
                {activeSection === "security" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-100"
                  >
                    <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-indigo-600" />
                      Security Summary
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-linear-to-r from-indigo-50 to-purple-50 p-4 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Mail size={16} className="text-indigo-600" />
                          <div>
                            <p className="text-xs text-slate-500">Registered Email</p>
                            <p className="font-semibold text-slate-900">{formData.email || "Not set"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-linear-to-r from-emerald-50 to-teal-50 p-4 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Heart size={16} className="text-emerald-600" />
                          <div>
                            <p className="text-xs text-slate-500">HIPAA Compliance</p>
                            <p className="font-semibold text-emerald-600">Ready for Provisioning</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-end pt-4"
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Star size={18} />
                        Authorize Provisioning
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 ml-1 block">
      {label}
    </label>
    <div className="relative group">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
          {icon}
        </div>
      )}
      <input
        className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-slate-50 border border-indigo-100 rounded-xl outline-none focus:bg-white focus:border-indigo-400 transition-all text-sm text-slate-900 placeholder:text-slate-400`}
        {...props}
      />
    </div>
  </div>
);

export default DoctorRegister;