import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Edit3, Ban, ShieldCheck, Plus, Search,
    Building2, Briefcase, DollarSign, MapPin,
    Calendar, ChevronRight, Activity, Filter,
    RefreshCcw, Loader2,
    IndianRupee
} from 'lucide-react';
import { getAllDoctorsThunk } from "../../redux/slices/doctor.slice";
import { Link } from 'react-router-dom';
import { api } from "../../utils/axios";
import { toast } from "react-hot-toast";

const DoctorManage = ({ isEmbedded }) => {
    const dispatch = useDispatch();
    const { doctors = [], loading } = useSelector((state) => state.doctor);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDept, setSelectedDept] = useState("All");

    useEffect(() => {
        dispatch(getAllDoctorsThunk());
    }, [dispatch]);

    const handleBlockDoctor = async (id, isBlocked) => {
        try {
            await api.put(`/doctor/${id}`, { isBlocked: !isBlocked });
            toast.success(`Doctor ${isBlocked ? 'unblocked' : 'blocked'}`);
            dispatch(getAllDoctorsThunk());
        } catch (error) {
            toast.error(error?.response?.data?.message || "Status update failed");
        }
    };

    const departments = useMemo(() => {
        if (!doctors) return [];
        return ["All", ...new Set(doctors.map(d => d.specialization))];
    }, [doctors]);

    const filteredDoctors = useMemo(() => {
        return doctors.filter(doc => {
            const fullName = `${doc.firstName} ${doc.lastName}`.toLowerCase();
            const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = selectedDept === "All" || doc.specialization === selectedDept;
            return matchesSearch && matchesDept;
        });
    }, [doctors, searchTerm, selectedDept]);

    return (
        <div className={`p-4 md:p-8 bg-[#F8FAFC] min-h-screen ${isEmbedded ? '' : 'pt-20'} font-sans text-slate-900`}>
            <div className="max-w-7xl mx-auto">

                {/* COMPACT HEADER */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-800 uppercase italic">Personnel Registry</h1>
                        <p className="text-sm text-slate-500">Manage medical staff and departmental nodes</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={() => dispatch(getAllDoctorsThunk())} className="p-2 hover:bg-white border rounded-sm transition-colors">
                            <RefreshCcw size={16} className="text-slate-600" />
                        </button>
                        <Link to="/doctor/register" className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-indigo-600 transition shadow-sm">
                            <Plus size={14} /> New Specialist
                        </Link>
                    </div>
                </div>

                {/* SLIM FILTER BAR */}
                <div className="bg-white border border-slate-200 rounded-sm p-3 mb-6 flex flex-wrap gap-3 items-center shadow-sm">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search by name or specialization..."
                            className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-sm focus:ring-1 focus:ring-indigo-500 outline-none uppercase font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 px-3 border-l border-slate-100">
                        <Filter size={14} className="text-slate-400" />
                        <select
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer uppercase"
                        >
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>

                {/* TABLE VIEW */}
                <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Officer</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Metrics</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Command</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-10 text-center">
                                        <Loader2 className="animate-spin inline text-indigo-600" />
                                    </td>
                                </tr>
                            ) : filteredDoctors.length > 0 ? (
                                filteredDoctors.map((doc) => (
                                    <tr key={doc._id} className={`hover:bg-slate-50/50 transition-colors group ${doc.isBlocked ? 'opacity-60 bg-slate-50' : ''}`}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <img
                                                        src={doc?.profile?.url?.replace("/upload/", "/upload/w_100,h_100,c_fill/") || "https://via.placeholder.com/100"}
                                                        className="w-10 h-10 rounded-sm object-cover border border-slate-200 grayscale group-hover:grayscale-0 transition-all"
                                                        alt=""
                                                    />
                                                    <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${doc.isBlocked ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-800 uppercase italic">Dr. {doc.firstName} {doc.lastName}</div>
                                                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                                        <MapPin size={10} /> {doc.location || "ZONE_UNSET"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase">
                                                <Building2 size={12} /> {doc.specialization}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-[10px] font-bold space-y-1">
                                                <div className="flex items-center gap-1 text-slate-600">
                                                    <Briefcase size={10} /> {doc.experience}Y_EXP
                                                </div>
                                                <div className="flex items-center gap-1 text-emerald-600">
                                                    <IndianRupee size={10} /> {doc.consultationFees}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm border inline-block w-fit ${doc.isVerified ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                                    {doc.isVerified ? 'PROVISIONED' : 'UNVERIFIED'}
                                                </span>
                                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm border inline-block w-fit ${!doc.isBlocked ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                                                    {!doc.isBlocked ? 'OPERATIONAL' : 'OFFLINE'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button title="Edit" className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-sm transition-all border border-transparent hover:border-amber-100">
                                                    <Edit3 size={14} />
                                                </button>
                                                <button title="Schedule" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-all border border-transparent hover:border-blue-100">
                                                    <Calendar size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleBlockDoctor(doc._id, doc.isBlocked)}
                                                    title={doc.isBlocked ? "Unblock" : "Block"}
                                                    className={`p-1.5 rounded-sm transition-all border border-transparent ${doc.isBlocked
                                                        ? 'text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100'
                                                        : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100'
                                                        }`}
                                                >
                                                    {doc.isBlocked ? <ShieldCheck size={14} /> : <Ban size={14} />}
                                                </button>
                                                <button className="ml-2 p-1.5 bg-slate-900 text-white rounded-sm hover:bg-indigo-600 transition-all">
                                                    <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                                        No Specialist records found in current node
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DoctorManage;