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
    Calendar
} from "lucide-react";
import { getAllPatientThunk } from "../../redux/slices/patient.slice";
import { useDispatch, useSelector } from "react-redux";

const PatientManage = () => {
    const dispatch = useDispatch();
    const { patients, loading } = useSelector((state) => state.patient);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

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
            const matchesSearch =
                patient.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [patients, searchTerm]);

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen pt-24">
            <div className="max-w-7xl mx-auto">

                {/* --- HEADER --- */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mt-12 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-8 h-1 bg-primary rounded-full" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Administration</p>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Patient <span className="text-primary">Registry</span>
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium italic">
                            {filteredPatients.length} records synchronized from central database
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-50 transition shadow-sm">
                            <Filter size={18} /> Filters
                        </button>
                        <button className="flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-2xl shadow-xl shadow-primary/20 font-bold text-sm hover:scale-105 transition">
                            <Plus size={18} /> New Admission
                        </button>
                    </div>
                </div>

                {/* --- SEARCH BAR (GLASS STYLE) --- */}
                <div className="relative mb-10 group">
                    <div className="absolute inset-0 bg-primary/5 blur-xl group-focus-within:bg-primary/10 transition-all rounded-3xl" />
                    <div className="relative bg-white border border-slate-200 p-2 rounded-[2rem] shadow-sm flex items-center gap-2">
                        <div className="pl-4 text-slate-400">
                            <Search size={22} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by ID, Name or Email address..."
                            className="flex-1 py-4 px-2 outline-none text-slate-700 font-medium placeholder:text-slate-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="hidden md:flex items-center gap-2 pr-2">
                            <kbd className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase">Shift + S</kbd>
                        </div>
                    </div>
                </div>

                {/* --- LIST SECTION --- */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 opacity-50">
                                <Activity className="animate-spin text-primary mb-4" size={40} />
                                <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Accessing Secure Records...</p>
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
                                className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200"
                            >
                                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="text-slate-300" size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">No records found</h3>
                                <p className="text-slate-400 text-sm">Try adjusting your search terms</p>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.03 }}
            className="bg-white border border-slate-100 p-4 md:p-6 rounded-[2.5rem] hover:shadow-2xl hover:shadow-slate-200/50 transition-all group"
        >
            <div className="flex flex-col xl:flex-row items-center justify-between gap-6">

                {/* 1. IDENTITY & AVATAR */}
                <div className="flex items-center gap-5 min-w-[300px]">
                    <div className="relative">
                        <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center border border-slate-100 group-hover:bg-primary/5 transition-colors">
                            <User size={28} className="text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 capitalize leading-tight">
                            {patient.firstName} {patient.lastName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-md uppercase tracking-wider">
                                {patient.patientId}
                            </span>
                            <span className="text-xs font-bold text-slate-400">
                                {patient.gender} • {calculateAge(patient.dob)} Yrs
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. CONTACT INFO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:border-x border-slate-100 px-8 flex-1">
                    <div className="flex items-center gap-3 group/item">
                        <div className="p-2 bg-slate-50 rounded-xl group-hover/item:bg-primary/10 transition-colors">
                            <Mail size={16} className="text-slate-400 group-hover/item:text-primary" />
                        </div>
                        <span className="text-sm font-bold text-slate-600 truncate max-w-[150px]">{patient.email}</span>
                    </div>
                    <div className="flex items-center gap-3 group/item">
                        <div className="p-2 bg-slate-50 rounded-xl group-hover/item:bg-primary/10 transition-colors">
                            <Phone size={16} className="text-slate-400 group-hover/item:text-primary" />
                        </div>
                        <span className="text-sm font-bold text-slate-600">{patient.phone}</span>
                    </div>
                </div>

                {/* 3. MANAGEMENT TOOLS */}
                <div className="flex items-center gap-3">
                    {/* Medical History */}
                    <button title="View Medical History" className="p-3 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all">
                        <History size={18} />
                    </button>

                    {/* Prescriptions */}
                    <button title="Prescriptions" className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-2xl transition-all">
                        <FileText size={18} />
                    </button>

                    <div className="w-px h-8 bg-slate-100 mx-1" />

                    {/* Standard Actions */}
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl">
                        <button className="p-2.5 text-slate-400 hover:text-amber-500 hover:bg-white rounded-xl transition-all shadow-sm shadow-transparent hover:shadow-slate-200">
                            <Edit3 size={16} />
                        </button>
                        <button className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm shadow-transparent hover:shadow-slate-200">
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <button className="p-3.5 bg-slate-900 text-white rounded-2xl hover:bg-primary transition-all shadow-lg hover:shadow-primary/30">
                        <ArrowRight size={20} />
                    </button>
                </div>

            </div>
        </motion.div>
    );
};

export default PatientManage;