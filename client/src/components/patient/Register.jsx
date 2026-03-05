import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  patientRegisterThunk,
  getNextPatientIdThunk,
} from "../../redux/slices/patient.slice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  IdCard,
  Camera,
  ArrowRight,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // now includes patientId from slice
  const { loading, error, patientId } = useSelector((state) => state.patient);
  const { isOtpVerified } = useSelector((state) => state.otp);

  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);

  const [formData, setFormData] = useState({
    patientId: "",
    firstName: "",
    lastName: "",
    email: localStorage.getItem("patientEmail") || "",
    password: "",
    phone: "",
    dob: "",
    gender: "",
  });

  // OTP verification check — keep same behavior as before
  useEffect(() => {
    if (!isOtpVerified) {
      navigate("/otp-form");
    }
  }, [isOtpVerified, navigate]);

  // fetch next patient id via redux thunk (no axios in component)
  useEffect(() => {
    dispatch(getNextPatientIdThunk());
  }, [dispatch]);

  // when patientId arrives in redux, set it to form
  useEffect(() => {
    if (patientId) {
      setFormData((prev) => ({
        ...prev,
        patientId,
      }));
    }
  }, [patientId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
      setProfileFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        patientRegisterThunk({
          ...formData,
          profile: profileFile,
        }),
      ).unwrap();

      toast.success("Account created successfully 🎉");

      // reset local form state (keeps design and previous behavior)
      setFormData({
        patientId: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        dob: "",
        gender: "",
      });

      setProfileFile(null);
      setProfilePreview(null);

      navigate("/patient/login");
    } catch (err) {
      toast.error(err || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto bg-white rounded-sm shadow-2xl overflow-hidden border border-gray-100"
      >
        <div className="flex flex-col md:flex-row">
          {/* LEFT SIDE: Branding & Profile */}
          <div className="md:w-1/3 bg-indigo-700 p-12 text-white flex flex-col items-center text-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-500 to-indigo-500"></div>

            <h2 className="text-3xl font-black mb-12 uppercase tracking-tighter">
              Join <br /> NewCare
            </h2>

            <div className="relative group">
              <div className="w-40 h-40 rounded-sm border-2 border-white/30 overflow-hidden bg-white/10 flex items-center justify-center backdrop-blur-sm transition-all group-hover:border-purple-400">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={64} className="text-white/20" />
                )}
              </div>

              <label className="absolute -bottom-4 -right-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-sm cursor-pointer shadow-xl transition-all border border-white/20">
                <Camera size={20} />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
            </div>

            <p className="mt-12 text-indigo-100/60 text-xs font-bold uppercase tracking-widest leading-loose">
              Complete your profile to <br /> access personalized care
            </p>
          </div>

          {/* RIGHT SIDE: Form */}
          <div className="md:w-2/3 p-8 lg:p-14">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <InputField
                  label="Patient ID"
                  name="patientId"
                  value={formData.patientId}
                  readOnly
                  icon={<IdCard size={18} />}
                />

                <InputField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  icon={<User size={18} />}
                />

                <InputField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  icon={<User size={18} />}
                />

                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  readOnly
                  icon={<Mail size={18} />}
                />

                <InputField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  icon={<Phone size={18} />}
                />

                <InputField
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  icon={<Calendar size={18} />}
                />

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-indigo-700 ml-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-purple-600 outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    icon={<Lock size={18} />}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-600 text-xs font-bold uppercase">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-sm font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-lg shadow-indigo-100 transition-all disabled:opacity-70 group"
              >
                {loading ? "Creating..." : "Complete Registration"}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  icon,
  readOnly,
}) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-700 ml-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        className={`w-full pl-12 pr-4 py-3 border rounded-sm outline-none transition-all text-sm font-medium
          ${
            readOnly
              ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gray-50 border-gray-200 focus:border-purple-600 focus:bg-white"
          }`}
      />
    </div>
  </div>
);

export default Register;
