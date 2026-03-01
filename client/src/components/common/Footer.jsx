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
  Activity,
  ShieldCheck
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FBFBFF] border-t border-slate-200 text-slate-600 font-sans">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">

        {/* --- TACTICAL NEWSLETTER --- */}
        <div className="bg-slate-900 p-10 md:p-14 rounded-sm flex flex-col lg:flex-row items-center justify-between gap-10 mb-24 shadow-2xl shadow-slate-900/10 relative overflow-hidden group">
          <Activity size={180} className="absolute -right-10 -bottom-10 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />

          <div className="text-center lg:text-left relative z-10">
            <h3 className="text-3xl font-black text-white mb-3 uppercase italic tracking-tighter leading-none">
              Stay <span className="text-indigo-400">Synchronized</span>
            </h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Receive high-priority clinical updates & wellness logs.</p>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-0 relative z-10">
            <input
              type="email"
              placeholder="TERMINAL_ID@EMAIL.COM"
              className="px-6 py-5 bg-white/5 border border-white/10 text-white placeholder:text-white/20 outline-none focus:bg-white/10 focus:border-indigo-400 w-full sm:w-80 transition-all text-[11px] font-black tracking-widest uppercase"
            />
            <button className="bg-indigo-600 text-white px-10 py-5 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-3">
              Subscribe <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* --- INFORMATION GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

          {/* Brand Identity */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-indigo-600" />
              <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">New<span className="text-indigo-600">Care</span></span>
            </div>
            <p className="text-[11px] leading-loose font-black uppercase tracking-widest text-slate-400 opacity-80">
              Operating at the intersection of digital precision and clinical empathy. Provisioning next-gen health protocols for a global patient registry.
            </p>
            <div className="flex gap-3">
              <SocialIcon icon={<Facebook size={16} />} />
              <SocialIcon icon={<Twitter size={16} />} />
              <SocialIcon icon={<Instagram size={16} />} />
              <SocialIcon icon={<Linkedin size={16} />} />
            </div>
          </div>

          {/* Nav Nodes */}
          <FooterColumn title="Operational Nodes" links={[
            { name: "Global Home", href: "/" },
            { name: "Organization", href: "/about" },
            { name: "Staff Directory", href: "/doctors" },
            { name: "Clinical Units", href: "/services" },
            { name: "Session Booking", href: "/appointment" },
          ]} />

          {/* Specializations */}
          <FooterColumn title="Clinical Sectors" links={[
            { name: "Cardiology", href: "#" },
            { name: "Neurology", href: "#" },
            { name: "Pediatrics", href: "#" },
            { name: "Orthopedics", href: "#" },
            { name: "Diagnostics Lab", href: "#" },
          ]} />

          {/* Contact Terminal */}
          <div className="space-y-8">
            <h4 className="text-slate-900 font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-2">
              <div className="w-1 h-1 bg-indigo-600" /> Contact Terminal
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 text-[11px] font-black uppercase tracking-widest text-slate-400 group">
                <MapPin size={18} className="text-indigo-600 shrink-0 group-hover:scale-110 transition-transform" />
                <span>123 Medical Plaza, Node 04<br /><span className="text-slate-900">New York, NY 10019</span></span>
              </li>
              <li className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-slate-900">
                <Phone size={18} className="text-indigo-600 shrink-0" />
                <span>+1 (555) 000-1234</span>
              </li>
              <li className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-indigo-600">
                <Mail size={18} className="text-indigo-600 shrink-0" />
                <span className="border-b border-indigo-100 hover:border-indigo-600 transition-all cursor-pointer">Support@NewCare.Systems</span>
              </li>
            </ul>
          </div>
        </div>

        {/* --- SYSTEM FOOTER --- */}
        <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">
          <div className="flex items-center gap-3">
            <ShieldCheck size={14} className="text-indigo-600" />
            <p>© {currentYear} NewCare Medical Group // Core System v2.0.6</p>
          </div>
          <div className="flex gap-10">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy_Dossier</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Term_Protocols</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Cache_Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- TACTICAL HELPERS ---

const FooterColumn = ({ title, links }) => (
  <div className="space-y-8">
    <h4 className="text-slate-900 font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-2">
      <div className="w-1 h-1 bg-indigo-600" /> {title}
    </h4>
    <ul className="space-y-4">
      {links.map((link, i) => (
        <li key={i}>
          <a href={link.href} className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:translate-x-1 transition-all inline-block">
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const SocialIcon = ({ icon }) => (
  <a href="#" className="w-11 h-11 border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all text-slate-400 rounded-sm shadow-sm bg-white">
    {icon}
  </a>
);

export default Footer;