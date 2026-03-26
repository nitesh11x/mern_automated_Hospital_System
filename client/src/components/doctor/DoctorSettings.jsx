import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateDoctorProfileThunk } from "../../redux/slices/doctor.slice";
import { User, Phone, Briefcase, IndianRupee, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const DoctorSettings = () => {
  const dispatch = useDispatch();
  const { doctor, loading } = useSelector((state) => state.doctor);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    specialization: "",
    consultationFees: "",
    workingHours: {
      morning: { start: "", end: "" },
      evening: { start: "", end: "" }
    }
  });

  useEffect(() => {
    if (doctor) {
      setFormData({
        firstName: doctor.firstName || "",
        lastName: doctor.lastName || "",
        phone: doctor.phone || "",
        specialization: doctor.specialization || "",
        consultationFees: doctor.consultationFees || "",
        workingHours: {
          morning: { 
            start: doctor.workingHours?.morning?.start || "", 
            end: doctor.workingHours?.morning?.end || "" 
          },
          evening: { 
            start: doctor.workingHours?.evening?.start || "", 
            end: doctor.workingHours?.evening?.end || "" 
          }
        }
      });
    }
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [shift, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          [shift]: { ...prev.workingHours[shift], [field]: value }
        }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateDoctorProfileThunk(formData)).unwrap();
      toast.success("Profile and Schedule updated successfully");
    } catch (error) {
      toast.error(error || "Failed to update settings");
    }
  };

  return (
    <div className="bg-white rounded-sm border border-purple-100 shadow-xl overflow-hidden max-w-4xl mx-auto">
      <div className="p-6 border-b border-purple-100 bg-linear-to-r from-purple-50/30 to-white">
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
          <div className="w-1 h-5 bg-linear-to-b from-purple-600 to-violet-600 rounded-full"></div>
          Practice Details & Schedule
        </h3>
        <p className="text-[9px] text-purple-500 mt-1 uppercase tracking-widest">Update your professional profile and availability grid</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-purple-600 uppercase tracking-wider flex items-center gap-2">
              <User size={12} /> First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-purple-200 rounded-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-purple-50/30"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-purple-600 uppercase tracking-wider flex items-center gap-2">
              <User size={12} /> Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-purple-200 rounded-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-purple-50/30"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-purple-600 uppercase tracking-wider flex items-center gap-2">
              <Phone size={12} /> Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-purple-200 rounded-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-purple-50/30"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-purple-600 uppercase tracking-wider flex items-center gap-2">
              <IndianRupee size={12} /> Consultation Fee
            </label>
            <input
              type="number"
              name="consultationFees"
              value={formData.consultationFees}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-purple-200 rounded-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-purple-50/30"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-purple-50">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Clock className="text-purple-500" size={16} /> Time Availability (24H Format: HH:MM)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-purple-50/30 p-5 rounded-sm border border-purple-100 border-dashed">
              <h5 className="text-[10px] font-black text-purple-700 uppercase tracking-widest mb-4">Morning Shift</h5>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[8px] font-bold text-slate-500 uppercase block mb-1">Start Time</label>
                  <input
                    type="time"
                    name="morning.start"
                    value={formData.workingHours.morning.start}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-purple-200 rounded-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[8px] font-bold text-slate-500 uppercase block mb-1">End Time</label>
                  <input
                    type="time"
                    name="morning.end"
                    value={formData.workingHours.morning.end}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-purple-200 rounded-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-indigo-50/30 p-5 rounded-sm border border-indigo-100 border-dashed">
              <h5 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-4">Evening Shift</h5>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[8px] font-bold text-slate-500 uppercase block mb-1">Start Time</label>
                  <input
                    type="time"
                    name="evening.start"
                    value={formData.workingHours.evening.start}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-indigo-200 rounded-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[8px] font-bold text-slate-500 uppercase block mb-1">End Time</label>
                  <input
                    type="time"
                    name="evening.end"
                    value={formData.workingHours.evening.end}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-indigo-200 rounded-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-linear-to-r from-purple-600 to-violet-600 text-white font-black py-4 rounded-sm hover:shadow-lg transition-all uppercase text-xs tracking-wider disabled:opacity-50"
        >
          {loading ? "Saving Changes..." : "Authorize & Update Details"}
        </button>
      </form>
    </div>
  );
};

export default DoctorSettings;
