import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, MessageCircle, Calendar, ArrowUpRight, MapPin, ShieldCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDoctorsThunk } from "../../redux/slices/doctor.slice";

/* ============================
    Doctor Dossier Card (Memoized)
============================ */
const DoctorCard = React.memo(({ doc }) => {
    const optimizedImage = doc?.profile?.url
        ? doc.profile.url.replace("/upload/", "/upload/w_400,q_auto,f_auto/")
        : "https://via.placeholder.com/400x400?text=Medical+Officer";

    return (
        <div className="bg-white rounded-sm p-5 shadow-sm border border-slate-200 hover:border-indigo-600 transition-all duration-300 group relative">

            {/* Header / Status */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Status: Active</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-sm border border-slate-100">
                    <Star size={10} className="text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-black text-slate-900">{doc.rating || 4.5}</span>
                </div>
            </div>

            {/* Image Section */}
            <div className="relative overflow-hidden rounded-sm h-64 mb-6 bg-slate-100 border border-slate-100">
                <img
                    src={optimizedImage}
                    alt={`Medical Officer ${doc.firstName}`}
                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Tactical Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-slate-900/80 to-transparent">
                    <span className="bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1.5 rounded-sm">
                        {doc.specialization}
                    </span>
                </div>
            </div>

            {/* Info Section */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter leading-none flex items-center gap-2">
                        Dr. {doc.firstName} {doc.lastName}
                        <ShieldCheck size={16} className="text-indigo-600" />
                    </h3>
                    <div className="flex items-center gap-1 text-slate-400 mt-2">
                        <MapPin size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            Station: {doc.location}
                        </span>
                    </div>
                </div>

                {/* Metrics Table */}
                <div className="grid grid-cols-2 border border-slate-100 divide-x divide-slate-100">
                    <div className="p-3 bg-slate-50/50">
                        <p className="text-[8px] text-slate-400 font-black uppercase tracking-tighter mb-1">
                            Experience
                        </p>
                        <p className="text-xs font-black text-slate-800 uppercase">
                            {doc.experience} YRS_EXP
                        </p>
                    </div>
                    <div className="p-3 bg-slate-50/50">
                        <p className="text-[8px] text-slate-400 font-black uppercase tracking-tighter mb-1">
                            Unit Fee
                        </p>
                        <p className="text-xs font-black text-indigo-600 uppercase">
                            ${doc.consultationFees} USD
                        </p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-2 pt-2">
                    <button className="flex-1 bg-slate-900 text-white py-4 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
                        <Calendar size={14} /> Schedule Sync
                    </button>
                    <button className="px-4 border border-slate-200 rounded-sm text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
                        <MessageCircle size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
});

/* ============================
    Main Registry Component
============================ */
const Doctors = () => {
    const dispatch = useDispatch();
    const { doctors, loading } = useSelector((state) => state.doctor);

    useEffect(() => {
        if (!doctors || doctors.length === 0) {
            dispatch(getAllDoctorsThunk());
        }
    }, [dispatch, doctors]);

    const renderedDoctors = useMemo(() => {
        if (!doctors) return null;
        return doctors.map((doc) => (
            <DoctorCard key={doc._id} doc={doc} />
        ));
    }, [doctors]);

    return (
        <div className="min-h-screen bg-[#FBFBFF] pt-16 pb-20 px-6">
            <div className="max-w-7xl mx-auto py-12">

                {/* System Header */}
                <motion.header
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-20"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-12 h-1 bg-indigo-600" />
                        <span className="text-indigo-600 font-black uppercase tracking-[0.4em] text-[10px]">
                            Medical Registry v3.0
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                        Verified <br />
                        <span className="text-indigo-600">Specialists</span>
                    </h1>
                </motion.header>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 animate-spin rounded-full" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Secure Database...</p>
                    </div>
                )}

                {/* Doctors Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {!loading && renderedDoctors}
                </div>
            </div>
        </div>
    );
};

export default Doctors;