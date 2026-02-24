import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, MessageCircle, Calendar, ArrowUpRight, MapPin } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDoctorsThunk } from "../../redux/slices/doctor.slice";

/* ============================
   Doctor Card (Memoized)
============================ */
const DoctorCard = React.memo(({ doc }) => {
    const optimizedImage = doc?.profile?.url
        ? doc.profile.url.replace("/upload/", "/upload/w_400,q_auto,f_auto/")
        : "https://via.placeholder.com/400x400?text=Doctor";

    return (
        <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">

            {/* Image Section */}
            <div className="relative overflow-hidden rounded-4xl h-72 mb-6 bg-gray-100">
                <img
                    src={optimizedImage}
                    alt={`Dr. ${doc.firstName}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                />

                {/* Rating */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-black">{doc.rating || 4.5}</span>
                </div>

                {/* Specialization */}
                <div className="absolute bottom-4 left-4">
                    <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                        {doc.specialization}
                    </span>
                </div>
            </div>

            {/* Info Section */}
            <div className="px-4 pb-4">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 capitalize leading-tight">
                            Dr. {doc.firstName} {doc.lastName}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-400 mt-1">
                            <MapPin size={12} />
                            <span className="text-xs font-bold uppercase tracking-wider">
                                {doc.location}
                            </span>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl text-gray-400 group-hover:text-primary transition-all">
                        <ArrowUpRight size={20} />
                    </div>
                </div>

                {/* Experience & Fees */}
                <div className="flex gap-6 border-y border-gray-50 py-4 my-6">
                    <div className="flex-1">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">
                            Experience
                        </p>
                        <p className="text-sm font-black text-gray-800">
                            {doc.experience} Years
                        </p>
                    </div>
                    <div className="w-px bg-gray-100" />
                    <div className="flex-1 text-right">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">
                            Consultation
                        </p>
                        <p className="text-sm font-black text-primary">
                            ${doc.consultationFees}
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                        <Calendar size={16} /> Book Appointment
                    </button>
                    <button className="p-4 border border-gray-100 rounded-2xl text-gray-400 hover:text-primary hover:bg-primary/5 transition-all">
                        <MessageCircle size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
});

/* ============================
   Main Doctors Component
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
        <div className="min-h-screen bg-[#F4F7FE] pt-16 pb-20 px-6">
            <div className="max-w-7xl mx-auto py-12">

                {/* Header Animation (Lightweight) */}
                <motion.header
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs">
                        Expert Team
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-4">
                        Meet Our Specialists
                    </h1>
                </motion.header>

                {/* Loading State */}
                {loading && (
                    <div className="text-center text-gray-500 font-semibold">
                        Loading doctors...
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