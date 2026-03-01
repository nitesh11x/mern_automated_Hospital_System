import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Heart, Users, Target, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-white pt-16 pb-20 overflow-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative px-6 py-20 lg:py-32 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10"
          >
            <span className="text-indigo-600 font-black uppercase tracking-[0.4em] text-xs border-l-4 border-purple-600 pl-4">
              Our Story
            </span>
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 mt-8 leading-tight">
              Redefining the <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                Patient Experience.
              </span>
            </h1>
            <p className="text-xl text-gray-500 mt-8 leading-relaxed max-w-lg font-medium">
              Founded in 2015, NewCare started with a simple mission: to make
              high-quality healthcare as accessible as your favorite smartphone app.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            {/* Sharp accent box instead of blur circle */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-purple-600" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-indigo-600" />

            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
              className="relative rounded-sm shadow-2xl z-10 w-full h-125 object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
              alt="Medical Team"
            />
          </motion.div>
        </div>
      </section>

      {/* --- STATS STRIP --- */}
      <section className="bg-linear-to-r from-indigo-700 to-indigo-900 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatBox number="10y+" label="Experience" />
          <StatBox number="50k+" label="Healthy Lives" />
          <StatBox number="150+" label="Specialists" />
          <StatBox number="99%" label="Satisfaction" />
        </div>
      </section>

      {/* --- CORE VALUES --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">
              Why Choose NewCare?
            </h2>
          </div>
          <div className="h-px grow bg-gray-200 hidden md:block mb-6 mx-8" />
          <div className="text-purple-600 font-bold uppercase tracking-widest text-xs mb-2">
            Clinical Excellence
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-gray-100 border border-gray-100">
          <ValueCard
            icon={<ShieldCheck size={28} />}
            title="Safe & Secure"
            desc="Your medical records are protected by military-grade encryption and strict privacy protocols."
          />
          <ValueCard
            icon={<Heart size={28} />}
            title="Patient First"
            desc="We don't just treat symptoms; we treat people. Our care is personalized to your unique lifestyle."
          />
          <ValueCard
            icon={<Target size={28} />}
            title="High Precision"
            desc="Utilizing state-of-the-art diagnostic technology for accurate and early detection."
          />
        </div>
      </section>

      {/* --- MISSION / VISION --- */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto bg-gray-50 rounded-sm border border-gray-200 p-10 md:p-24 relative overflow-hidden group">
          {/* Subtle Accent Gradient hover effect */}
          <div className="absolute inset-0 bg-linear-to-br from-indigo-50/0 to-purple-50/0 group-hover:from-indigo-50/50 group-hover:to-purple-50/50 transition-colors duration-500" />

          <Award className="absolute -bottom-10 -right-10 text-indigo-600/5 w-64 h-64 rotate-12" />

          <div className="max-w-3xl relative z-10">
            <h3 className="text-indigo-600 font-black uppercase tracking-[0.4em] text-xs mb-8">
              Our Vision
            </h3>
            <p className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
              "To build a world where geography never limits the quality of care a person receives."
            </p>
            <div className="mt-12 flex items-center gap-6">
              <div className="w-14 h-14 bg-indigo-600 text-white rounded-sm flex items-center justify-center shadow-lg shadow-indigo-200">
                <Users size={24} />
              </div>
              <div>
                <p className="text-gray-900 font-black uppercase tracking-widest text-sm">The Executive Board</p>
                <p className="text-purple-600 font-bold text-xs uppercase tracking-widest mt-1">NewCare Medical Group</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const StatBox = ({ number, label }) => (
  <div className="text-center text-white border-r border-indigo-500 last:border-none">
    <p className="text-4xl md:text-5xl font-black mb-1">{number}</p>
    <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-[0.2em]">{label}</p>
  </div>
);

const ValueCard = ({ icon, title, desc }) => (
  <div className="p-12 bg-white group hover:bg-gray-50 transition-all duration-300">
    <div className="w-12 h-12 bg-indigo-600 text-white rounded-sm flex items-center justify-center mb-10 group-hover:bg-purple-600 transition-colors duration-300 shadow-md">
      {icon}
    </div>
    <h4 className="text-lg font-black text-gray-900 mb-4 uppercase tracking-tight">{title}</h4>
    <p className="text-gray-500 leading-relaxed font-medium text-sm">
      {desc}
    </p>
  </div>
);

export default About;