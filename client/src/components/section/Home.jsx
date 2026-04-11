import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    ArrowRight, Activity, ShieldCheck, Clock, PhoneCall,
    Plus, Microscope, Heart, Star, Users, Award,
    Calendar, ChevronRight, Sparkles, TrendingUp,
    Mail, MapPin, MessageCircle, Video
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="pt-20 min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">

            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-r from-indigo-200/20 to-purple-200/20  blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-linear-to-r from-purple-200/20 to-pink-200/20  blur-3xl"
                />
            </div>

            {/* --- MODULAR HERO SECTION --- */}
            <section className="px-6 lg:px-12 py-10 max-w-7xl mx-auto relative">
                <motion.div
                    style={{ opacity, scale }}
                    className="grid lg:grid-cols-12 gap-6"
                >
                    {/* Main Statement Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-8 bg-white/80 backdrop-blur-sm border border-indigo-100  p-10 lg:p-16 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all duration-500"
                    >
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-3 mb-8"
                            >
                                <div className="w-8 h-0.5 bg-linear-to-r from-indigo-600 to-purple-600" />
                                <p className="text-purple-600 font-bold text-[10px] tracking-[0.3em] uppercase flex items-center gap-2">
                                    <Sparkles size={12} />
                                    Bio-Tech Integration
                                </p>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8"
                            >
                                Redefining the
                                <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block mt-2">
                                    Clinical Experience.
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-slate-600 text-lg max-w-xl leading-relaxed"
                            >
                                NewCare combines algorithmic precision with elite clinical expertise
                                to deliver a healthcare model built for the next century.
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-12 flex flex-wrap gap-4"
                        >
                            <Link
                                to={'/appointment/book'}
                                className="group relative bg-linear-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 text-xs font-bold uppercase tracking-wider hover:shadow-2xl transition-all duration-300 flex items-center gap-3  overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Book Appointment
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-linear-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>

                            <Link
                                to={'/doctor/all'}
                                className="group border-2 border-indigo-200 text-indigo-600 px-8 py-4 text-xs font-bold uppercase tracking-wider hover:bg-indigo-50 hover:border-indigo-400 transition-all  flex items-center gap-2"
                            >
                                View Specialists
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Side Visual/Action Box */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-4 grid grid-rows-2 gap-6"
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-linear-to-br from-indigo-600 to-purple-600 p-8 text-white flex flex-col justify-between  shadow-xl"
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <Activity size={32} strokeWidth={1.5} />
                            </motion.div>
                            <div className="mt-6">
                                <h2 className="text-2xl font-bold leading-tight mb-2">Emergency Response</h2>
                                <p className="text-indigo-100 text-sm mb-6">
                                    Immediate surgical intervention & triage available 24/7.
                                </p>
                                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm text-white px-5 py-3  hover:bg-white/30 transition-all group">
                                    <PhoneCall size={14} className="group-hover:animate-pulse" />
                                    Call Now: 911
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="relative group overflow-hidden  shadow-xl"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000"
                                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                                alt="Modern Hospital Facility"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-indigo-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-xs font-bold">State-of-the-art Facility</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* --- STATS SECTION --- */}
            {/* <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="px-6 lg:px-12 py-16 max-w-7xl mx-auto"
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { icon: Users, value: "500+", label: "Medical Experts", color: "indigo" },
                        { icon: Heart, value: "50K+", label: "Happy Patients", color: "purple" },
                        { icon: Award, value: "25+", label: "Years Excellence", color: "pink" },
                        { icon: TrendingUp, value: "98%", label: "Success Rate", color: "indigo" }
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -5 }}
                            className="bg-white  p-6 text-center border border-indigo-100 shadow-md hover:shadow-xl transition-all"
                        >
                            <stat.icon className={`text-${stat.color}-600 w-8 h-8 mx-auto mb-3`} />
                            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section> */}

            {/* --- THE BENTO FEATURES --- */}
            {/* <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="px-6 lg:px-12 pb-24 max-w-7xl mx-auto"
            >
                <motion.div variants={itemVariants} className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-8 h-0.5 bg-linear-to-r from-indigo-600 to-purple-600" />
                        <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Why Choose Us</span>
                        <div className="w-8 h-0.5 bg-linear-to-r from-purple-600 to-indigo-600" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                        Excellence in <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Healthcare</span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-4 gap-5">
                    <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white border border-indigo-100 p-8  shadow-md hover:shadow-xl transition-all">
                        <div className="w-12 h-12 bg-indigo-50  flex items-center justify-center mb-6">
                            <ShieldCheck className="text-indigo-600" size={24} />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-slate-800">Accredited</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            International Health Commission (IHC) Platinum status with 5-star rating.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white border border-indigo-100 p-8  shadow-md hover:shadow-xl transition-all">
                        <div className="w-12 h-12 bg-purple-50  flex items-center justify-center mb-6">
                            <Clock className="text-purple-600" size={24} />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-slate-800">Minimal Wait Times</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Average triage-to-specialist time: <span className="text-indigo-600 font-bold">14.5 minutes</span>
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white border border-indigo-100 p-8  shadow-md hover:shadow-xl transition-all">
                        <div className="w-12 h-12 bg-indigo-50  flex items-center justify-center mb-6">
                            <Video className="text-indigo-600" size={24} />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-slate-800">Telemedicine</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            24/7 virtual consultations with board-certified physicians.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-linear-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-8  shadow-md hover:shadow-xl transition-all">
                        <div className="w-12 h-12 bg-white  flex items-center justify-center mb-6">
                            <Microscope className="text-indigo-600" size={24} />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-slate-800">Advanced Diagnostics</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Access encrypted lab results through our secure 256-bit portal.
                        </p>
                        <div className="mt-4 text-right">
                            <span className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                AI-Powered
                            </span>
                        </div>
                    </motion.div>
                </div>
            </motion.section> */}

            {/* --- STRIPED MARQUEE --- */}
            <div className="bg-linear-to-r from-indigo-700 via-purple-700 to-pink-700 py-5 overflow-hidden shadow-inner">
                <motion.div
                    animate={{ x: [-500, 0] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="flex whitespace-nowrap gap-12 text-white"
                >
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-6 font-bold text-[11px] uppercase tracking-[0.3em]">
                            <Heart size={14} className="animate-pulse" />
                            <span>100% Digital Experience</span>
                            <span>•</span>
                            <span>Zero Wait Times</span>
                            <span>•</span>
                            <span>Schedule From Home</span>
                            <span>•</span>
                            <span>24/7 Support</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* --- SERVICES PREVIEW --- */}
            {/* <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="px-6 lg:px-12 py-24 max-w-7xl mx-auto"
            >
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Star size={18} className="text-indigo-600 fill-indigo-600" />
                            <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Our Services</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Comprehensive <span className="text-indigo-600">Care</span> for Every Need
                        </h2>
                        <p className="text-slate-500 mb-6 leading-relaxed">
                            From preventive care to complex surgeries, our multidisciplinary team ensures
                            you receive the highest standard of medical attention.
                        </p>
                        <Link
                            to="/services"
                            className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm hover:gap-3 transition-all"
                        >
                            Explore All Services
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { name: "Cardiology", icon: Heart, color: "indigo" },
                            { name: "Neurology", icon: Activity, color: "purple" },
                            { name: "Pediatrics", icon: Users, color: "pink" },
                            { name: "Orthopedics", icon: TrendingUp, color: "indigo" }
                        ].map((service, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                className="bg-white  p-5 text-center border border-indigo-100 shadow-md hover:shadow-xl transition-all"
                            >
                                <service.icon className={`text-${service.color}-600 w-8 h-8 mx-auto mb-2`} />
                                <p className="text-sm font-semibold text-slate-800">{service.name}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section> */}

            {/* --- CTA SECTION --- */}
            {/* <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="px-6 lg:px-12 py-20 max-w-7xl mx-auto"
            >
                <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-sm p-12 text-center relative overflow-hidden">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-0 right-0 opacity-10"
                    >
                        <Heart size={200} className="text-white" />
                    </motion.div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready for a better healthcare experience?
                        </h2>
                        <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of patients who have experienced the NewCare difference.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link
                                to="/patient/register"
                                className="bg-white text-indigo-600 px-8 py-4  font-bold text-sm uppercase tracking-wider hover:shadow-xl transition-all flex items-center gap-2"
                            >
                                New Patient Intake
                                <ArrowRight size={14} />
                            </Link>
                            <Link
                                to="/contact"
                                className="border-2 border-white/30 text-white px-8 py-4  font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-all"
                            >
                                Contact Office
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.section> */}
        </div>
    );
};

export default Home;