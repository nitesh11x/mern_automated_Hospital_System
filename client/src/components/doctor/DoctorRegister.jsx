import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Stethoscope, User, Mail, Lock, Phone, Award,
  FileText, Globe, MapPin, DollarSign, Camera, ShieldCheck, Plus, ShieldAlert, ArrowRight
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
      toast.success("Doctor Registered Successfully!");
      setFormData({
        firstName: "", lastName: "", email: "", password: "",
        phone: "", specialization: "", experience: "",
        consultationFees: "", bio: "", licenseNumber: "",
        location: "", languages: "",
      });
      setProfile(null);
      setPreview(null);
    } else {
      toast.error(result.payload || "Registration Failed");
    }
  };

  // --- PROTECTED ACCESS VIEW ---
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-slate-100 p-10 rounded-[3rem] text-center shadow-xl shadow-slate-200/50">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Unauthorized</h2>
          <p className="text-slate-500 mb-8 font-medium">Only system administrators can register new medical personnel.</p>
          <Link
            to="/admin/login"
            className="flex items-center justify-center gap-2 w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            Admin Login <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  // --- AUTHORIZED REGISTRATION VIEW ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-2xl mb-4">
            <Stethoscope size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Doctor <span className="text-primary">Registration</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium italic">Provisioning new medical staff credentials.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* PROFILE IMAGE SECTION */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="text-slate-300" size={32} />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-xl cursor-pointer hover:scale-110 transition-transform shadow-lg">
                <Plus size={18} />
                <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
              </label>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-4">Professional Photo</p>
          </div>

          {/* BASIC INFORMATION SECTION */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <User size={20} className="text-primary" /> Basic Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Input label="First Name" name="firstName" icon={<User size={18} />} value={formData.firstName} onChange={handleInputChange} placeholder="John" />
              <Input label="Last Name" name="lastName" icon={<User size={18} />} value={formData.lastName} onChange={handleInputChange} placeholder="Smith" />
              <Input label="Email" name="email" type="email" icon={<Mail size={18} />} value={formData.email} onChange={handleInputChange} placeholder="dr.smith@newcare.com" />
              <Input label="Password" name="password" type="password" icon={<Lock size={18} />} value={formData.password} onChange={handleInputChange} placeholder="••••••••" />
              <Input label="Phone" name="phone" icon={<Phone size={18} />} value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 000-0000" />
              <Input label="Location" name="location" icon={<MapPin size={18} />} value={formData.location} onChange={handleInputChange} placeholder="New York, USA" />
            </div>
          </div>

          {/* PROFESSIONAL DETAILS SECTION */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <Award size={20} className="text-primary" /> Professional Details
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Input label="Specialization" name="specialization" icon={<Stethoscope size={18} />} value={formData.specialization} onChange={handleInputChange} placeholder="Cardiology" />
              <Input label="Experience (Years)" name="experience" type="number" icon={<Award size={18} />} value={formData.experience} onChange={handleInputChange} placeholder="10" />
              <Input label="License Number" name="licenseNumber" icon={<FileText size={18} />} value={formData.licenseNumber} onChange={handleInputChange} placeholder="LIC-992034" />
              <Input label="Consultation Fees" name="consultationFees" type="number" icon={<DollarSign size={18} />} value={formData.consultationFees} onChange={handleInputChange} placeholder="150" />
              <div className="md:col-span-2">
                <Input label="Languages (Comma separated)" name="languages" icon={<Globe size={18} />} value={formData.languages} onChange={handleInputChange} placeholder="English, Spanish" />
              </div>
            </div>

            <div className="mt-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Professional Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Medical background and expertise..."
                className="w-full mt-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all min-h-[120px] text-sm text-slate-700"
              />
            </div>
          </div>

          {/* SUBMIT SECTION */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 text-emerald-600">
              <ShieldCheck size={18} />
              <p className="text-[10px] font-black uppercase tracking-widest text-center">System Logged HIPAA-Ready Registration</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-80 bg-primary text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all disabled:bg-slate-300 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Register Doctor"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
        {icon}
      </div>
      <input
        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm text-slate-700 placeholder:text-slate-300"
        {...props}
      />
    </div>
  </div>
);

export default DoctorRegister;