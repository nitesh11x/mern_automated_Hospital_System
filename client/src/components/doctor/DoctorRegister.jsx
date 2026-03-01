import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Stethoscope, User, Mail, Lock, Phone, Award,
  FileText, Globe, MapPin, DollarSign, Camera, ShieldCheck, Plus, ShieldAlert, ArrowRight, Activity
} from "lucide-react";
import { registerDoctorThunk } from "../../redux/slices/doctor.slice";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

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

  // --- UNAUTHORIZED TERMINAL VIEW ---
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FBFBFF] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white border border-slate-200 p-12 rounded-sm text-center shadow-sm">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-sm flex items-center justify-center mx-auto mb-8 border border-red-100">
            <ShieldAlert size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Access Denied</h2>
          <p className="text-[10px] text-slate-400 mb-10 font-black uppercase tracking-widest leading-loose">
            Security Clearance Level 4 Required.<br />Only System Administrators may provision credentials.
          </p>
          <Link
            to="/admin/login"
            className="flex items-center justify-center gap-3 w-full bg-slate-900 text-white py-5 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-900/10"
          >
            Authenticate Admin <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // --- AUTHORIZED PROVISIONING VIEW ---
  return (
    <div className="min-h-screen bg-[#FBFBFF] pt-32 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* Header Protocol */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-1 bg-indigo-600 rounded-sm" />
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Administrative Terminal</p>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
            Provision <span className="text-indigo-600">Personnel</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left Column: Media & Core Auth */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-10 rounded-sm border border-slate-200 shadow-sm flex flex-col items-center">
              <div className="relative group">
                <div className="w-40 h-40 rounded-sm bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-600/50">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover grayscale-[0.2]" />
                  ) : (
                    <Camera className="text-slate-300" size={40} />
                  )}
                </div>
                <label className="absolute -bottom-3 -right-3 p-3 bg-indigo-600 text-white rounded-sm cursor-pointer hover:bg-slate-900 transition-all shadow-lg">
                  <Plus size={20} />
                  <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                </label>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-8">Identify Bio-Metric Image</p>
            </div>

            <div className="bg-slate-900 p-8 rounded-sm text-white border border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <Activity size={18} className="text-indigo-400" />
                <h3 className="text-[11px] font-black uppercase tracking-widest text-indigo-400">Security Clearance</h3>
              </div>
              <Input dark label="Access Email" name="email" type="email" icon={<Mail size={16} />} value={formData.email} onChange={handleInputChange} placeholder="ID@SYSTEM.COM" />
              <div className="mt-4">
                <Input dark label="Terminal Password" name="password" type="password" icon={<Lock size={16} />} value={formData.password} onChange={handleInputChange} placeholder="••••••••" />
              </div>
            </div>
          </div>

          {/* Right Column: Personnel Data */}
          <div className="lg:col-span-8 space-y-8">
            {/* PERSONAL DATA GRID */}
            <div className="bg-white p-10 rounded-sm border border-slate-200 shadow-sm">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-10 pb-4 border-b border-slate-100 flex items-center gap-3">
                <User size={18} className="text-indigo-600" /> Personal Identifier Registry
              </h3>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
                <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="JOHN" />
                <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="DOE" />
                <Input label="Primary Phone" name="phone" icon={<Phone size={16} />} value={formData.phone} onChange={handleInputChange} placeholder="+1.000.000.0000" />
                <Input label="Duty Station" name="location" icon={<MapPin size={16} />} value={formData.location} onChange={handleInputChange} placeholder="HQ - NEW YORK" />
              </div>
            </div>

            {/* MEDICAL DATA GRID */}
            <div className="bg-white p-10 rounded-sm border border-slate-200 shadow-sm">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-10 pb-4 border-b border-slate-100 flex items-center gap-3">
                <Award size={18} className="text-indigo-600" /> Professional Credentials
              </h3>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
                <Input label="Specialization" name="specialization" icon={<Stethoscope size={16} />} value={formData.specialization} onChange={handleInputChange} placeholder="CARDIOLOGY" />
                <Input label="Service Years" name="experience" type="number" icon={<Award size={16} />} value={formData.experience} onChange={handleInputChange} placeholder="10" />
                <Input label="License ID" name="licenseNumber" icon={<FileText size={16} />} value={formData.licenseNumber} onChange={handleInputChange} placeholder="MD-882-991" />
                <Input label="Consult Fee (USD)" name="consultationFees" type="number" icon={<DollarSign size={16} />} value={formData.consultationFees} onChange={handleInputChange} placeholder="250" />
              </div>

              <div className="mt-10">
                <Input label="Linguistic Skills (Comma Sep)" name="languages" icon={<Globe size={16} />} value={formData.languages} onChange={handleInputChange} placeholder="ENGLISH, SPANISH, FRENCH" />
              </div>

              <div className="mt-10">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Personnel Biography / Expertise</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="ENTER MEDICAL HISTORY AND BOARD CERTIFICATIONS..."
                  className="w-full mt-3 p-5 bg-slate-50 border border-slate-100 rounded-sm outline-none focus:bg-white focus:border-indigo-600 transition-all min-h-35 text-[11px] font-bold text-slate-700 uppercase tracking-wider"
                />
              </div>
            </div>

            {/* FINAL AUTHENTICATION */}
            <div className="flex flex-col items-end gap-6">
              <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50/50 px-6 py-3 border border-emerald-100 rounded-sm">
                <ShieldCheck size={16} strokeWidth={3} />
                <p className="text-[9px] font-black uppercase tracking-[0.2em]">Validated HIPAA-Ready Entry</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-80 bg-indigo-600 text-white py-6 rounded-sm font-black uppercase tracking-[0.3em] text-[12px] shadow-xl shadow-indigo-900/20 hover:bg-slate-900 transition-all disabled:bg-slate-300 flex items-center justify-center gap-4 group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Authorize Provisioning <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, icon, dark, ...props }) => (
  <div className="space-y-3">
    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${dark ? 'text-indigo-400' : 'text-slate-400'}`}>
      {label}
    </label>
    <div className="relative group">
      {icon && (
        <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${dark ? 'text-indigo-800 group-focus-within:text-indigo-400' : 'text-slate-300 group-focus-within:text-indigo-600'}`}>
          {icon}
        </div>
      )}
      <input
        className={`w-full ${icon ? 'pl-14' : 'pl-5'} pr-5 py-4 rounded-sm outline-none transition-all text-[11px] font-black uppercase tracking-widest placeholder:opacity-50
            ${dark
            ? 'bg-slate-800 border border-slate-700 text-white focus:bg-slate-950 focus:border-indigo-500'
            : 'bg-slate-50 border border-slate-100 text-slate-900 focus:bg-white focus:border-indigo-600'}`}
        {...props}
      />
    </div>
  </div>
);

export default DoctorRegister;