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
    ChevronRight,
    Calendar,
    MapPin,
    Heart,
    Activity,
    UserCheck,
    UserX,
    Eye,
    MoreVertical,
    CheckCircle,
    XCircle,
    AlertCircle
} from "lucide-react";
import { getAllPatientThunk } from "../../redux/slices/patient.slice";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../utils/axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const PatientManage = ({ isEmbedded }) => {
    const dispatch = useDispatch();
    const { patients = [], loading } = useSelector((state) => state.patient);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [selectedGender, setSelectedGender] = useState("All");

    useEffect(() => {
        dispatch(getAllPatientThunk());
    }, [dispatch]);

    const handleBlockPatient = async (id, isBlocked) => {
        try {
            await api.put(`/patient/status/${id}`, { isBlocked: !isBlocked });
            toast.success(`Patient ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
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

    const getBloodGroupBadge = (bloodGroup) => {
        if (!bloodGroup) return null;
        const colors = {
            'A+': 'bg-green-100 text-green-700 border-green-200',
            'A-': 'bg-green-50 text-green-600 border-green-100',
            'B+': 'bg-blue-100 text-blue-700 border-blue-200',
            'B-': 'bg-blue-50 text-blue-600 border-blue-100',
            'O+': 'bg-purple-100 text-purple-700 border-purple-200',
            'O-': 'bg-purple-50 text-purple-600 border-purple-100',
            'AB+': 'bg-amber-100 text-amber-700 border-amber-200',
            'AB-': 'bg-amber-50 text-amber-600 border-amber-100',
        };
        return (
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${colors[bloodGroup] || 'bg-gray-100 text-gray-600'}`}>
                {bloodGroup}
            </span>
        );
    };

    const filteredPatients = useMemo(() => {
        return patients.filter((patient) => {
            const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
            const search = searchTerm.toLowerCase();
            const matchesSearch = (
                patient.patientId?.toLowerCase().includes(search) ||
                patient.email?.toLowerCase().includes(search) ||
                fullName.includes(search) ||
                patient.phone?.includes(search)
            );
            const matchesStatus = selectedStatus === "All" ||
                (selectedStatus === "Active" && !patient.isBlocked) ||
                (selectedStatus === "Blocked" && patient.isBlocked);
            const matchesGender = selectedGender === "All" || patient.gender === selectedGender;
            return matchesSearch && matchesStatus && matchesGender;
        });
    }, [patients, searchTerm, selectedStatus, selectedGender]);

    const stats = useMemo(() => ({
        total: patients.length,
        active: patients.filter(p => !p.isBlocked).length,
        blocked: patients.filter(p => p.isBlocked).length,
        male: patients.filter(p => p.gender === 'Male').length,
        female: patients.filter(p => p.gender === 'Female').length,
        other: patients.filter(p => p.gender === 'Other').length,
    }), [patients]);

    return (
        <div className={`p-4 md:p-8 bg-linear-to-br from-purple-50 via-white to-indigo-50 min-h-screen ${isEmbedded ? '' : 'pt-20'} font-sans`}>
            <div className="max-w-full mx-auto">

                {/* HEADER WITH STATS */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>

                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => dispatch(getAllPatientThunk())}
                                className="p-2.5 bg-white border border-purple-200 rounded-sm hover:border-purple-400 hover:shadow-md transition-all group"
                                title="Refresh"
                            >
                                <RefreshCcw size={18} className="text-purple-500 group-hover:rotate-180 transition-transform duration-500" />
                            </button>
                            <button className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-md">
                                <Plus size={16} /> Register Patient
                            </button>
                        </div>
                    </div>

                    {/* STATISTICS CARDS */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                        <div className="bg-white rounded-sm border border-purple-100 p-4 shadow-sm hover:shadow-md transition-all">
                            <p className="text-[10px] font-bold text-purple-500 uppercase">Total Patients</p>
                            <p className="text-2xl font-black text-gray-800">{stats.total}</p>
                        </div>
                        <div className="bg-white rounded-sm border border-purple-100 p-4 shadow-sm">
                            <p className="text-[10px] font-bold text-emerald-500 uppercase">Active</p>
                            <p className="text-2xl font-black text-emerald-600">{stats.active}</p>
                        </div>
                        <div className="bg-white rounded-sm border border-purple-100 p-4 shadow-sm">
                            <p className="text-[10px] font-bold text-rose-500 uppercase">Blocked</p>
                            <p className="text-2xl font-black text-rose-600">{stats.blocked}</p>
                        </div>
                        <div className="bg-white rounded-sm border border-purple-100 p-4 shadow-sm">
                            <p className="text-[10px] font-bold text-blue-500 uppercase">Male</p>
                            <p className="text-2xl font-black text-blue-600">{stats.male}</p>
                        </div>
                        <div className="bg-white rounded-sm border border-purple-100 p-4 shadow-sm">
                            <p className="text-[10px] font-bold text-pink-500 uppercase">Female</p>
                            <p className="text-2xl font-black text-pink-600">{stats.female}</p>
                        </div>
                        <div className="bg-white rounded-sm border border-purple-100 p-4 shadow-sm">
                            <p className="text-[10px] font-bold text-purple-500 uppercase">Other</p>
                            <p className="text-2xl font-black text-purple-600">{stats.other}</p>
                        </div>
                    </div>
                </div>

                {/* ADVANCED FILTER BAR */}
                <div className="bg-white rounded-sm border border-purple-100 p-5 mb-2 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by ID, name, email, or phone..."
                                className="w-full pl-10 pr-3 py-2.5 text-sm border border-purple-200 rounded-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-purple-50/30"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-sm border border-purple-200">
                            <Activity size={14} className="text-purple-500" />
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="flex-1 text-xs font-semibold text-purple-700 bg-transparent outline-none cursor-pointer"
                            >
                                <option value="All">ALL STATUS</option>
                                <option value="Active">ACTIVE</option>
                                <option value="Blocked">BLOCKED</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-sm border border-purple-200">
                            <User size={14} className="text-purple-500" />
                            <select
                                value={selectedGender}
                                onChange={(e) => setSelectedGender(e.target.value)}
                                className="flex-1 text-xs font-semibold text-purple-700 bg-transparent outline-none cursor-pointer"
                            >
                                <option value="All">ALL GENDERS</option>
                                <option value="Male">MALE</option>
                                <option value="Female">FEMALE</option>
                                <option value="Other">OTHER</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-linear-to-r from-purple-50 to-indigo-50 rounded-sm border border-purple-200">
                            <AlertCircle size={14} className="text-purple-500" />
                            <span className="text-xs font-bold text-purple-600">
                                {filteredPatients.length} Records Found
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-end mt-3 pt-2 border-t border-purple-100">
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedStatus("All");
                                setSelectedGender("All");
                            }}
                            className="text-[10px] font-bold text-purple-500 hover:text-purple-700 flex items-center gap-1 transition-colors"
                        >
                            <RefreshCcw size={10} /> Clear All Filters
                        </button>
                    </div>
                </div>

                {/* MAIN TABLE */}
                <div className="bg-white rounded-sm border border-purple-100 shadow-xl overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="relative">
                                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                                <Loader2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-600 animate-pulse" size={20} />
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-linear-to-r from-purple-50 to-indigo-50 border-b-2 border-purple-200">
                                        <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Patient</th>
                                        <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Contact Information</th>
                                        <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Medical ID</th>
                                        <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Demographics</th>
                                        <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Blood Group</th>
                                        <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-purple-100">
                                    {filteredPatients.length > 0 ? (
                                        filteredPatients.map((patient, index) => (
                                            <tr
                                                key={patient._id}
                                                className={`hover:bg-purple-50/50 transition-all duration-200 group ${patient.isBlocked ? 'opacity-60 bg-gray-50' : ''}`}
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                {/* Patient Info */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative">
                                                            <div className={`w-12 h-12 rounded-sm flex items-center justify-center text-white font-bold text-lg shadow-md ${patient.gender === 'Male'
                                                                ? 'bg-linear-to-br from-blue-500 to-blue-600'
                                                                : patient.gender === 'Female'
                                                                    ? 'bg-linear-to-br from-pink-500 to-rose-500'
                                                                    : 'bg-linear-to-br from-purple-500 to-indigo-500'
                                                                }`}>
                                                                {patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}
                                                            </div>
                                                            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${patient.isBlocked ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                                                                <div className={`w-full h-full rounded-full animate-ping ${patient.isBlocked ? 'bg-rose-400' : 'bg-emerald-400'} opacity-75`}></div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-black text-gray-800 group-hover:text-purple-700 transition-colors">
                                                                {patient.firstName} {patient.lastName}
                                                            </div>
                                                            <div className="flex items-center gap-1 mt-0.5">
                                                                <User size={10} className="text-purple-400" />
                                                                <span className="text-[9px] font-medium text-gray-500 uppercase">{patient.gender || "Not specified"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contact Information */}
                                                <td className="px-4 py-3">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <Mail size={12} className="text-purple-400 shrink-0" />
                                                            <span className="text-[11px] font-medium text-gray-700 truncate max-w-37.5">
                                                                {patient.email || "N/A"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Phone size={12} className="text-purple-400 shrink-0" />
                                                            <span className="text-[11px] font-medium text-gray-600">
                                                                {patient.phone || "N/A"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Medical ID */}
                                                <td className="px-4 py-3">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                                            <span className="text-xs font-mono font-bold text-purple-700">
                                                                {patient.patientId || "N/A"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar size={10} className="text-purple-400" />
                                                            <span className="text-[10px] font-medium text-gray-500">
                                                                Age: {calculateAge(patient.dob)} years
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Demographics */}
                                                <td className="px-4 py-3">
                                                    <div className="space-y-1">
                                                        {patient.address ? (
                                                            <div className="flex items-center gap-1.5">
                                                                <MapPin size={10} className="text-purple-400" />
                                                                <span className="text-[10px] font-medium text-gray-600 truncate max-w-37.5">
                                                                    {patient.address.city || patient.address}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[10px] text-gray-400">No address</span>
                                                        )}
                                                        {patient.emergencyContact && (
                                                            <div className="flex items-center gap-1.5">
                                                                <Heart size={10} className="text-rose-400" />
                                                                <span className="text-[9px] font-medium text-gray-500">
                                                                    Emergency: {patient.emergencyContact}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Blood Group */}
                                                <td className="px-4 py-3">
                                                    {getBloodGroupBadge(patient.bloodGroup) || (
                                                        <span className="text-[10px] text-gray-400">Not recorded</span>
                                                    )}
                                                </td>

                                                {/* Status */}
                                                <td className="px-4 py-3">
                                                    {!patient.isBlocked ? (
                                                        <div className="flex flex-col gap-1">
                                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-black w-fit">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                                ACTIVE
                                                            </span>
                                                            {patient.lastVisit && (
                                                                <span className="text-[8px] text-gray-400">
                                                                    Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-rose-50 text-rose-700 text-[9px] font-black">
                                                            <XCircle size={10} />
                                                            BLOCKED
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Link to={`/patient/${patient._id}`}
                                                            title="Medical Records"
                                                            className="p-1.5 text-purple-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-sm transition-all"
                                                        >
                                                            <FileText size={14} />
                                                        </Link>
                                                        <button
                                                            title="Medical History"
                                                            className="p-1.5 text-purple-400 hover:text-amber-600 hover:bg-amber-50 rounded-sm transition-all"
                                                        >
                                                            <History size={14} />
                                                        </button>
                                                        <button
                                                            title="Edit Profile"
                                                            className="p-1.5 text-purple-400 hover:text-amber-500 hover:bg-amber-50 rounded-sm transition-all"
                                                        >
                                                            <Edit3 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleBlockPatient(patient._id, patient.isBlocked)}
                                                            title={patient.isBlocked ? "Unblock Patient" : "Block Patient"}
                                                            className={`p-1.5 rounded-sm transition-all ${patient.isBlocked
                                                                ? 'text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600'
                                                                : 'text-purple-400 hover:text-rose-500 hover:bg-rose-50'
                                                                }`}
                                                        >
                                                            {patient.isBlocked ? <UserCheck size={14} /> : <UserX size={14} />}
                                                        </button>
                                                        <button
                                                            title="More Options"
                                                            className="p-1.5 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-sm transition-all"
                                                        >
                                                            <MoreVertical size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="py-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                                                        <Search size={32} className="text-purple-400" />
                                                    </div>
                                                    <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">No patients found</p>
                                                    <p className="text-xs text-purple-400 mt-1">Try adjusting your search or filters</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientManage;