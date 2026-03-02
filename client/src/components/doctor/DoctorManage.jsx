import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Edit3, Trash2, ExternalLink, Plus, Search,
    CheckCircle2, MapPin, Ban, ShieldCheck,
    Download, DollarSign, Building2, Briefcase,
    Phone, Mail, Calendar, ChevronRight, Activity, Filter
} from 'lucide-react';
import { getAllDoctorsThunk } from "../../redux/slices/doctor.slice";
import { Link } from 'react-router-dom';
import { api } from "../../utils/axios";
import { toast } from "react-hot-toast";

const DoctorManage = ({ isEmbedded }) => {
    const dispatch = useDispatch();
    const { doctors, loading } = useSelector((state) => state.doctor);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDept, setSelectedDept] = useState("All");

    useEffect(() => {
        dispatch(getAllDoctorsThunk());
    }, [dispatch]);

    const handleBlockDoctor = async (id, isBlocked) => {
        try {
            await api.put(`/doctor/${id}`, { isBlocked: !isBlocked });
            toast.success(`Doctor ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
            dispatch(getAllDoctorsThunk());
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update status");
        }
    };

    const departments = useMemo(() => {
        if (!doctors) return [];
        return ["All", ...new Set(doctors.map(d => d.specialization))];
    }, [doctors]);

    const filteredDoctors = useMemo(() => {
        if (!doctors) return [];
        return doctors.filter(doc => {
            const fullName = `${doc.firstName} ${doc.lastName}`.toLowerCase();
            const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = selectedDept === "All" || doc.specialization === selectedDept;
            return matchesSearch && matchesDept;
        });
    }, [doctors, searchTerm, selectedDept]);

    return (
        <div className={isEmbedded ? "" : "p-6 md:p-10 bg-[#FBFBFF] min-h-screen pt-24 font-sans"}>
            <div className={`max-w-7xl mx-auto ${isEmbedded ? "" : "space-y-6"}`}>

                {/* --- COMPONENT HEADER --- */}
                {!isEmbedded && (
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Activity size={20} className="text-indigo-600" />
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Personnel Control</span>
                            </div>
                            <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                                Staff <span className="text-indigo-600">Registry</span>
                            </h1>
                            <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-4">
                                Active Nodes: {filteredDoctors.length} / System Capacity: 100%
                            </p>
                        </div>

                        <Link to="/doctor/register" className="flex items-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-indigo-600 transition-all group">
                            <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Provision New Specialist
                        </Link>
                    </div>
                )}

                {/* --- COMMAND BAR --- */}
                {!isEmbedded && (
                    <div className="bg-white p-2 rounded-sm border border-slate-200 mb-10 flex flex-wrap items-center gap-2 shadow-sm">
                        <div className="flex-1 relative min-w-75">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <input
                                type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="SEARCH BY IDENTIFIER, UNIT, OR ZONE..."
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-sm border border-transparent focus:border-indigo-600 focus:bg-white outline-none transition-all text-[11px] font-bold uppercase tracking-wider"
                            />
                        </div>
                        <div className="flex items-center gap-2 px-4 border-l border-slate-100">
                            <Filter size={14} className="text-slate-400" />
                            <select
                                value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}
                                className="py-4 bg-transparent outline-none font-black text-slate-900 text-[10px] uppercase tracking-widest cursor-pointer"
                            >
                                {departments.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>
                )}

                {/* --- DATA GRID --- */}
                <div className="space-y-2">
                    {/* Table Header (Desktop Only) */}
                    <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-8 py-4 bg-slate-100 border border-slate-200 rounded-sm mb-4">
                        <div className="col-span-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Medical Officer</div>
                        <div className="col-span-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Unit Stats</div>
                        <div className="col-span-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Auth Status</div>
                        <div className="col-span-3 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Command</div>
                    </div>

                    {loading ? (
                        <div className="py-32 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-1 text-slate-200 bg-slate-200 overflow-hidden relative">
                                <div className="absolute inset-0 bg-indigo-600 animate-[loading_1.5s_infinite]" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Syncing Personnel Data...</span>
                        </div>
                    ) : (
                        filteredDoctors.map((doc) => (
                            <DoctorManagementRow
                                key={doc._id}
                                doc={doc}
                                onBlock={() => handleBlockDoctor(doc._id, doc.isBlocked)}
                            />
                        ))
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

// --- THE DATA ROW COMPONENT ---
const DoctorManagementRow = ({ doc, onBlock }) => {
    const optimizedImage = doc?.profile?.url
        ? doc.profile.url.replace("/upload/", "/upload/w_200,h_200,c_fill,q_auto,f_auto/")
        : "https://via.placeholder.com/200x200?text=BIO";

    return (
        <div className="bg-white border border-slate-200 p-4 lg:px-8 lg:py-4 rounded-sm hover:border-indigo-600 transition-all group shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6">

                {/* 1. Identity & Profile */}
                <div className="lg:col-span-4 flex items-center gap-6">
                    <div className="relative shrink-0">
                        <img src={optimizedImage} className="w-14 h-14 rounded-sm object-cover grayscale group-hover:grayscale-0 transition-all border border-slate-100" alt="" />
                        <div className={`absolute -top-1 -left-1 w-3 h-3 rounded-full border-2 border-white ${doc.isBlocked ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    </div>
                    <div className="overflow-hidden">
                        <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-tighter truncate">Dr. {doc.firstName} {doc.lastName}</h3>
                        <div className="flex items-center gap-2 text-indigo-600 font-black text-[9px] uppercase tracking-widest mt-1">
                            <Building2 size={12} strokeWidth={3} /> {doc.specialization}
                        </div>
                        <p className="text-slate-400 text-[9px] font-black uppercase mt-1 flex items-center gap-1">
                            <MapPin size={10} /> {doc.location || "STATION_UNSET"}
                        </p>
                    </div>
                </div>

                {/* 2. Professional Metrics */}
                <div className="lg:col-span-2 grid grid-cols-2 lg:flex lg:flex-col gap-2">
                    <div className="flex items-center gap-2 font-black text-slate-700 text-[10px] uppercase">
                        <Briefcase size={12} className="text-slate-400" />
                        <span>{doc.experience}Y_EXP</span>
                    </div>
                    <div className="flex items-center gap-2 font-black text-indigo-600 text-[10px] uppercase">
                        <DollarSign size={12} />
                        <span>{doc.consultationFees}_USD</span>
                    </div>
                </div>

                {/* 3. Security & Validation */}
                <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-sm border ${doc.isVerified ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                        <ShieldCheck size={12} strokeWidth={3} />
                        <span className="text-[8px] font-black uppercase tracking-widest">{doc.isVerified ? "Provisioned" : "Unverified"}</span>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-sm border ${!doc.isBlocked ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${!doc.isBlocked ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-[8px] font-black uppercase tracking-widest">{!doc.isBlocked ? "Operational" : "Offline"}</span>
                    </div>
                </div>

                {/* 4. Command Group */}
                <div className="lg:col-span-3 flex items-center justify-end gap-2">
                    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-sm border border-slate-100">
                        <AdminActionButton icon={<Edit3 size={14} />} title="Edit" hover="hover:text-amber-500 hover:bg-amber-50" />
                        <AdminActionButton icon={<Calendar size={14} />} title="Roster" hover="hover:text-blue-500 hover:bg-blue-50" />
                        {doc.isBlocked ? (
                            <AdminActionButton onClick={onBlock} icon={<ShieldCheck size={14} />} title="Unblock" hover="hover:text-emerald-500 hover:bg-emerald-50" />
                        ) : (
                            <AdminActionButton onClick={onBlock} icon={<Ban size={14} />} title="Block" hover="hover:text-red-500 hover:bg-red-50" />
                        )}
                    </div>
                    <button className="p-3 bg-slate-900 text-white rounded-sm hover:bg-indigo-600 transition-all shadow-md group-hover:translate-x-1">
                        <ChevronRight size={16} strokeWidth={3} />
                    </button>
                </div>

            </div>
        </div>
    );
};

const AdminActionButton = ({ icon, title, hover, onClick }) => (
    <button onClick={onClick} title={title} className={`p-2.5 bg-white text-slate-400 rounded-sm border border-slate-200 transition-all ${hover}`}>
        {icon}
    </button>
);

export default DoctorManage;