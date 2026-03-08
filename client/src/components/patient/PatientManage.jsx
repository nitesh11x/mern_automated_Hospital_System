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
    Loader2,
    ShieldCheck,
    RefreshCcw,
    ChevronRight
} from "lucide-react";
import { getAllPatientThunk } from "../../redux/slices/patient.slice";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../utils/axios";
import { toast } from "react-hot-toast";

const PatientManage = ({ isEmbedded }) => {
    const dispatch = useDispatch();
    const { patients = [], loading } = useSelector((state) => state.patient);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(getAllPatientThunk());
    }, [dispatch]);

    const handleBlockPatient = async (id, isBlocked) => {
        try {
            await api.put(`/patient/status/${id}`, { isBlocked: !isBlocked });
            toast.success(`Patient ${isBlocked ? 'unblocked' : 'blocked'}`);
            dispatch(getAllPatientThunk());
        } catch (error) {
            toast.error(error?.response?.data?.message || "Update failed");
        }
    };

    const calculateAge = (dob) => {
        if (!dob) return "N/A";
        const birthDate = new Date(dob);
        const diff = Date.now() - birthDate.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    };

    const filteredPatients = useMemo(() => {
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
        <div className={`p-4 md:p-8 bg-[#F8FAFC] min-h-screen ${isEmbedded ? '' : 'pt-20'} font-sans text-slate-900`}>
            <div className="max-w-7xl mx-auto">

                {/* COMPACT HEADER */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Patient Database</h1>
                        <p className="text-sm text-slate-500">View and manage registered medical profiles</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={() => dispatch(getAllPatientThunk())} className="p-2 hover:bg-white border rounded-sm transition-colors">
                            <RefreshCcw size={16} className="text-slate-600" />
                        </button>
                        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition shadow-sm">
                            <Plus size={14} /> Add Patient
                        </button>
                    </div>
                </div>

                {/* SLIM FILTER BAR */}
                <div className="bg-white border border-slate-200 rounded-sm p-3 mb-6 flex flex-wrap gap-3 items-center shadow-sm">
                    <div className="relative flex-1 min-w-75">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search by ID, Name or Email..."
                            className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:block px-2">
                        {filteredPatients.length} Records Found
                    </div>
                </div>

                {/* TABLE VIEW */}
                <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID / Age</th>
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-10 text-center">
                                        <Loader2 className="animate-spin inline text-indigo-600" />
                                    </td>
                                </tr>
                            ) : filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => (
                                    <tr key={patient._id} className={`hover:bg-slate-50/50 transition-colors group ${patient.isBlocked ? 'opacity-60 bg-slate-50' : ''}`}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-sm bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">
                                                    {patient.firstName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-slate-700">{patient.firstName} {patient.lastName}</div>
                                                    <div className="text-[10px] text-slate-400 uppercase">{patient.gender}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-xs text-slate-600 space-y-1">
                                                <div className="flex items-center gap-1"><Mail size={10} /> {patient.email}</div>
                                                <div className="flex items-center gap-1 text-slate-400"><Phone size={10} /> {patient.phone}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-xs">
                                                <div className="font-mono text-indigo-600 font-bold">{patient.patientId}</div>
                                                <div className="text-slate-500">{calculateAge(patient.dob)} Years</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm border ${patient.isBlocked
                                                    ? 'bg-rose-50 text-rose-600 border-rose-100'
                                                    : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                {patient.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button title="Medical Records" className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-sm transition-all">
                                                    <FileText size={14} />
                                                </button>
                                                <button title="Edit Profile" className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-sm transition-all">
                                                    <Edit3 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleBlockPatient(patient._id, patient.isBlocked)}
                                                    title={patient.isBlocked ? "Unblock" : "Block"}
                                                    className={`p-1.5 rounded-sm transition-all ${patient.isBlocked
                                                            ? 'text-emerald-600 hover:bg-emerald-50'
                                                            : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                                        }`}
                                                >
                                                    {patient.isBlocked ? <ShieldCheck size={14} /> : <Trash2 size={14} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-slate-400 text-sm">
                                        No patient records found matching your search.
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

export default PatientManage;