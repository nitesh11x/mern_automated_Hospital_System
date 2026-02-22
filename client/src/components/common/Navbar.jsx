import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight, UserCog, LogOut, LayoutDashboard, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

// Ensure these thunks are imported correctly
import { adminLogoutThunk } from "../../redux/slices/admin.slice";
// import { patientLogoutThunk } from "../../redux/slices/patient.slice";
// import { doctorLogoutThunk } from "../../redux/slices/doctor.slice";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isPatientAuthenticated } = useSelector(state => state.patient);
    const { isAdminAuthenticated } = useSelector(state => state.admin);
    const { isDoctorAuthenticated } = useSelector(state => state.doctor);

    const isAnyAuth = isPatientAuthenticated || isAdminAuthenticated || isDoctorAuthenticated;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async (role) => {
        try {
            if (role === 'admin') {
                await dispatch(adminLogoutThunk()).unwrap();
                toast.success("Admin Logged Out");
            } else if (role === 'doctor') {
                // await dispatch(doctorLogoutThunk()).unwrap();
                toast.success("Doctor Logged Out");
            } else {
                // await dispatch(patientLogoutThunk()).unwrap();
                toast.success("Patient Logged Out");
            }

            // FORCE CLEARANCE: Ensure the UI resets even if the cookie is sticky
            setIsOpen(false);
            navigate("/");
        } catch (error) {
            toast.error(error || "Logout Failed");
            // Fallback: If the server call fails, we still want to clear the frontend
            navigate("/management");
        }
    };

    const navLinks = [
        { name: "Home", to: "/" },
        { name: "About", to: "/about" },
        { name: "Doctors", to: "/doctor/all" },
        { name: "Contact", to: "/contact" },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

                {/* Logo */}
                <Link to='/' className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
                        N
                    </div>
                    <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                        New<span className="text-primary">Care</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-8">
                    <div className="flex space-x-6">
                        {navLinks.map((link) => (
                            <Link key={link.name} to={link.to} className="relative text-sm font-semibold text-gray-600 hover:text-primary transition-colors group">
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
                        {!isAnyAuth ? (
                            <>
                                <Link to='/patient/login' className="text-sm font-bold text-gray-700 hover:text-primary transition flex items-center gap-1">
                                    <User size={16} /> Login
                                </Link>
                                <Link to='/management' className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-primary transition px-3 py-2 bg-gray-100 rounded-lg">
                                    <UserCog size={16} /> Management
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to={isAdminAuthenticated ? "/admin/dashboard" : isDoctorAuthenticated ? "/doctor/dashboard" : "/patient/dashboard"}
                                    className="text-sm font-bold text-gray-700 hover:text-primary flex items-center gap-1.5"
                                >
                                    <LayoutDashboard size={16} /> Dashboard
                                </Link>

                                <button
                                    onClick={() => handleLogout(isAdminAuthenticated ? 'admin' : isDoctorAuthenticated ? 'doctor' : 'patient')}
                                    className="flex items-center gap-1.5 text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        )}

                        <Link to='/appointment/new' className="group flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-primary-dark transition shadow-lg shadow-primary/25">
                            Book Now
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link key={link.name} to={link.to} className="text-lg font-bold text-gray-800" onClick={() => setIsOpen(false)}>
                                    {link.name}
                                </Link>
                            ))}
                            <hr />
                            {!isAnyAuth ? (
                                <>
                                    <Link to='/patient/login' className="text-lg font-bold text-gray-800" onClick={() => setIsOpen(false)}>Patient Login</Link>
                                    <Link to='/login-dashboard' className="text-lg font-bold text-primary" onClick={() => setIsOpen(false)}>Management Portal</Link>
                                </>
                            ) : (
                                <button
                                    onClick={() => handleLogout(isAdminAuthenticated ? 'admin' : isDoctorAuthenticated ? 'doctor' : 'patient')}
                                    className="text-left text-lg font-bold text-red-500"
                                >
                                    Logout Account
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;