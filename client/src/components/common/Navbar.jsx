import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { isPatientAuthenticated } = useSelector(state => state.patient)

    // Handle scroll effect for glassmorphism
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", to: "/" },
        { name: "About", to: "/about" },
        { name: "Doctors", to: "/doctor/all" },
        { name: "Contact", to: "/contact" },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

                {/* Logo */}
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform">
                        N
                    </div>
                    <Link to={'/'} className="text-2xl font-extrabold tracking-tight text-gray-900">
                        New<span className="text-primary">Care</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-10">
                    <div className="flex space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.to}
                                className="relative text-sm font-medium text-gray-600 hover:text-primary transition-colors group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 border-l pl-8 border-gray-200">
                        {!isPatientAuthenticated && <Link to={'/login'} className="text-sm font-semibold text-gray-700 hover:text-primary transition">
                            Sign In
                        </Link>}
                        {isPatientAuthenticated && < Link to={'/patient/dashboard'} className="text-sm font-semibold text-gray-700 hover:text-primary transition">
                            Dashboard
                        </Link>}
                        <Link
                            to={'appointment/new'}
                            className="group flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-medium hover:bg-primary-dark transition shadow-lg shadow-primary/20"
                        >
                            Book Now
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        {!isPatientAuthenticated && <Link to={'/patient/login'} className="text-sm font-semibold text-gray-700 hover:text-primary transition">
                            log In
                        </Link>}
                        <Link
                            to={'admin/login'}
                            className="group flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-medium hover:bg-primary-dark transition shadow-lg shadow-primary/20"
                        >
                            Admin Login
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to={'doctor/login'}
                            className="group flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-medium hover:bg-primary-dark transition shadow-lg shadow-primary/20"
                        >
                            Doctor Login
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu (Animated) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl md:hidden"
                    >
                        <div className="flex flex-col p-6 space-y-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-medium text-gray-700 hover:text-primary"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <hr className="border-gray-100" />
                            <a
                                href="/appointment"
                                className="w-full bg-primary text-white p-4 rounded-xl text-center font-bold"
                            >
                                Book Appointment
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav >
    );
};

export default Navbar;