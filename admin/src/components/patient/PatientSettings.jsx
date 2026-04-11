import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePatientProfileThunk, changePatientPasswordThunk } from "../../redux/slices/patient.slice";
import { User, Phone, Calendar, MapPin, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const PatientSettings = () => {
  const dispatch = useDispatch();
  const { patient, loading } = useSelector((state) => state.patient);

  const [profileData, setProfileData] = useState({
    firstName: "", lastName: "", phone: "", dob: "", address: "", gender: ""
  });
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: "", newPassword: "", confirmPassword: ""
  });

  useEffect(() => {
    if (patient) {
      setProfileData({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        phone: patient.phone || "",
        dob: patient.dob ? new Date(patient.dob).toISOString().split('T')[0] : "",
        address: patient.address || "",
        gender: patient.gender || ""
      });
    }
  }, [patient]);

  const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updatePatientProfileThunk(profileData)).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if(passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    try {
      await dispatch(changePatientPasswordThunk({ 
        oldPassword: passwordData.oldPassword, 
        newPassword: passwordData.newPassword 
      })).unwrap();
      toast.success("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err || "Failed to update password");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Profile Form */}
      <div className="bg-white rounded-sm border border-emerald-100 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-emerald-100 bg-linear-to-r from-emerald-50/30 to-white">
          <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
            <div className="w-1 h-5 bg-linear-to-b from-emerald-500 to-teal-500 rounded-full"></div>
            Personal Identity settings
          </h3>
          <p className="text-[9px] text-emerald-600 mt-1 uppercase tracking-widest">Manage your demographic data securely</p>
        </div>
        <form onSubmit={handleProfileSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
             <label className="text-[10px] font-black text-emerald-700 uppercase tracking-wider flex items-center gap-2"><User size={12}/> First Name</label>
             <input name="firstName" value={profileData.firstName} onChange={handleProfileChange} className="w-full px-4 py-3 border border-emerald-200 rounded-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-emerald-50/30" />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black text-emerald-700 uppercase tracking-wider flex items-center gap-2"><User size={12}/> Last Name</label>
             <input name="lastName" value={profileData.lastName} onChange={handleProfileChange} className="w-full px-4 py-3 border border-emerald-200 rounded-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-emerald-50/30" />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black text-emerald-700 uppercase tracking-wider flex items-center gap-2"><Phone size={12}/> Primary Phone</label>
             <input name="phone" value={profileData.phone} onChange={handleProfileChange} className="w-full px-4 py-3 border border-emerald-200 rounded-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-emerald-50/30" />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black text-emerald-700 uppercase tracking-wider flex items-center gap-2"><Calendar size={12}/> Date of Birth</label>
             <input type="date" name="dob" value={profileData.dob} onChange={handleProfileChange} className="w-full px-4 py-3 border border-emerald-200 rounded-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-emerald-50/30" />
          </div>
          <div className="space-y-2 md:col-span-2">
             <label className="text-[10px] font-black text-emerald-700 uppercase tracking-wider flex items-center gap-2"><MapPin size={12}/> Mailing Address</label>
             <input name="address" value={profileData.address} onChange={handleProfileChange} className="w-full px-4 py-3 border border-emerald-200 rounded-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-emerald-50/30" placeholder="123 Example Street, City"/>
          </div>
          <div className="md:col-span-2 text-right">
             <button disabled={loading} type="submit" className="bg-linear-to-r from-emerald-500 to-teal-600 text-white font-black px-8 py-3 rounded-sm hover:shadow-lg transition-all uppercase text-[10px] tracking-wider disabled:opacity-50">
               {loading ? "Syncing..." : "Update Demographics"}
             </button>
          </div>
        </form>
      </div>

      {/* Security Form */}
      <div className="bg-white rounded-sm border border-emerald-100 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-emerald-100 bg-linear-to-r from-rose-50/30 to-white">
           <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
            <div className="w-1 h-5 bg-linear-to-b from-rose-500 to-red-500 rounded-full"></div>
            Biometric Security & Authentication
          </h3>
        </div>
        <form onSubmit={handlePasswordSubmit} className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-2"><Lock size={12}/> Current Password</label>
             <input type="password" required name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} className="w-full px-4 py-3 border border-dashed border-rose-200 rounded-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none bg-rose-50/30" />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-2"><Lock size={12}/> New Password</label>
             <input type="password" required name="newPassword" minLength="6" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full px-4 py-3 border border-dashed border-rose-200 rounded-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none bg-rose-50/30" />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-2"><CheckCircle2 size={12}/> Confirm New Password</label>
             <input type="password" required name="confirmPassword" minLength="6" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full px-4 py-3 border border-dashed border-rose-200 rounded-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none bg-rose-50/30" />
          </div>
          <div className="md:col-span-3 text-right">
             <button disabled={loading} type="submit" className="bg-rose-500 text-white font-black px-8 py-3 rounded-sm hover:shadow-lg hover:bg-rose-600 transition-all uppercase text-[10px] tracking-wider disabled:opacity-50">
               {loading ? "Encrypting..." : "Enforce New Security Key"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientSettings;
