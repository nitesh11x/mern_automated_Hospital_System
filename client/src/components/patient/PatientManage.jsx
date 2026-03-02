import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Plus,
    Mail,
    Phone,
    Edit3,
    Trash2,
    User,
    History,
    FileText,
    Activity,
    Filter,
    ChevronRight,
    ShieldCheck,
    Database
} from "lucide-react";
import { getAllPatientThunk } from "../../redux/slices/patient.slice";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../utils/axios";
import { toast } from "react-hot-toast";

const PatientManage = ({ isEmbedded }) => {
    const dispatch = useDispatch();
    const { patients, loading } = useSelector((state) => state.patient);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(getAllPatientThunk());
    }, [dispatch]);

    const handleBlockPatient = async (id, isBlocked) => {
        try {
            await api.put(`/patient/status/${id}`, { isBlocked: !isBlocked });
            toast.success(`Patient ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
            dispatch(getAllPatientThunk());
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update status");
        }
    };

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
        <div className={isEmbedded ? "" : "p-6 md:p-10 bg-slate-50 min-h-screen pt-24 font-sans"}>
            <div className={`max-w-7xl mx-auto ${isEmbedded ? "" : "space-y-6"}`}>

                {/* --- HEADER --- */}
                {!isEmbedded && (
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck size={16} className="text-indigo-600" />
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Clinical Directory</p>
                            </div>
                            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight uppercase">
                                Patient <span className="text-indigo-600">Records</span>
                            </h1>
                            <p className="text-slate-400 mt-2 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                <Database size={12} /> {filteredPatients.length} Verified medical profiles active
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex items-center gap-3 bg-white border border-slate-200 text-slate-700 px-6 py-4 rounded-sm font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition shadow-sm">
                                <Filter size={14} className="text-indigo-600" /> Advanced Filters
                            </button>
                            <button className="flex items-center gap-3 bg-indigo-600 text-white px-6 py-4 rounded-sm shadow-lg shadow-indigo-100 font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition">
                                <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Register Patient
                            </button>
                        </div>
                    </div>
                )}

                {/* --- FILTER & SEARCH BAR --- */}
                {!isEmbedded && (
                    <div className="relative mb-12">
                        <div className="relative bg-white border border-slate-200 p-1 rounded-sm shadow-sm flex items-center focus-within:border-indigo-600 transition-colors">
                            <div className="pl-6 pr-4 text-slate-300">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="SEARCH BY PATIENT ID, NAME, OR EMAIL..."
                                className="flex-1 py-5 outline-none text-slate-800 font-bold text-xs tracking-widest placeholder:text-slate-300 bg-transparent uppercase"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="hidden md:flex items-center gap-2 pr-6 border-l border-slate-100 ml-4 pl-6">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Database Linked</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- LIST SECTION --- */}
                <div className="space-y-px bg-slate-200 border border-slate-200 rounded-sm overflow-hidden shadow-sm">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 bg-white">
                                <Activity className="animate-spin text-indigo-600 mb-6" size={32} />
                                <p className="font-bold text-slate-400 uppercase tracking-[0.2em] text-[10px]">Accessing Medical Archives...</p>
                            </div>
                        ) : filteredPatients.length > 0 ? (
                            filteredPatients.map((patient, index) => (
                                <PatientRow
                                    key={patient._id}
                                    patient={patient}
                                    index={index}
                                    calculateAge={calculateAge}
                                    onBlock={() => handleBlockPatient(patient._id, patient.isBlocked)}
                                />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-32 text-center bg-white"
                            >
                                <Search className="text-slate-100 mx-auto mb-6" size={48} />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">No Records Found</h3>
                                <p className="text-slate-400 text-[10px] uppercase mt-2 tracking-widest font-medium">Verify your search parameters and try again</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENT: PATIENT ROW ---
const PatientRow = ({ patient, index, calculateAge, onBlock }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: index * 0.01 }}
            className={`bg-white p-5 md:p-7 flex flex-col xl:flex-row items-center justify-between gap-8 group hover:bg-slate-50 transition-all cursor-default ${patient.isBlocked ? 'opacity-50' : ''}`}
        >
            {/* 1. IDENTITY & PROFILE */}
            <div className="flex items-center gap-6 min-w-[320px]">
                <div className="relative">
                    <div className="w-16 h-16 bg-slate-50 rounded-sm flex items-center justify-center border border-slate-200 group-hover:border-indigo-200 group-hover:bg-white transition-all">
                        <User size={24} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-sm ${patient.isBlocked ? 'bg-red-600' : 'bg-indigo-600'}`} />
                </div>
                <div>
                    <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors leading-none mb-2">
                        {patient.firstName} {patient.lastName}
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm border border-indigo-100 uppercase tracking-widest">
                            {patient.patientId}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {patient.gender} • {calculateAge(patient.dob)} Years
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. CONTACT INFORMATION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 flex-1 xl:px-12 xl:border-x border-slate-100">
                <div className="flex items-center gap-3">
                    <Mail size={14} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    <span className="text-[11px] font-bold text-slate-600 lowercase truncate max-w-45">
                        {patient.email}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <Phone size={14} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    <span className="text-[11px] font-bold text-slate-600 tracking-tight">
                        {patient.phone}
                    </span>
                </div>
            </div>

            {/* 3. MANAGEMENT CONTROLS */}
            <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-50 p-1 rounded-sm gap-1 border border-slate-100">
                    <button title="Consultation History" className="p-2.5 bg-white text-slate-400 hover:text-indigo-600 hover:shadow-sm transition-all rounded-sm border border-slate-200">
                        <History size={16} />
                    </button>
                    <button title="Medical Reports" className="p-2.5 bg-white text-slate-400 hover:text-indigo-600 hover:shadow-sm transition-all rounded-sm border border-slate-200">
                        <FileText size={16} />
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    <button title="Edit Profile" className="p-2.5 bg-white text-slate-400 hover:text-amber-600 hover:shadow-sm transition-all rounded-sm border border-slate-200">
                        <Edit3 size={16} />
                    </button>
                    {patient.isBlocked ? (
                        <button onClick={onBlock} title="Unblock Patient" className="p-2.5 bg-white text-emerald-600 hover:text-emerald-700 hover:shadow-sm transition-all rounded-sm border border-emerald-200 bg-emerald-50">
                            <ShieldCheck size={16} />
                        </button>
                    ) : (
                        <button onClick={onBlock} title="Block Patient" className="p-2.5 bg-white text-slate-400 hover:text-rose-600 hover:shadow-sm transition-all rounded-sm border border-slate-200">
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>

                <button className="p-3.5 bg-slate-900 text-white rounded-sm hover:bg-indigo-600 transition-all shadow-md">
                    <ChevronRight size={20} />
                </button>
            </div>
        </motion.div>
    );
};

export default PatientManage;