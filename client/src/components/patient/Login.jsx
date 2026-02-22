import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { patientLoginThunk } from "../../redux/slices/patient.slice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, isPatientAuthenticated } = useSelector(
        (state) => state.patient
    );
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    /* Redirect after login */
    useEffect(() => {
        if (isPatientAuthenticated) {
            navigate("/patient/dashboard", { replace: true });
        }
    }, [isPatientAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error("All fields are required");
            return;
        }
        try {
            await dispatch(patientLoginThunk(formData)).unwrap();
            toast.success("Login successful 🎉");
        } catch (err) {
            toast.error(err || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-stretch bg-white">
            {/* LEFT SIDE */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex w-1/2 bg-primary relative items-center justify-center p-12 overflow-hidden"
            >
                <div className="relative z-10 max-w-md text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Welcome Back to <br /> NewCare Portal
                    </h2>
                    <p className="text-white/80 text-lg">
                        Securely access your health records anytime.
                    </p>
                </div>
            </motion.div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div>
                        <h3 className="text-3xl font-extrabold text-gray-900">
                            Sign In
                        </h3>
                        <p className="text-gray-500 mt-2">
                            Don't have an account?
                            <Link
                                to="/login"
                                className="text-primary font-bold ml-1 hover:underline"
                            >
                                Create one
                            </Link>
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@company.com"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm font-medium">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-400 px-8">
                        By signing in, you agree to our Terms and Privacy Policy.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;