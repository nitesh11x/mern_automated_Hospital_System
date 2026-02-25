import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Edit3, Trash2, ExternalLink, Plus, Search,
    CheckCircle2, MapPin, Ban, ShieldCheck,
    Download, DollarSign, Building2, Briefcase,
    Phone, Mail, Calendar, ChevronRight
} from 'lucide-react';
import { getAllDoctorsThunk } from "../../redux/slices/doctor.slice";
import { Link } from 'react-router-dom';

const DoctorManage = () => {
    const dispatch = useDispatch();
    const { doctors, loading } = useSelector((state) => state.doctor);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDept, setSelectedDept] = useState("All");

    useEffect(() => {
        dispatch(getAllDoctorsThunk());
    }, [dispatch]);

    const departments = useMemo(() => {
        if (!doctors) return [];
        return ["All", ...new Set(doctors.map(d => d.specialization))];
    }, [doctors]);

    const filteredDoctors = useMemo(() => {
        if (!doctors) return [];
        return doctors.filter(doc => {
            const matchesSearch = `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = selectedDept === "All" || doc.specialization === selectedDept;
            return matchesSearch && matchesDept;
        });
    }, [doctors, searchTerm, selectedDept]);

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen pt-24">
            <div className="max-w-7xl mx-auto">

                {/* --- HEADER --- */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-4 mt-12">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Management</h1>
                        <p className="text-slate-500 font-medium">Control and monitor {filteredDoctors.length} medical professionals</p>
                    </div>
                    <Link to="/doctor/register" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                        <Plus size={18} /> Add New Specialist
                    </Link>
                </div>

                {/* --- FILTER BAR --- */}
                <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 flex flex-wrap gap-4 shadow-sm">
                    <div className="flex-1 relative min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, ID or location..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                        />
                    </div>
                    <select
                        value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}
                        className="px-6 py-3 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-600 text-sm cursor-pointer"
                    >
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>

                {/* --- DOCTOR ROWS --- */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="py-20 text-center font-bold text-slate-400 animate-pulse">Synchronizing Staff Records...</div>
                    ) : (
                        filteredDoctors.map((doc) => (
                            <DoctorManagementRow key={doc._id} doc={doc} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// --- THE SINGLE ROW COMPONENT ---
const DoctorManagementRow = ({ doc }) => {
    const optimizedImage = doc?.profile?.url
        ? doc.profile.url.replace("/upload/", "/upload/w_200,h_200,c_fill,q_auto,f_auto/")
        : "https://via.placeholder.com/200x200?text=Doc";

    return (
        <div className="bg-white border border-slate-100 p-4 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

                {/* 1. Identity Block */}
                <div className="flex items-center gap-5 min-w-[280px]">
                    <div className="relative">
                        <img src={optimizedImage} className="w-16 h-16 rounded-2xl object-cover shadow-md" alt="" />
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${doc.isBlocked ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-slate-900 capitalize">Dr. {doc.firstName} {doc.lastName}</h3>
                        <div className="flex items-center gap-1.5 text-primary font-black text-[10px] uppercase tracking-widest mt-0.5">
                            <Building2 size={12} /> {doc.specialization}
                        </div>
                        <p className="text-slate-400 text-[10px] font-bold mt-1 flex items-center gap-1">
                            <MapPin size={10} /> {doc.location || "Clinical Branch A"}
                        </p>
                    </div>
                </div>

                {/* 2. Professional Stats Block */}
                <div className="grid grid-cols-2 gap-8 px-6 border-x border-slate-50">
                    <div className="text-center lg:text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Experience</p>
                        <div className="flex items-center gap-2 font-black text-slate-700">
                            <Briefcase size={14} className="text-primary" />
                            <span>{doc.experience} Years</span>
                        </div>
                    </div>
                    <div className="text-center lg:text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Consultation</p>
                        <div className="flex items-center gap-2 font-black text-emerald-600">
                            <DollarSign size={14} />
                            <span>${doc.consultationFees}</span>
                        </div>
                    </div>
                </div>

                {/* 3. Status & Verification */}
                <div className="flex flex-col gap-2 min-w-[140px]">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${doc.isVerified ? 'bg-blue-50 border-blue-100 text-primary' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                        <ShieldCheck size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{doc.isVerified ? "Verified" : "Pending"}</span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${!doc.isBlocked ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${!doc.isBlocked ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{!doc.isBlocked ? "Active" : "Blocked"}</span>
                    </div>
                </div>

                {/* 4. Action Button Group */}
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl">
                    <AdminActionButton icon={<Edit3 size={16} />} title="Edit" hover="hover:text-amber-500" />
                    <AdminActionButton icon={<Calendar size={16} />} title="Schedule" hover="hover:text-blue-500" />
                    <AdminActionButton icon={<Ban size={16} />} title="Restrict" hover="hover:text-red-500" />
                    <div className="w-px h-6 bg-slate-200 mx-1" />
                    <button className="p-3 bg-slate-900 text-white rounded-xl hover:scale-110 transition-transform shadow-lg shadow-slate-200">
                        <ChevronRight size={18} />
                    </button>
                </div>

            </div>
        </div>
    );
};

const AdminActionButton = ({ icon, title, hover }) => (
    <button title={title} className={`p-3 bg-white text-slate-400 rounded-xl border border-slate-100 transition-all shadow-sm ${hover} hover:border-current`}>
        {icon}
    </button>
);

export default DoctorManage;