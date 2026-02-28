import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Activity, ShieldCheck, Clock, PhoneCall, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="pt-20 min-h-screen bg-white text-slate-900">

            {/* --- HERO SECTION --- */}
            <section className="relative px-6 lg:px-12 py-16 lg:py-24 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-3">
                            <span className="h-[2px] w-8 bg-cyan-500"></span>
                            <span className="text-xs font-bold tracking-[0.2em] uppercase text-cyan-600">
                                Global Excellence in Medicine
                            </span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                            Advanced Care <br />
                            <span className="text-slate-400 font-light italic text-4xl lg:text-6xl">for a</span> <br />
                            New Generation.
                        </h1>

                        <p className="text-lg text-slate-500 max-w-md leading-relaxed border-l-2 border-slate-100 pl-6">
                            NewCare combines world-class clinical expertise with next-generation
                            digital health infrastructure to provide seamless patient outcomes.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to={'/appointment/book'} className="bg-[#0F172A] text-white cursor-pointer px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-cyan-600 transition-all flex items-center gap-3">
                                Book Consultation <ArrowRight size={18} />
                            </Link>
                            <button className="border border-slate-200 cursor-pointer px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3">
                                <PhoneCall size={18} /> Emergency
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        {/* Medical Grid Pattern Overlay */}
                        <div className="absolute inset-0 z-10 opacity-10 pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                        <img
                            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000"
                            className="w-full h-[500px] object-cover border-[12px] border-slate-50 shadow-2xl"
                            alt="Modern Hospital Facility"
                        />

                        {/* Floating Credibility Badge */}
                        <div className="absolute -bottom-6 -left-6 bg-cyan-500 text-white p-8 hidden md:block">
                            <Activity size={32} className="mb-4" />
                            <p className="text-3xl font-black">24/7</p>
                            <p className="text-[10px] font-bold tracking-widest uppercase opacity-80">Critical Response</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- MODERN MARQUEE BAR --- */}
            <div className="bg-[#0F172A] border-y border-white/10 py-5 overflow-hidden">
                <motion.div
                    animate={{ x: [0, -1500] }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    className="flex whitespace-nowrap gap-16 text-white/90"
                >
                    {[1, 2, 3].map((i) => (
                        <React.Fragment key={i}>
                            <div className="flex items-center gap-4">
                                <Plus className="text-cyan-400" size={16} />
                                <span className="text-[11px] font-bold tracking-[0.3em] uppercase">Emergency Dept. Active</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Plus className="text-cyan-400" size={16} />
                                <span className="text-[11px] font-bold tracking-[0.3em] uppercase">ISO 9001 Certified</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Plus className="text-cyan-400" size={16} />
                                <span className="text-[11px] font-bold tracking-[0.3em] uppercase">Top Rated Specialists</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Plus className="text-cyan-400" size={16} />
                                <span className="text-[11px] font-bold tracking-[0.3em] uppercase">HIPAA Compliant Data</span>
                            </div>
                        </React.Fragment>
                    ))}
                </motion.div>
            </div>

            {/* --- QUICK STATS SECTION --- */}
            <section className="bg-slate-50 py-20">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm">
                            <ShieldCheck className="text-cyan-600" />
                        </div>
                        <h3 className="text-lg font-bold uppercase tracking-tight">Accredited Excellence</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">Verified by the International Healthcare Commission for surgical and diagnostic precision.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm border-t-2 border-cyan-500">
                            <Clock className="text-cyan-600" />
                        </div>
                        <h3 className="text-lg font-bold uppercase tracking-tight">Zero-Wait Triage</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">Our digital intake system ensures you are seen by a specialist in record time.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-[#0F172A] flex items-center justify-center shadow-sm">
                            <Activity className="text-cyan-400" />
                        </div>
                        <h3 className="text-lg font-bold uppercase tracking-tight">Live Diagnostics</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">Access your lab results and medical history in real-time through our patient portal.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;