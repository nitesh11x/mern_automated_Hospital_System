import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  Heart,
  ChevronRight,
  Sparkles,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <footer className="bg-linear-to-b from-white to-indigo-50/30 border-t border-indigo-100 text-slate-600">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">

        {/* --- NEWSLETTER SECTION with Enhanced Gradient --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={footerVariants}
          className="bg-linear-to-r from-indigo-600 via-indigo-600 to-purple-600 p-10 md:p-14 rounded-sm flex flex-col lg:flex-row items-center justify-between gap-10 mb-24 relative overflow-hidden group shadow-2xl shadow-indigo-200"
        >
          {/* Animated Background Elements */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
            className="absolute -right-10 -bottom-10"
          >
            <Building2 size={200} className="text-white/10 group-hover:scale-110 transition-transform duration-700" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, -10, 0],
              x: [0, 5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute -left-20 -top-20 opacity-10"
          >
            <Heart size={150} className="text-white" />
          </motion.div>

          <div className="relative z-10 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <Sparkles size={20} className="text-indigo-200 animate-pulse" />
              <span className="text-indigo-100 text-[10px] font-bold uppercase tracking-[0.2em]">Exclusive Updates</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
              Stay <span className="text-indigo-200">Informed</span>
            </h3>
            <p className="text-indigo-100 text-sm max-w-md">
              Subscribe to receive clinical updates, health wellness tips, and exclusive offers.
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-0 relative z-10 shadow-2xl rounded-sm overflow-hidden">
            <input
              type="email"
              placeholder="YOUR.EMAIL@PROVIDER.COM"
              className="px-6 py-4 bg-white border-none text-slate-900 placeholder:text-slate-400 outline-none w-full sm:w-80 transition-all text-xs font-bold tracking-wider"
            />
            <button className="bg-slate-900 text-white px-8 py-4 font-bold text-xs uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-2 group">
              Join Registry
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* --- INFORMATION GRID --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={footerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20"
        >
          {/* Brand Identity */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-linear-to-b from-indigo-600 to-purple-600 rounded-full" />
              <div>
                <span className="text-2xl font-extrabold tracking-tight">
                  <span className="text-slate-900">New</span>
                  <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Care</span>
                </span>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Healthcare Excellence</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Leading the way in medical excellence and patient-centered care. Providing professional healthcare services across our global network of facilities.
            </p>
            <div className="flex gap-2 pt-2">
              <SocialIcon icon={<Facebook size={16} />} href="#" />
              <SocialIcon icon={<Twitter size={16} />} href="#" />
              <SocialIcon icon={<Instagram size={16} />} href="#" />
              <SocialIcon icon={<Linkedin size={16} />} href="#" />
            </div>
          </motion.div>

          {/* Quick Access */}
          <FooterColumn
            title="Quick Access"
            icon={<ChevronRight size={12} />}
            links={[
              { name: "Patient Portal", href: "/" },
              { name: "About Facility", href: "/about" },
              { name: "Medical Staff", href: "/doctors" },
              { name: "Our Services", href: "/services" },
              { name: "Book Appointment", href: "/appointment" },
            ]}
          />

          {/* Departments */}
          <FooterColumn
            title="Departments"
            icon={<Star size={12} />}
            links={[
              { name: "Cardiology Unit", href: "#" },
              { name: "Neurology Center", href: "#" },
              { name: "Pediatric Care", href: "#" },
              { name: "Orthopedic Surgery", href: "#" },
              { name: "Diagnostic Imaging", href: "#" },
            ]}
          />

          {/* Contact Information */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-slate-900 font-bold uppercase tracking-[0.2em] text-[11px] flex items-center gap-2">
              <div className="w-1 h-4 bg-linear-to-b from-indigo-600 to-purple-600 rounded-full" />
              Contact Support
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 text-xs text-slate-500 group">
                <div className="mt-0.5 p-1.5 bg-indigo-50 rounded-sm group-hover:bg-indigo-100 transition-colors">
                  <MapPin size={16} className="text-indigo-600 shrink-0" />
                </div>
                <span className="leading-relaxed">
                  123 Medical Plaza, Suite 400<br />
                  <span className="text-slate-700 font-medium">New York, NY 10019</span>
                </span>
              </li>
              <li className="flex items-center gap-3 text-xs group">
                <div className="p-1.5 bg-indigo-50 rounded-sm group-hover:bg-indigo-100 transition-colors">
                  <Phone size={16} className="text-indigo-600 shrink-0" />
                </div>
                <span className="text-slate-700 font-medium">+1 (555) 000-1234</span>
              </li>
              <li className="flex items-center gap-3 text-xs group">
                <div className="p-1.5 bg-indigo-50 rounded-sm group-hover:bg-indigo-100 transition-colors">
                  <Mail size={16} className="text-indigo-600 shrink-0" />
                </div>
                <span className="text-slate-700 font-medium">care@newcare.com</span>
              </li>
              <li className="flex items-center gap-3 text-xs group">
                <div className="p-1.5 bg-indigo-50 rounded-sm group-hover:bg-indigo-100 transition-colors">
                  <Clock size={16} className="text-indigo-600 shrink-0" />
                </div>
                <span className="text-emerald-600 font-bold">Available 24/7 for Emergencies</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* --- DIVIDER with Gradient --- */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-indigo-100" />
          </div>
          <div className="relative flex justify-center">
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-1 rounded-full">
              <Heart size={12} className="text-white" />
            </div>
          </div>
        </div>

        {/* --- SYSTEM FOOTER --- */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <p>© {currentYear} NewCare Medical Group // Institutional Systems</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Accessibility</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">HIPAA Compliance</a>
          </div>
        </motion.div>

        {/* --- Decorative Bottom Bar --- */}
        <div className="mt-8 pt-4 text-center">
          <p className="text-[8px] font-bold uppercase tracking-wider text-slate-300">
            🏥 Committed to Excellence in Healthcare • Accredited by Joint Commission International
          </p>
        </div>
      </div>
    </footer>
  );
};

// --- ENHANCED HELPERS ---

const FooterColumn = ({ title, links, icon }) => (
  <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="space-y-6">
    <h4 className="text-slate-900 font-bold uppercase tracking-[0.2em] text-[11px] flex items-center gap-2">
      <div className="w-1 h-4 bg-linear-to-b from-indigo-600 to-purple-600 rounded-full" />
      {title}
    </h4>
    <ul className="space-y-3">
      {links.map((link, i) => (
        <li key={i}>
          <Link
            to={link.href}
            className="group flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-all duration-300"
          >
            {icon && (
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                {icon}
              </span>
            )}
            <span className="group-hover:translate-x-1 transition-transform inline-block">
              {link.name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </motion.div>
);

const SocialIcon = ({ icon, href }) => (
  <motion.a
    whileHover={{ y: -3, scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    href={href}
    className="w-9 h-9 border border-indigo-200 flex items-center justify-center hover:bg-linear-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 rounded-sm text-slate-400 bg-white shadow-sm"
  >
    {icon}
  </motion.a>
);

export default Footer;