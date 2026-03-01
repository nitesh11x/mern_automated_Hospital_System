import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Plus,
    Mail,
    Phone,
    Edit3,
    Trash2,
    ArrowRight,
    User,
    History,
    FileText,
    Activity,
    Filter,
    MoreHorizontal,
    Calendar,
    ChevronRight
} from "lucide-react";
import { getAllPatientThunk } from "../../redux/slices/patient.slice";
import { useDispatch, useSelector } from "react-redux";

const PatientManage = () => {
    const dispatch = useDispatch();
    const { patients, loading } = useSelector((state) => state.patient);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(getAllPatientThunk());
    }, [dispatch]);

    const calculateAge = (dob) => {
        if (!dob) return "N/A";
        const birthDate = new Date(dob);
        const diff = Date.now() - birthDate.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    };

    const filteredPatients = useMemo(() => {
        if (!patients) return [];
        return patients.filter((patient) => {
            const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
            const search = searchTerm.toLowerCase();
            return (
                patient.patientId?.toLowerCase().includes(search) ||
                patient.email?.toLowerCase().includes(search) ||
                fullName.includes(search)
            );
        });
    }, [patients, searchTerm]);

    return (
        <div className="p-6 md:p-10 bg-[#FBFBFF] min-h-screen pt-24">
            <div className="max-w-7xl mx-auto">

                {/* --- HEADER --- */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-1 bg-indigo-600 rounded-sm" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Secure Database</p>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
                            Patient <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">Registry</span>
                        </h1>
                        <p className="text-slate-400 mt-2 font-bold text-xs uppercase tracking-widest">
                            {filteredPatients.length} Active clinical records identified
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button className="flex items-center gap-3 bg-white border border-slate-200 text-slate-900 px-6 py-4 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition shadow-sm">
                            <Filter size={14} className="text-indigo-600" /> Advanced Filters
                        </button>
                        <button className="flex items-center gap-3 bg-indigo-600 text-white px-6 py-4 rounded-sm shadow-xl shadow-indigo-100 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition group">
                            <Plus size={14} />
                            <span>New Admission</span>
                        </button>
                    </div>
                </div>

                {/* --- SEARCH BAR (SHARP ARCHITECTURE) --- */}
                <div className="relative mb-12 group">
                    <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-500 opacity-5 group-focus-within:opacity-10 transition-opacity rounded-sm" />
                    <div className="relative bg-white border border-slate-200 p-1 rounded-sm shadow-sm flex items-center">
                        <div className="pl-6 pr-4 text-indigo-400">
                            <Search size={20} strokeWidth={3} />
                        </div>
                        <input
                            type="text"
                            placeholder="QUERY SYSTEM BY ID, NAME, OR METADATA..."
                            className="flex-1 py-5 outline-none text-slate-800 font-black text-xs tracking-widest placeholder:text-slate-300 bg-transparent uppercase"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="hidden md:flex items-center gap-2 pr-4 border-l border-slate-100 ml-4 pl-4">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">System Ready</span>
                        </div>
                    </div>
                </div>

                {/* --- LIST SECTION --- */}
                <div className="space-y-px bg-slate-200 border border-slate-200 rounded-sm overflow-hidden shadow-2xl shadow-indigo-100/20">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 bg-white">
                                <Activity className="animate-spin text-indigo-600 mb-6" size={32} />
                                <p className="font-black text-slate-400 uppercase tracking-[0.4em] text-[10px]">Decrypting Secure Records...</p>
                            </div>
                        ) : filteredPatients.length > 0 ? (
                            filteredPatients.map((patient, index) => (
                                <PatientRow
                                    key={patient._id}
                                    patient={patient}
                                    index={index}
                                    calculateAge={calculateAge}
                                />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-32 text-center bg-white"
                            >
                                <Search className="text-slate-200 mx-auto mb-6" size={48} />
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Null Result</h3>
                                <p className="text-slate-400 text-[10px] uppercase mt-2 tracking-tighter">Adjust parameters and re-query</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENT: PATIENT ROW ---
const PatientRow = ({ patient, index, calculateAge }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: index * 0.02 }}
            className="bg-white p-5 md:p-7 flex flex-col xl:flex-row items-center justify-between gap-8 group hover:bg-slate-50 transition-all cursor-default"
        >
            {/* 1. IDENTITY */}
            <div className="flex items-center gap-6 min-w-[320px]">
                <div className="relative">
                    <div className="w-16 h-16 bg-slate-100 rounded-sm flex items-center justify-center border border-slate-200 group-hover:border-indigo-300 group-hover:bg-indigo-50 transition-all overflow-hidden">
                        <User size={24} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-sm" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter group-hover:text-indigo-700 transition-colors leading-none mb-2">
                        {patient.firstName} {patient.lastName}
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-sm border border-indigo-100 uppercase tracking-widest">
                            {patient.patientId}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            {patient.gender} // {calculateAge(patient.dob)} Yrs
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. CONTACT METADATA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 flex-1 xl:px-12 xl:border-x border-slate-100">
                <div className="flex items-center gap-3 group/info">
                    <Mail size={14} className="text-slate-300 group-hover/info:text-purple-500 transition-colors" />
                    <span className="text-[11px] font-bold text-slate-600 lowercase tracking-tight truncate max-w-45">
                        {patient.email}
                    </span>
                </div>
                <div className="flex items-center gap-3 group/info">
                    <Phone size={14} className="text-slate-300 group-hover/info:text-indigo-500 transition-colors" />
                    <span className="text-[11px] font-bold text-slate-600 tracking-tighter">
                        {patient.phone}
                    </span>
                </div>
            </div>

            {/* 3. CONTROL PANEL */}
            <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 p-1 rounded-sm gap-1">
                    <button title="History" className="p-2.5 bg-white text-slate-400 hover:text-indigo-600 hover:shadow-sm transition-all rounded-sm border border-transparent hover:border-slate-200">
                        <History size={16} />
                    </button>
                    <button title="Reports" className="p-2.5 bg-white text-slate-400 hover:text-purple-600 hover:shadow-sm transition-all rounded-sm border border-transparent hover:border-slate-200">
                        <FileText size={16} />
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    <button title="Edit" className="p-2.5 bg-white text-slate-400 hover:text-amber-600 hover:shadow-sm transition-all rounded-sm border border-transparent hover:border-slate-200">
                        <Edit3 size={16} />
                    </button>
                    <button title="Archive" className="p-2.5 bg-white text-slate-400 hover:text-red-600 hover:shadow-sm transition-all rounded-sm border border-transparent hover:border-slate-200">
                        <Trash2 size={16} />
                    </button>
                </div>

                <button className="p-3.5 bg-slate-900 text-white rounded-sm hover:bg-indigo-600 transition-all group/btn shadow-lg shadow-slate-200">
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
};

export default PatientManage;