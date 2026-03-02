import React from "react";
import { motion } from "framer-motion";
import { Heart, Brain, Baby, Activity, Eye, Bone, ArrowRight } from "lucide-react";

const services = [
  {
    title: "Cardiology",
    desc: "Comprehensive heart health monitoring and advanced diagnostic testing.",
    icon: <Heart size={28} />,
    isIndigo: true
  },
  {
    title: "Neurology",
    desc: "Expert care for brain, spinal cord, and complex nervous system disorders.",
    icon: <Brain size={28} />,
    isIndigo: false
  },
  {
    title: "Pediatrics",
    desc: "Specialized medical care for infants, children, and young adolescents.",
    icon: <Baby size={28} />,
    isIndigo: true
  },
  {
    title: "Orthopedics",
    desc: "Modern solutions for bone, joint, and musculoskeletal rehabilitation.",
    icon: <Bone size={28} />,
    isIndigo: false
  },
  {
    title: "Ophthalmology",
    desc: "Advanced vision correction and complete eye health management.",
    icon: <Eye size={28} />,
    isIndigo: true
  },
  {
    title: "Diagnostics",
    desc: "State-of-the-art lab testing and high-resolution imaging services.",
    icon: <Activity size={28} />,
    isIndigo: false
  }
];

const Services = () => {
  return (
    <div className="pt-32 pb-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="max-w-2xl mb-16 border-l-8 border-indigo-600 pl-8">
          <h2 className="text-purple-600 font-black tracking-[0.3em] uppercase text-xs mb-3">
            Our Specialties
          </h2>
          <h1 className="text-5xl font-black text-gray-900 mb-6 leading-tight">
            World-class healthcare <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
              tailored for you.
            </span>
          </h1>
          <p className="text-lg text-gray-500 font-medium">
            We leverage cutting-edge technology and clinical expertise to provide
            unmatched medical precision.
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 border border-gray-100">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group p-10 bg-white hover:bg-gray-50 transition-all duration-300 relative overflow-hidden"
            >
              {/* Subtle hover accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              {/* Icon Box - Sharp rounded-sm */}
              <div className={`w-14 h-14 mb-8 flex items-center justify-center rounded-sm transition-all duration-300 
                ${service.isIndigo
                  ? "bg-indigo-600 text-white group-hover:bg-indigo-700"
                  : "bg-purple-600 text-white group-hover:bg-purple-700"
                } shadow-lg ${service.isIndigo ? "shadow-indigo-200" : "shadow-purple-200"}`}
              >
                {service.icon}
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tight">
                {service.title}
              </h3>

              <p className="text-gray-500 leading-relaxed mb-8 text-sm font-medium">
                {service.desc}
              </p>

              <a
                href={`/services/${service.title.toLowerCase()}`}
                className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors
                  ${service.isIndigo ? "text-indigo-600 hover:text-indigo-800" : "text-purple-600 hover:text-purple-800"}`}
              >
                Learn More
                <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;