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
  Clock
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 font-sans">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">

        {/* --- NEWSLETTER SECTION --- */}
        <div className="bg-indigo-600 p-10 md:p-14 rounded-sm flex flex-col lg:flex-row items-center justify-between gap-10 mb-24 relative overflow-hidden group shadow-lg shadow-indigo-100">
          <Building2 size={180} className="absolute -right-10 -bottom-10 text-white/10 group-hover:scale-105 transition-transform duration-700" />

          <div className="text-center lg:text-left relative z-10">
            <h3 className="text-3xl font-extrabold text-white mb-3 uppercase tracking-tight leading-none">
              Stay <span className="text-indigo-200">Informed</span>
            </h3>
            <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-[0.2em]">Subscribe to receive clinical updates and health wellness tips.</p>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-0 relative z-10 shadow-xl">
            <input
              type="email"
              placeholder="YOUR.EMAIL@PROVIDER.COM"
              className="px-6 py-5 bg-white border-none text-slate-900 placeholder:text-slate-400 outline-none w-full sm:w-80 transition-all text-[11px] font-bold tracking-widest uppercase rounded-l-sm"
            />
            <button className="bg-slate-900 text-white px-10 py-5 font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3 rounded-r-sm">
              Join Registry <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* --- INFORMATION GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

          {/* Brand Identity */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-indigo-600" />
              <span className="text-2xl font-extrabold text-slate-900 tracking-tighter uppercase">New<span className="text-indigo-600">Care</span></span>
            </div>
            <p className="text-[11px] leading-loose font-bold uppercase tracking-widest text-slate-400">
              Leading the way in medical excellence and patient-centered care. Providing professional healthcare services across our global network of facilities.
            </p>
            <div className="flex gap-2">
              <SocialIcon icon={<Facebook size={16} />} />
              <SocialIcon icon={<Twitter size={16} />} />
              <SocialIcon icon={<Instagram size={16} />} />
              <SocialIcon icon={<Linkedin size={16} />} />
            </div>
          </div>

          {/* Nav Links */}
          <FooterColumn title="Quick Access" links={[
            { name: "Patient Portal", href: "/" },
            { name: "About Facility", href: "/about" },
            { name: "Medical Staff", href: "/doctors" },
            { name: "Our Services", href: "/services" },
            { name: "Book Appointment", href: "/appointment" },
          ]} />

          {/* Departments */}
          <FooterColumn title="Departments" links={[
            { name: "Cardiology Unit", href: "#" },
            { name: "Neurology Center", href: "#" },
            { name: "Pediatric Care", href: "#" },
            { name: "Orthopedic Surgery", href: "#" },
            { name: "Diagnostic Imaging", href: "#" },
          ]} />

          {/* Contact Information */}
          <div className="space-y-8">
            <h4 className="text-slate-900 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
              <div className="w-1 h-1 bg-indigo-600" /> Contact Support
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                <MapPin size={18} className="text-indigo-600 shrink-0" />
                <span>123 Medical Plaza, Suite 400<br /><span className="text-slate-900">New York, NY 10019</span></span>
              </li>
              <li className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-slate-900">
                <Phone size={18} className="text-indigo-600 shrink-0" />
                <span>+1 (555) 000-1234</span>
              </li>
              <li className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-indigo-600">
                <Clock size={18} className="text-indigo-600 shrink-0" />
                <span>Available 24/7 for Emergencies</span>
              </li>
            </ul>
          </div>
        </div>

        {/* --- SYSTEM FOOTER --- */}
        <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">
          <div className="flex items-center gap-3">
            <ShieldCheck size={14} className="text-emerald-500" />
            <p>© {currentYear} NewCare Medical Group // Institutional Systems</p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- HELPERS ---

const FooterColumn = ({ title, links }) => (
  <div className="space-y-8">
    <h4 className="text-slate-900 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
      <div className="w-1 h-1 bg-indigo-600" /> {title}
    </h4>
    <ul className="space-y-4">
      {links.map((link, i) => (
        <li key={i}>
          <a href={link.href} className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all inline-block">
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const SocialIcon = ({ icon }) => (
  <a href="#" className="w-10 h-10 border border-slate-200 flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-slate-400 rounded-sm bg-white shadow-sm">
    {icon}
  </a>
);

export default Footer;