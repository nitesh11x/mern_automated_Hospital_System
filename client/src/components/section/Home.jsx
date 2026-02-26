import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle } from "lucide-react";

const Home = () => {
    return (
        <div className="pt-24 min-h-screen bg-[#FAFBFF] overflow-hidden">
            <section className="relative px-6 py-16 lg:py-24 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                            ✨ New Standards in Healthcare
                        </div>

                        <h1 className="text-6xl lg:text-8xl font-black text-gray-900 leading-tight">
                            Better Care, <br />
                            <span className="text-primary tracking-tighter">Simplified.</span>
                        </h1>

                        <p className="text-xl text-gray-500 max-w-md leading-relaxed">
                            Skip the waiting room. Access premium medical consultations and
                            personalized wellness plans with a single tap.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button className="bg-primary cursor-pointer text-white px-10 py-5 rounded-2xl font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                                Book an Appointment
                            </button>
                            <button className="flex items-center cursor-pointer gap-3 px-8 py-5 rounded-2xl font-bold text-gray-900 hover:bg-white border border-gray-100 shadow-sm transition-all">
                                <Play size={18} fill="currentColor" /> Watch Story
                            </button>
                        </div>

                        <div className="flex items-center gap-6 pt-4 text-gray-400">
                            <span className="flex items-center gap-2"><CheckCircle size={18} className="text-primary" /> Top Specialists</span>
                            <span className="flex items-center gap-2"><CheckCircle size={18} className="text-primary" /> Zero Wait Time</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
                        <img
                            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800"
                            //   src="Hospital_logo.png" 
                            alt="Modern Clinic"
                            className="relative rounded-[3rem] shadow-3xl z-10 w-full h-150 object-cover ring-8 ring-white"
                        />
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;