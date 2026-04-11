import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Star,
    MessageCircle,
    Calendar,
    MapPin,
    ShieldCheck,
    User,
    CreditCard,
    Info,
    ChevronRight,
    Phone,
    Mail,
    Clock,
    Award,
    X,
    CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllDoctorsThunk } from "../../redux/slices/doctor.slice";
import { toast } from "react-hot-toast";

// Enhanced Doctor Card Component with Modal
const DoctorCard = React.memo(({ doc, onViewDetails }) => {
    const [imageError, setImageError] = useState(false);

    const optimizedImage = useMemo(() => {
        if (imageError) return "https://via.placeholder.com/400x500?text=Dr.+Profile";
        if (doc?.profile?.url) {
            return doc.profile.url.replace("/upload/", "/upload/w_400,q_auto,f_auto,c_fill,g_face/");
        }
        return "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop";
    }, [doc?.profile?.url, imageError]);

    const handleImageError = () => setImageError(true);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -8 }}
            className="group"
        >
            <div className="bg-white rounded-sm overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-indigo-200 relative">

                {/* Top Gradient Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                {/* Availability Status Banner */}
                <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 bg-emerald-500/90 backdrop-blur-sm px-3 py-1.5 rounded-sm shadow-lg"
                    >
                        <div className="w-2 h-2 bg-white rounded-sm animate-pulse" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                            Available Today
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-sm shadow-lg"
                    >
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-slate-900">
                            {doc?.rating?.toFixed(1) || "4.5"}
                        </span>
                        <span className="text-[10px] text-slate-500">(128)</span>
                    </motion.div>
                </div>

                {/* Profile Image Container */}
                <div className="relative overflow-hidden h-72 bg-linear-to-br from-indigo-50 to-purple-50">
                    <img
                        src={optimizedImage}
                        alt={`Dr. ${doc?.firstName} ${doc?.lastName}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        loading="lazy"
                        onError={handleImageError}
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Specialization Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-4 left-4 right-4"
                    >
                        <div className="bg-indigo-600/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-sm inline-block shadow-lg">
                            {doc?.specialization || "General Medicine"}
                        </div>
                    </motion.div>
                </div>

                {/* Doctor Details */}
                <div className="p-6 space-y-4">
                    <div>
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                                Dr. {doc?.firstName} {doc?.lastName}
                                <div className="flex items-center gap-1 mt-1">
                                    <ShieldCheck size={14} className="text-indigo-500" />
                                    <span className="text-[10px] text-slate-500 font-medium uppercase">
                                        Verified
                                    </span>
                                </div>
                            </h3>
                            <Award size={20} className="text-indigo-400" />
                        </div>

                        <div className="flex items-center gap-2 mt-3 text-slate-500">
                            <MapPin size={14} className="text-indigo-400" />
                            <span className="text-xs font-medium">
                                {doc?.location || "Medical Center"}
                            </span>
                        </div>
                    </div>

                    {/* Professional Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="bg-slate-50 rounded-sm p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <User size={12} className="text-indigo-500" />
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                                    Experience
                                </p>
                            </div>
                            <p className="text-sm font-bold text-slate-800">
                                {doc?.experience || 0}+ Years
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-sm p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <CreditCard size={12} className="text-indigo-500" />
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                                    Consultation
                                </p>
                            </div>
                            <p className="text-sm font-bold text-indigo-600">
                                ₹{doc?.consultationFees?.toLocaleString() || 500}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                        <Link
                            to={`/appointment/book/${doc?._id}`}
                            className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-sm font-bold text-[11px] uppercase tracking-wider hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-xl group/btn"
                        >
                            <Calendar size={14} className="group-hover/btn:rotate-12 transition-transform" />
                            Book Now
                        </Link>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onViewDetails?.(doc)}
                            className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-sm text-slate-500 hover:text-indigo-600 hover:border-indigo-600 transition-all duration-300 bg-white hover:bg-indigo-50"
                        >
                            <Info size={18} />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-sm text-slate-500 hover:text-indigo-600 hover:border-indigo-600 transition-all duration-300 bg-white hover:bg-indigo-50"
                        >
                            <MessageCircle size={18} />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

// Doctor Details Modal Component
const DoctorDetailsModal = ({ doctor, isOpen, onClose }) => {
    if (!doctor) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                            {/* Modal Header */}
                            <div className="relative h-48 bg-linear-to-r from-indigo-600 to-purple-600 rounded-t-2xl">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-sm flex items-center justify-center hover:bg-white/30 transition-all"
                                >
                                    <X size={20} className="text-white" />
                                </button>
                                <div className="absolute bottom-4 left-6">
                                    <h2 className="text-2xl font-bold text-white">
                                        Dr. {doctor.firstName} {doctor.lastName}
                                    </h2>
                                    <p className="text-white/80 text-sm mt-1">
                                        {doctor.specialization || "Medical Specialist"}
                                    </p>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-6">
                                {/* Quick Info Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-sm">
                                        <Award size={20} className="text-indigo-600" />
                                        <div>
                                            <p className="text-xs text-slate-500">Experience</p>
                                            <p className="font-semibold text-slate-800">{doctor.experience || 0}+ Years</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-sm">
                                        <CreditCard size={20} className="text-indigo-600" />
                                        <div>
                                            <p className="text-xs text-slate-500">Consultation Fee</p>
                                            <p className="font-semibold text-indigo-600">₹{doctor.consultationFees?.toLocaleString() || 500}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-sm">
                                        <Clock size={20} className="text-indigo-600" />
                                        <div>
                                            <p className="text-xs text-slate-500">Availability</p>
                                            <p className="font-semibold text-slate-800">Mon - Sat, 9AM - 6PM</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-sm">
                                        <MapPin size={20} className="text-indigo-600" />
                                        <div>
                                            <p className="text-xs text-slate-500">Location</p>
                                            <p className="font-semibold text-slate-800">{doctor.location || "Main Hospital"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* About Section */}
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                        <Info size={18} className="text-indigo-600" />
                                        About Doctor
                                    </h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {doctor.bio || `Dr. ${doctor.firstName} ${doctor.lastName} is a highly qualified medical professional specializing in ${doctor.specialization || "general medicine"}. With over ${doctor.experience || 0} years of experience, they are committed to providing exceptional healthcare services with compassion and expertise.`}
                                    </p>
                                </div>

                                {/* Qualifications */}
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                        <CheckCircle size={18} className="text-indigo-600" />
                                        Qualifications & Expertise
                                    </h3>
                                    <div className="space-y-2">
                                        {doctor.qualifications?.map((qual, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                                <ChevronRight size={14} className="text-indigo-500 mt-0.5" />
                                                <span>{qual}</span>
                                            </div>
                                        )) || (
                                                <>
                                                    <div className="flex items-start gap-2 text-sm text-slate-600">
                                                        <ChevronRight size={14} className="text-indigo-500 mt-0.5" />
                                                        <span>MBBS, MD - General Medicine</span>
                                                    </div>
                                                    <div className="flex items-start gap-2 text-sm text-slate-600">
                                                        <ChevronRight size={14} className="text-indigo-500 mt-0.5" />
                                                        <span>Fellowship in {doctor.specialization || "Cardiology"}</span>
                                                    </div>
                                                </>
                                            )}
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="pt-4 border-t border-slate-100">
                                    <div className="flex gap-3">
                                        <button className="flex-1 bg-indigo-600 text-white py-3 rounded-sm font-semibold text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                                            <Calendar size={16} />
                                            Book Appointment
                                        </button>
                                        <button className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-sm font-semibold text-sm hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                                            <Phone size={16} />
                                            Contact
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

/* ============================
    Main Registry Component
============================ */
const Doctors = () => {
    const dispatch = useDispatch();
    const { doctors, loading } = useSelector((state) => state.doctor);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!doctors || doctors.length === 0) {
            dispatch(getAllDoctorsThunk());
        }
    }, [dispatch]);

    // Filter and search doctors
    const filteredDoctors = useMemo(() => {
        if (!doctors) return [];

        let filtered = [...doctors];

        if (searchTerm) {
            filtered = filtered.filter(doc =>
                `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filter === "high-rated") {
            filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (filter === "experience") {
            filtered = filtered.sort((a, b) => (b.experience || 0) - (a.experience || 0));
        }

        return filtered;
    }, [doctors, searchTerm, filter]);

    const renderedDoctors = useMemo(() => {
        return filteredDoctors.map((doc) => (
            <DoctorCard
                key={doc._id}
                doc={doc}
                onViewDetails={(doctor) => setSelectedDoctor(doctor)}
            />
        ));
    }, [filteredDoctors]);

    const specialties = useMemo(() => {
        if (!doctors) return [];
        const specs = new Set(doctors.map(doc => doc.specialization).filter(Boolean));
        return Array.from(specs);
    }, [doctors]);

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-1 bg-linear-to-r from-indigo-600 to-purple-600 rounded-sm" />
                        <span className="text-indigo-600 font-bold uppercase tracking-[0.2em] text-xs">
                            Expert Medical Team
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
                        Meet Our
                        <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block md:inline-block md:ml-3">
                            Specialists
                        </span>
                    </h1>

                    <p className="text-slate-500 mt-4 text-base max-w-2xl leading-relaxed">
                        Access world-class healthcare professionals committed to your wellbeing.
                        All our doctors are board-certified with years of clinical excellence.
                    </p>
                </motion.div>

                {/* Search and Filter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-10 flex flex-col md:flex-row gap-4"
                >
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by name or specialization..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-5 py-3 rounded-sm border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all outline-none bg-white"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-5 py-3 rounded-sm font-semibold text-sm transition-all ${filter === "all"
                                    ? "bg-indigo-600 text-white shadow-md"
                                    : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter("high-rated")}
                            className={`px-5 py-3 rounded-sm font-semibold text-sm transition-all flex items-center gap-2 ${filter === "high-rated"
                                    ? "bg-indigo-600 text-white shadow-md"
                                    : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"
                                }`}
                        >
                            <Star size={14} />
                            Top Rated
                        </button>
                        <button
                            onClick={() => setFilter("experience")}
                            className={`px-5 py-3 rounded-sm font-semibold text-sm transition-all ${filter === "experience"
                                    ? "bg-indigo-600 text-white shadow-md"
                                    : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"
                                }`}
                        >
                            Most Experienced
                        </button>
                    </div>
                </motion.div>

                {/* Specialties Tags */}
                {specialties.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-8 flex flex-wrap gap-2"
                    >
                        {specialties.slice(0, 6).map((spec, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-xs font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-all cursor-pointer"
                                onClick={() => setSearchTerm(spec)}
                            >
                                {spec}
                            </span>
                        ))}
                    </motion.div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-sm"
                        />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Loading Medical Professionals...
                        </p>
                    </div>
                )}

                {/* Doctors Grid */}
                <AnimatePresence>
                    {!loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {renderedDoctors.length > 0 ? (
                                renderedDoctors
                            ) : (
                                <div className="col-span-full text-center py-20">
                                    <p className="text-slate-400 text-lg">No doctors found matching your criteria.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Doctor Details Modal */}
            <DoctorDetailsModal
                doctor={selectedDoctor}
                isOpen={!!selectedDoctor}
                onClose={() => setSelectedDoctor(null)}
            />
        </div>
    );
};

export default Doctors;