import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight, UserCog, LogOut, LayoutDashboard, User, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { adminLogoutThunk } from "../../redux/slices/admin.slice";
import { doctorLogoutThunk } from "../../redux/slices/doctor.slice";

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
                await dispatch(doctorLogoutThunk()).unwrap();
                toast.success("Doctor Logged Out");
            } else {
                toast.success("Patient Logged Out");
            }

            setIsOpen(false);
            navigate("/");
        } catch (error) {
            toast.error(error || "Logout Failed");
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
        <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled
                ? "bg-white border-b border-slate-200 py-3 shadow-sm"
                : "bg-transparent py-6"
            }`}>
            <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">

                {/* Logo - Clinical Style */}
                <Link to='/' className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-[#0F172A] flex items-center justify-center text-cyan-400 font-black text-xl border-b-2 border-cyan-500 transition-all duration-300">
                        <Plus size={24} />
                    </div>
                    <span className={`text-xl font-extrabold tracking-tighter uppercase ${scrolled ? "text-slate-900" : "text-slate-900"}`}>
                        New<span className="text-cyan-600">Care</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-10">
                    <div className="flex space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.to}
                                className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-500 hover:text-cyan-600 transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyan-500 transition-all group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-8 border-l pl-8 border-slate-200">
                        {!isAnyAuth ? (
                            <div className="flex items-center gap-6">
                                <Link to='/patient/login' className="text-[11px] font-bold tracking-widest text-slate-900 hover:text-cyan-600 transition flex items-center gap-2">
                                    <User size={14} className="text-cyan-600" /> LOGIN
                                </Link>
                                <Link to='/management' className="text-[11px] font-bold tracking-widest text-slate-400 hover:text-slate-900 transition uppercase">
                                    Portal
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Link
                                    to={isAdminAuthenticated ? "/admin/dashboard" : isDoctorAuthenticated ? "/doctor/dashboard" : "/patient/dashboard"}
                                    className="text-[11px] font-bold tracking-widest text-slate-900 hover:text-cyan-600 flex items-center gap-2 uppercase"
                                >
                                    <LayoutDashboard size={14} className="text-cyan-600" /> Dashboard
                                </Link>

                                <button
                                    onClick={() => handleLogout(isAdminAuthenticated ? 'admin' : isDoctorAuthenticated ? 'doctor' : 'patient')}
                                    className="text-[11px] font-bold tracking-widest text-red-500 hover:bg-red-50 px-2 py-1 transition uppercase"
                                >
                                    Logout
                                </button>
                            </div>
                        )}

                        <Link
                            to='/appointment/book'
                            className="bg-[#0F172A] text-white px-7 py-3 text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-cyan-600 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-slate-200"
                        >
                            Book Now
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button className="lg:hidden p-2 text-slate-900" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="absolute top-full left-0 w-full lg:hidden bg-white border-b border-slate-200 shadow-xl overflow-hidden"
                    >
                        <div className="flex flex-col p-8 space-y-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.to}
                                    className="text-2xl font-black tracking-tighter text-slate-900 uppercase hover:text-cyan-600 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="h-[1px] bg-slate-100 my-2" />

                            {!isAnyAuth ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link
                                        to='/patient/login'
                                        className="py-4 border border-slate-200 text-center text-[10px] font-black tracking-widest uppercase"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to='/management'
                                        className="py-4 bg-[#0F172A] text-white text-center text-[10px] font-black tracking-widest uppercase"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Portal
                                    </Link>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleLogout(isAdminAuthenticated ? 'admin' : isDoctorAuthenticated ? 'doctor' : 'patient')}
                                    className="text-left text-sm font-bold tracking-widest text-red-600 uppercase py-2"
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