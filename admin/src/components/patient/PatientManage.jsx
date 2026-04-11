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
import { getAllPatientThunk, updateAdminPatientThunk, updateAdminPatientStatusThunk } from "../../redux/slices/patient.slice";
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

    // Master Edit State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const handleEditClick = (patient) => {
        setEditForm({
            ...patient,
            password: "", // Security override
            dob: patient.dob ? new Date(patient.dob).toISOString().split('T')[0] : ""
        });
        setIsEditOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await dispatch(updateAdminPatientThunk({
                id: editForm._id,
                updateData: editForm
            })).unwrap();
            toast.success(`Patient ${editForm.firstName}'s Master Record Synced!`);
            setIsEditOpen(false);
        } catch (err) {
            toast.error(err || "Failed to update patient");
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        dispatch(getAllPatientThunk());
    }, [dispatch]);

    const handleBlockPatient = async (id, isBlocked) => {
        try {
            await dispatch(updateAdminPatientStatusThunk({
                id,
                isBlocked: !isBlocked
            })).unwrap();
            toast.success(`Patient ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
        } catch (error) {
            toast.error(error || "Update failed");
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
            'B+': 'bg-indigo-100 text-indigo-700 border-indigo-200',
            'B-': 'bg-indigo-50 text-indigo-600 border-indigo-100',
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
                            <p className="text-[10px] font-bold text-indigo-500 uppercase">Male</p>
                            <p className="text-2xl font-black text-indigo-600">{stats.male}</p>
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
                                                            onClick={() => handleEditClick(patient)}
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

            {/* FULL SCHEMA EDIT MODAL OVERLAY */}
            <AnimatePresence>
                {isEditOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md overflow-hidden"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-sm w-full max-w-4xl shadow-2xl border border-purple-100 flex flex-col max-h-[90vh] overflow-hidden transform transition-all duration-300"
                        >
                            
                            <div className="px-6 py-4 border-b border-purple-100 bg-linear-to-r from-purple-50 to-white flex justify-between items-center sticky top-0 z-10 shrink-0">
                                <div>
                                    <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                                        <Edit3 size={20} className="text-purple-600" /> Patient Master Edit
                                    </h2>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">ID: {editForm.patientId || editForm._id}</p>
                                </div>
                                <button onClick={() => setIsEditOpen(false)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-sm transition-colors">
                                    <XCircle size={24} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSave} className="overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar">
                                
                                {/* BASE IDENTITY */}
                                <div>
                                    <h3 className="text-xs font-black uppercase text-purple-600 tracking-widest mb-4 border-b border-purple-100 pb-2">Core Identity</h3>
                                    
                                    <div className="mb-5">
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Medical ID (PAT-XXXX)</label>
                                        <input type="text" name="patientId" value={editForm.patientId || ''} onChange={handleEditChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-black text-amber-700" required />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">First Name</label>
                                            <input type="text" name="firstName" value={editForm.firstName || ''} onChange={handleEditChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-semibold" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Last Name</label>
                                            <input type="text" name="lastName" value={editForm.lastName || ''} onChange={handleEditChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-semibold" required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Date of Birth</label>
                                            <input type="date" name="dob" value={editForm.dob || ''} onChange={handleEditChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-semibold" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Gender</label>
                                            <select name="gender" value={editForm.gender || 'Other'} onChange={handleEditChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-semibold" required>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* COMM & SEC */}
                                <div>
                                    <h3 className="text-xs font-black uppercase text-purple-600 tracking-widest mb-4 border-b border-purple-100 pb-2">Security & Communications</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Email Node</label>
                                            <input type="email" name="email" value={editForm.email || ''} onChange={handleEditChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-semibold" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Phone Line</label>
                                            <input type="text" name="phone" value={editForm.phone || ''} onChange={handleEditChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-semibold" required />
                                        </div>
                                    </div>
                                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm relative overflow-hidden group">
                                        <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-150 transition-transform duration-500 flex items-center justify-center w-24 h-24">
                                            <div className="w-10 h-10 border-4 border-amber-500 rounded-full"></div>
                                        </div>
                                        <label className="block text-xs font-black text-amber-800 uppercase tracking-wide mb-1 relative z-10 items-center gap-1">
                                            Override Password
                                        </label>
                                        <p className="text-[10px] text-amber-600 mb-2 relative z-10 font-medium">Leave completely blank to preserve original active password hash.</p>
                                        <input type="password" name="password" placeholder="Enter new highly secure sequence..." value={editForm.password || ''} onChange={handleEditChange} className="w-full relative z-10 px-4 py-2 text-sm bg-white border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-black" />
                                    </div>
                                </div>

                                {/* MEDICAL DIRECTIVES */}
                                <div>
                                    <h3 className="text-xs font-black uppercase text-purple-600 tracking-widest mb-4 border-b border-purple-100 pb-2">Medical Directives</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Blood Group</label>
                                            <select name="bloodGroup" value={editForm.bloodGroup || ''} onChange={handleEditChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-semibold">
                                                <option value="">Not Recorded</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">System Profile Bio</label>
                                            <input type="text" name="about" value={editForm.about || ''} onChange={handleEditChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-semibold" />
                                        </div>
                                    </div>
                                    <div className="mt-5">
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Residential Sector (Address)</label>
                                        <textarea name="address" value={editForm.address || ''} onChange={handleEditChange} rows="2" className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium custom-scrollbar"></textarea>
                                    </div>
                                </div>

                                {/* ACCESS STATUSES */}
                                <div className="bg-gray-50 border border-gray-200 p-5 rounded-sm flex items-center justify-around flex-wrap gap-4">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center p-1">
                                            <input type="checkbox" name="isVerified" checked={editForm.isVerified || false} onChange={handleEditChange} className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer shadow-sm relative z-10 peer" />
                                            <div className="absolute inset-0 bg-emerald-100 rounded opacity-0 peer-checked:opacity-100 scale-150 transition-all duration-300"></div>
                                        </div>
                                        <span className="text-sm font-black uppercase text-gray-700 group-hover:text-emerald-700 transition">Is Official (Verified)</span>
                                    </label>
                                    <div className="w-px h-8 bg-gray-300 hidden md:block"></div>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center p-1">
                                            <input type="checkbox" name="isBlocked" checked={editForm.isBlocked || false} onChange={handleEditChange} className="w-5 h-5 text-rose-600 rounded border-gray-300 focus:ring-rose-500 cursor-pointer shadow-sm relative z-10 peer" />
                                            <div className="absolute inset-0 bg-rose-100 rounded opacity-0 peer-checked:opacity-100 scale-150 transition-all duration-300"></div>
                                        </div>
                                        <span className="text-sm font-black uppercase text-gray-700 group-hover:text-rose-700 transition">Revoke Access (Blocked)</span>
                                    </label>
                                </div>

                                {/* PADDING TO CLEAR FIXED FOOTER */}
                                <div className="h-4"></div>
                            </form>
                            
                            {/* FOOTER ACTIONS */}
                            <div className="px-6 py-4 border-t border-purple-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                                <button type="button" onClick={() => setIsEditOpen(false)} className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-200 outline-none rounded-sm transition-colors border border-gray-300 hover:border-gray-400 shadow-sm">
                                    Cancel Operation
                                </button>
                                <button type="button" onClick={handleSave} className="px-8 py-2.5 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black uppercase tracking-widest rounded-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all outline-none flex items-center gap-2 border border-purple-500/50">
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : "Deploy Updates"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default PatientManage;