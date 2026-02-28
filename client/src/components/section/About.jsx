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
            <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">Our Story</span>
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 mt-6 leading-tight">
              Redefining the <br /> 
              <span className="text-primary">Patient Experience.</span>
            </h1>
            <p className="text-xl text-gray-500 mt-8 leading-relaxed max-w-lg">
              Founded in 2015, NewCare started with a simple mission: to make 
              high-quality healthcare as accessible as your favorite smartphone app.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/10 rounded-[3rem] blur-3xl transform rotate-3" />
            <img 
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800" 
              className="relative rounded-[3rem] shadow-2xl z-10 w-full h-100 object-cover border-8 border-white"
              alt="Medical Team"
            />
          </motion.div>
        </div>
      </section>

      {/* --- STATS STRIP --- */}
      <section className="bg-primary py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatBox number="10y+" label="Experience" />
          <StatBox number="50k+" label="Healthy Lives" />
          <StatBox number="150+" label="Specialists" />
          <StatBox number="99%" label="Satisfaction" />
        </div>
      </section>

      {/* --- CORE VALUES --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900">Why Choose NewCare?</h2>
          <div className="h-1.5 w-24 bg-primary mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <ValueCard 
            icon={<ShieldCheck size={32} />} 
            title="Safe & Secure" 
            desc="Your medical records are protected by military-grade encryption and strict privacy protocols."
          />
          <ValueCard 
            icon={<Heart size={32} />} 
            title="Patient First" 
            desc="We don't just treat symptoms; we treat people. Our care is personalized to your unique lifestyle."
          />
          <ValueCard 
            icon={<Target size={32} />} 
            title="High Precision" 
            desc="Utilizing state-of-the-art diagnostic technology for accurate and early detection."
          />
        </div>
      </section>

      {/* --- MISSION / VISION --- */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto bg-[#F4F7FE] rounded-[4rem] p-10 md:p-20 relative overflow-hidden">
          <Award className="absolute -bottom-10 -right-10 text-primary/5 w-64 h-64" />
          
          <div className="max-w-2xl relative z-10">
            <h3 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">Our Vision</h3>
            <p className="text-2xl md:text-4xl font-bold text-gray-900 leading-snug">
              "To build a world where geography never limits the quality of care a person receives."
            </p>
            <div className="mt-10 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-primary">
                <Users size={20} />
              </div>
              <p className="text-gray-600 font-medium italic">— The Executive Board, NewCare</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const StatBox = ({ number, label }) => (
  <div className="text-center text-white">
    <p className="text-4xl md:text-5xl font-black mb-2">{number}</p>
    <p className="text-primary-light/70 text-sm font-bold uppercase tracking-widest">{label}</p>
  </div>
);

const ValueCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-10 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all"
  >
    <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-8">
      {icon}
    </div>
    <h4 className="text-xl font-bold text-gray-900 mb-4">{title}</h4>
    <p className="text-gray-500 leading-relaxed font-medium text-sm">
      {desc}
    </p>
  </motion.div>
);

export default About;