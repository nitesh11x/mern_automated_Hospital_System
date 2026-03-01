import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Activity, ShieldCheck, Clock, PhoneCall, Plus, Microscope } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="pt-20 min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 text-slate-900">

            {/* --- MODULAR HERO SECTION --- */}
            <section className="px-6 lg:px-12 py-12 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-12 gap-4">

                    {/* Main Statement Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-8 bg-white border border-slate-200 p-10 lg:p-16 flex flex-col justify-between shadow-sm"
                    >
                        <div>
                            <p className="text-purple-600 font-bold text-[10px] tracking-[0.5em] uppercase mb-8 flex items-center gap-3">
                                <span className="w-2 h-2 bg-indigo-600"></span> Bio-Tech Integration
                            </p>

                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8">
                                Redefining the <br />
                                <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Clinical Experience.
                                </span>
                            </h1>

                            <p className="text-slate-600 text-lg max-w-xl leading-relaxed">
                                NewCare combines algorithmic precision with elite clinical expertise
                                to deliver a healthcare model built for the next century.
                            </p>
                        </div>

                        <div className="mt-12 flex flex-wrap gap-4">
                            <Link
                                to={'/appointment/book'}
                                className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-8 py-5 text-xs font-bold uppercase tracking-widest hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-4 shadow-lg"
                            >
                                Book Appointment <ArrowRight size={16} />
                            </Link>

                            <button className="border border-indigo-200 text-indigo-700 px-8 py-5 text-xs font-bold uppercase tracking-widest hover:bg-indigo-50 transition-all">
                                View Specialists
                            </button>
                        </div>
                    </motion.div>

                    {/* Side Visual/Action Box */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4 grid grid-rows-2 gap-4"
                    >
                        <div className="bg-linear-to-br from-indigo-600 to-purple-600 p-8 text-white flex flex-col justify-between">
                            <Activity size={32} strokeWidth={1.5} />
                            <div>
                                <h2 className="text-2xl font-bold leading-tight mb-2">Emergency Response</h2>
                                <p className="text-indigo-100 text-sm mb-6">
                                    Immediate surgical intervention & triage.
                                </p>
                                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white text-purple-600 px-4 py-3 self-start hover:text-indigo-600 transition">
                                    <PhoneCall size={14} /> Call Now
                                </button>
                            </div>
                        </div>

                        <div className="relative group overflow-hidden rounded-sm">
                            <img
                                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                alt="Hospital"
                            />
                            <div className="absolute inset-0 bg-purple-900/10 group-hover:bg-transparent transition-all" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- THE BENTO FEATURES --- */}
            <section className="px-6 lg:px-12 pb-24 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-4">

                    <div className="bg-white border border-slate-200 p-8 shadow-sm">
                        <ShieldCheck className="text-indigo-600 mb-6" size={24} />
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-3">Accredited</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            International Health Commission (IHC) Platinum status.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 p-8 shadow-sm">
                        <Clock className="text-purple-600 mb-6" size={24} />
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-3">Wait Times</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Average triage-to-specialist time: 14.5 minutes.
                        </p>
                    </div>

                    <div className="md:col-span-2 bg-slate-50 border border-slate-200 p-8 flex justify-between items-end shadow-sm">
                        <div className="max-w-[60%]">
                            <Microscope className="text-indigo-600 mb-6" size={24} />
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-3">Diagnostics</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Access encrypted lab results through our secure 256-bit portal.
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-4xl font-light bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                03
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- STRIPED MARQUEE --- */}
            <div className="bg-linear-to-r from-indigo-700 to-purple-700 py-4 overflow-hidden">
                <motion.div
                    animate={{ x: [-1000, 0] }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    className="flex whitespace-nowrap gap-16 text-white"
                >
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-6 font-bold text-[10px] uppercase tracking-[0.4em]">
                            <Plus size={14} />
                            <span>System Online</span>
                            <span>•</span>
                            <span>Physicians Active</span>
                            <span>•</span>
                            <span>Network Secured</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* --- FOOTER CTA --- */}
            <section className="py-24 px-6 text-center border-b border-slate-100 bg-white">
                <h2 className="text-4xl font-bold tracking-tight mb-8">
                    Ready for a better healthcare experience?
                </h2>

                <div className="inline-flex border border-indigo-600">
                    <button className="px-10 py-5 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold uppercase tracking-widest hover:from-indigo-700 hover:to-purple-700 transition-colors">
                        New Patient Intake
                    </button>
                    <button className="px-10 py-5 bg-white text-indigo-700 text-xs font-bold uppercase tracking-widest border-l border-indigo-600 hover:bg-indigo-50 transition-colors">
                        Contact Office
                    </button>
                </div>
            </section>

        </div>
    );
};

export default Home;