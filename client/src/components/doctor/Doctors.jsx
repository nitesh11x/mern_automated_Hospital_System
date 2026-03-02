import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
    Star,
    MessageCircle,
    Calendar,
    MapPin,
    ShieldCheck,
    User,
    CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllDoctorsThunk } from "../../redux/slices/doctor.slice";


const DoctorCard = React.memo(({ doc }) => {
    const optimizedImage = doc?.profile?.url
        ? doc.profile.url.replace("/upload/", "/upload/w_400,q_auto,f_auto/")
        : "https://via.placeholder.com/400x400?text=Medical+Officer";

    return (
        <div className="bg-white rounded-sm p-6 shadow-sm border border-slate-200 hover:border-indigo-600 transition-all duration-300 group relative flex flex-col h-full">

            {/* Availability Status */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Available Today
                    </span>
                </div>

                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-sm border border-slate-100">
                    <Star size={10} className="text-amber-500 fill-amber-500" />
                    <span className="text-[11px] font-bold text-slate-900">
                        {doc?.rating || 4.5}
                    </span>
                </div>
            </div>

            {/* Profile Image */}
            <div className="relative overflow-hidden rounded-sm h-72 mb-6 bg-slate-50 border border-slate-100">
                <img
                    src={optimizedImage}
                    alt={`Dr. ${doc?.firstName}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />

                {/* Specialization Badge */}
                <div className="absolute top-4 left-4">
                    <span className="bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-lg">
                        {doc?.specialization || "General"}
                    </span>
                </div>
            </div>

            {/* Doctor Details */}
            <div className="flex-1 space-y-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        Dr. {doc?.firstName} {doc?.lastName}
                        <ShieldCheck size={18} className="text-indigo-600" />
                    </h3>

                    <div className="flex items-center gap-1.5 text-slate-400 mt-2">
                        <MapPin size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                            Department: {doc?.location || "General Medicine"}
                        </span>
                    </div>
                </div>

                {/* Professional Metrics */}
                <div className="grid grid-cols-2 border-y border-slate-100 divide-x divide-slate-100">
                    <div className="py-3 pr-2">
                        <div className="flex items-center gap-2 mb-1">
                            <User size={12} className="text-slate-400" />
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
                                Experience
                            </p>
                        </div>
                        <p className="text-xs font-bold text-slate-800 uppercase">
                            {doc?.experience || 0} Years
                        </p>
                    </div>

                    <div className="py-3 pl-4">
                        <div className="flex items-center gap-2 mb-1">
                            <CreditCard size={12} className="text-slate-400" />
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
                                Consultation
                            </p>
                        </div>
                        <p className="text-xs font-bold text-indigo-600 uppercase">
                            ₹{doc?.consultationFees || 0}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                    <Link
                        to={`/appointment/book/${doc?._id}`}   
                        className="flex-1 bg-indigo-600 text-white py-4 rounded-sm font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
                    >
                        <Calendar size={14} />
                        Book Appointment
                    </Link>

                    <button className="px-5 border border-slate-200 rounded-sm text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all bg-white">
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
    }, [dispatch]);

    const renderedDoctors = useMemo(() => {
        if (!doctors) return null;

        return doctors.map((doc) => (
            <DoctorCard key={doc._id} doc={doc} />
        ));
    }, [doctors]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-12 px-6 font-sans">
            <div className="max-w-7xl mx-auto py-12">

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-1 bg-indigo-600" />
                        <span className="text-indigo-600 font-bold uppercase tracking-[0.3em] text-[10px]">
                            Hospital Medical Staff
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 uppercase tracking-tight leading-none">
                        Medical <span className="text-indigo-600">Specialists</span>
                    </h1>

                    <p className="text-slate-500 mt-4 text-sm font-medium max-w-2xl">
                        Browse our directory of verified healthcare professionals.
                        All doctors are vetted for credentials and institutional compliance.
                    </p>
                </motion.header>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 animate-spin rounded-full" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Loading Personnel Data...
                        </p>
                    </div>
                )}

                {/* Doctors Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {!loading && renderedDoctors}
                </div>
            </div>
        </div>
    );
};

export default Doctors;