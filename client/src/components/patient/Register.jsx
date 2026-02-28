import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPatientThunk,
  patientRegisterThunk,
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

  const { loading, error, patients } = useSelector(
    (state) => state.patient
  );
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
  useEffect(() => {
    if (!isOtpVerified) {
      navigate("/login");
    }
  }, [isOtpVerified, navigate]);

  useEffect(() => {
    dispatch(getAllPatientThunk());
  }, [dispatch]);

  // 🔹 Generate next patientId automatically
  useEffect(() => {
    if (patients && patients.length > 0) {
      const numbers = patients.map((p) => {
        const match = p.patientId?.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      });

      const maxNumber = Math.max(...numbers);
      const nextId = `new${maxNumber + 1}`;

      setFormData((prev) => ({
        ...prev,
        patientId: nextId,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        patientId: "new01",
      }));
    }
  }, [patients]);

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
        })
      ).unwrap();

      toast.success("Account created successfully 🎉");

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-xl overflow-hidden border"
      >
        <div className="flex flex-col md:flex-row">
          {/* LEFT SIDE */}
          <div className="md:w-1/3 bg-primary p-12 text-white flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold mb-6">Join NewCare</h2>

            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-white/40" />
                )}
              </div>

              <label className="absolute bottom-0 right-0 bg-white text-primary p-2 rounded-full cursor-pointer shadow-lg">
                <Camera size={18} />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="md:w-2/3 p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border rounded-2xl"
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
                <p className="text-red-500 text-sm font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                {loading ? "Creating..." : "Create Account"}
                <ArrowRight size={20} />
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
  <div className="space-y-2">
    <label className="text-sm font-bold text-gray-700 ml-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        className="w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-2xl"
      />
    </div>
  </div>
);

export default Register;