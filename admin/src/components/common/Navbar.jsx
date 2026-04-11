import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight, LayoutDashboard, User, Plus, LogOut, Calendar, Home, Info, Stethoscope, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { adminLogoutThunk } from "../../redux/slices/admin.slice";
import { doctorLogoutThunk } from "../../redux/slices/doctor.slice";
import { patientLogoutThunk } from "../../redux/slices/patient.slice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isPatientAuthenticated } = useSelector((state) => state.patient);
  const { isAdminAuthenticated } = useSelector((state) => state.admin);
  const { isDoctorAuthenticated } = useSelector((state) => state.doctor);

  const isAnyAuth =
    isPatientAuthenticated || isAdminAuthenticated || isDoctorAuthenticated;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async (role) => {
    try {
      if (role === "admin") {
        await dispatch(adminLogoutThunk()).unwrap();
        toast.success("Admin Logged Out Successfully");
      } else if (role === "doctor") {
        await dispatch(doctorLogoutThunk()).unwrap();
        toast.success("Doctor Logged Out Successfully");
      } else {
        await dispatch(patientLogoutThunk()).unwrap();
        toast.success("Patient Logged Out Successfully");
      }

      setIsOpen(false);
      navigate("/");
      window.location.reload();
    } catch (error) {
      toast.error("Logout Failed. Please try again.");
    }
  };

  const navLinks = [

  ];

  // Get dashboard route based on authentication
  const getDashboardRoute = () => {
    if (isAdminAuthenticated) return "/admin/dashboard";
    if (isDoctorAuthenticated) return "/doctor/dashboard";
    if (isPatientAuthenticated) return "/patient/dashboard";
    return "/";
  };

  // Get current user role for logout
  const getCurrentRole = () => {
    if (isAdminAuthenticated) return "admin";
    if (isDoctorAuthenticated) return "doctor";
    if (isPatientAuthenticated) return "patient";
    return null;
  };

  // Animation variants
  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeIn" } }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 }
    })
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${scrolled
        ? "bg-white/90 backdrop-blur-xl shadow-lg border-b border-slate-200/50 py-3"
        : "bg-white/70 backdrop-blur-md py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group relative"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-indigo-600 to-purple-600 rounded-sm blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            <div className="w-11 h-11 bg-linear-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center rounded-sm shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 relative">
              <Plus size={20} strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-slate-800">New</span>
              <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-purple-700 bg-clip-text text-transparent">
                Care
              </span>
            </span>
            <span className="text-[10px] font-medium text-slate-400 tracking-wider -mt-1">
              HEALTHCARE EXCELLENCE
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex gap-7">
            {navLinks.map((link, idx) => (
              <Link
                key={link.name}
                to={link.to}
                className="group relative text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors duration-300 py-2"
              >
                <span className="flex items-center gap-1.5">
                  <link.icon size={16} className="opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-4 group-hover:ml-0" />
                  {link.name}
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-indigo-600 to-purple-600 transition-all duration-300 group-hover:w-full rounded-sm" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-5 border-l pl-6 border-slate-200">
            {!isAnyAuth ? (
              <>
                <Link
                  to="/doctor/login"
                  className="group text-sm font-semibold text-slate-700 hover:text-indigo-600 flex items-center gap-2 transition-all duration-300 px-3 py-2 rounded-sm hover:bg-indigo-50"
                >
                  <Stethoscope size={16} className="text-indigo-500 group-hover:scale-110 transition-transform" />
                  <span>Doctor Login</span>
                </Link>

                <Link
                  to="/admin/login"
                  className="group text-sm font-semibold text-slate-700 hover:text-indigo-600 flex items-center gap-2 transition-all duration-300 px-3 py-2 rounded-sm hover:bg-indigo-50"
                >
                  <LayoutDashboard size={16} className="text-indigo-500 group-hover:scale-110 transition-transform" />
                  <span>Admin Login</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={getDashboardRoute()}
                  className="group text-sm font-semibold text-slate-800 hover:text-indigo-600 flex items-center gap-2 transition-all duration-300 px-3 py-2 rounded-sm hover:bg-indigo-50"
                >
                  <LayoutDashboard size={16} className="text-indigo-500 group-hover:scale-110 transition-transform" />
                  <span>Dashboard</span>
                </Link>

                <button
                  onClick={() => handleLogout(getCurrentRole())}
                  className="group text-sm font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-2 transition-all duration-300 px-3 py-2 rounded-sm hover:bg-rose-50"
                >
                  <LogOut size={16} className="group-hover:rotate-180 transition-transform duration-300" />
                  <span>Logout</span>
                </button>
              </>
            )}


          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-sm bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 z-20"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={22} className="text-slate-700" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={22} className="text-slate-700" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-2xl lg:hidden overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  custom={idx}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    to={link.to}
                    className="flex items-center gap-3 text-lg font-semibold text-slate-800 hover:text-indigo-600 py-3 px-4 rounded-sm hover:bg-indigo-50 transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <link.icon size={20} className="text-indigo-500" />
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                variants={navItemVariants}
                custom={navLinks.length}
                initial="hidden"
                animate="visible"
                className="pt-4 border-t border-slate-200 mt-2"
              >
                {!isAnyAuth ? (
                  <>
                    <Link
                      to="/doctor/login"
                      className="flex items-center gap-3 text-lg font-semibold text-slate-800 hover:text-indigo-600 py-3 px-4 rounded-sm hover:bg-indigo-50 transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <Stethoscope size={20} className="text-indigo-500" />
                      Doctor Login
                    </Link>
                    <Link
                      to="/admin/login"
                      className="flex items-center gap-3 text-lg font-semibold text-slate-800 hover:text-indigo-600 py-3 px-4 rounded-sm hover:bg-indigo-50 transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard size={20} className="text-indigo-500" />
                      Admin Login
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={getDashboardRoute()}
                      className="flex items-center gap-3 text-lg font-semibold text-slate-800 hover:text-indigo-600 py-3 px-4 rounded-sm hover:bg-indigo-50 transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard size={20} className="text-indigo-500" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout(getCurrentRole());
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 text-lg font-semibold text-rose-600 hover:text-rose-700 py-3 px-4 rounded-sm hover:bg-rose-50 transition-all duration-200"
                    >
                      <LogOut size={20} />
                      Logout
                    </button>
                  </>
                )}


              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;