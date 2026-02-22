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
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row">

            {/* LEFT SIDE */}
            <div className="md:w-1/3 bg-primary/10 p-10 border-r border-white/10 flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="w-28 h-28 rounded-3xl border-2 border-dashed border-primary/40 flex items-center justify-center overflow-hidden bg-black/40">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Admin"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={40} className="text-gray-600" />
                  )}
                </div>

                <label className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-xl cursor-pointer">
                  <Camera size={16} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              </div>

              <h2 className="text-white font-bold text-xl">
                Admin Profile
              </h2>
            </div>

            {/* RIGHT SIDE */}
            <div className="md:w-2/3 p-8 lg:p-12">
              <h3 className="text-2xl font-black text-white flex items-center gap-3 mb-8">
                <UserPlus className="text-primary" />
                Create Admin
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">

                <AdminInput
                  label="First Name"
                  name="firstName"
                  value={formDataState.firstName}
                  onChange={handleChange}
                  icon={<User size={16} />}
                />

                <AdminInput
                  label="Last Name"
                  name="lastName"
                  value={formDataState.lastName}
                  onChange={handleChange}
                  icon={<User size={16} />}
                />

                <AdminInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formDataState.email}
                  onChange={handleChange}
                  icon={<Mail size={16} />}
                />

                <AdminInput
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formDataState.phone}
                  onChange={handleChange}
                  icon={<Phone size={16} />}
                />

                <AdminInput
                  label="Password"
                  name="password"
                  type="password"
                  value={formDataState.password}
                  onChange={handleChange}
                  icon={<Lock size={16} />}
                />

                {error && (
                  <p className="text-red-500 text-sm text-center">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl flex items-center justify-center gap-2"
                >
                  {loading ? "Processing..." : "Initialize Account"}
                  <ShieldCheck size={18} />
                </button>

              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AdminInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  icon,
}) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full pl-12 pr-4 py-3.5 bg-black/30 border border-white/10 rounded-2xl text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm"
      />
    </div>
  </div>
);

export default AdminRegister;