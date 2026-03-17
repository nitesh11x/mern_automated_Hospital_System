import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight, LayoutDashboard, User, Plus } from "lucide-react";
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
        toast.success("Admin Logged Out");
      } else if (role === "doctor") {
        await dispatch(doctorLogoutThunk()).unwrap();
        toast.success("Doctor Logged Out");
      } else {
        await dispatch(patientLogoutThunk()).unwrap();
        toast.success("Patient Logged Out");
      }

      setIsOpen(false);
      navigate("/");
      window.location.reload();
    } catch (error) {
      toast.error("Logout Failed");
    }
  };

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "About", to: "/about" },
    { name: "Doctors", to: "/doctor/all" },
    { name: "Contact", to: "/contact" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200 py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-sm shadow-md group-hover:bg-purple-600 transition-all">
            <Plus size={18} />
          </div>

          <span className="text-xl font-bold text-blue">
            New
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Care
            </span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-indigo-600 to-purple-600 transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6 border-l pl-6 border-slate-200">
            {!isAnyAuth ? (
              <>
                <Link
                  to="/patient/login"
                  className="text-sm font-semibold text-slate-700 hover:text-purple-600 flex items-center gap-2 transition"
                >
                  <User size={16} className="text-indigo-600" />
                  Login
                </Link>

                <Link
                  to="/management"
                  className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition"
                >
                  Portal
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={
                    isAdminAuthenticated
                      ? "/admin/dashboard"
                      : isDoctorAuthenticated
                        ? "/doctor/dashboard"
                        : "/patient/dashboard"
                  }
                  className="text-sm font-semibold text-slate-900 hover:text-purple-600 flex items-center gap-2 transition"
                >
                  <LayoutDashboard size={16} className="text-indigo-600" />
                  Dashboard
                </Link>

                <button
                  onClick={() =>
                    handleLogout(
                      isAdminAuthenticated
                        ? "admin"
                        : isDoctorAuthenticated
                          ? "doctor"
                          : "patient",
                    )
                  }
                  className="text-sm font-semibold text-rose-600 hover:bg-rose-50 px-3 py-1 rounded transition"
                >
                  Logout
                </button>
              </>
            )}

            <Link
              to="/appointment/book"
              className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-sm text-sm font-semibold shadow-lg transition flex items-center gap-2"
            >
              Book Now <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-slate-900"
          onClick={() => setIsOpen(!isOpen)}
        >
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
            className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg lg:hidden"
          >
            <div className="flex flex-col p-6 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className="text-xl font-bold text-slate-900 hover:text-purple-600"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {!isAnyAuth && (
                <Link
                  to="/patient/login"
                  className="bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-sm text-center font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
