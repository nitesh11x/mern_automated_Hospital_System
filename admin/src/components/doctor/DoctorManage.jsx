import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Edit3, Ban, ShieldCheck, Plus, Search,
    Building2, Briefcase, MapPin,
    Calendar, ChevronRight, Filter, Trash,
    RefreshCcw, Loader2,
    IndianRupee, Star, Award, Clock, UserCheck, UserX,
    Eye, MoreVertical, CheckCircle, XCircle, Mail, Phone
} from 'lucide-react';
import { deleteDoctorThunk, getAllDoctorsThunk, updateAdminDoctorThunk } from "../../redux/slices/doctor.slice";
import { Link, useNavigate } from 'react-router-dom';
import { api } from "../../utils/axios";
import { toast } from "react-hot-toast";

const DoctorManage = ({ isEmbedded }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { doctors = [], loading } = useSelector((state) => state.doctor);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDept, setSelectedDept] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [selectedVerification, setSelectedVerification] = useState("All");

    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    const handleEditClick = (doc) => {
        setEditFormData({ ...doc });
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateAdminDoctorThunk({ id: editFormData._id, updateData: editFormData })).unwrap();
            toast.success("Doctor details updated successfully");
            setIsEditModalOpen(false);
        } catch (error) {
            toast.error(error || "Update failed");
        }
    };

    useEffect(() => {
        dispatch(getAllDoctorsThunk());
    }, [dispatch]);

    const handleBlockDoctor = async (id, isBlocked) => {
        try {
            await api.put(`/doctor/${id}`, { isBlocked: !isBlocked });
            toast.success(`Doctor ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
            dispatch(getAllDoctorsThunk());
        } catch (error) {
            toast.error(error?.response?.data?.message || "Status update failed");
        }
    };

    const departments = useMemo(() => {
        if (!doctors) return [];
        return ["All", ...new Set(doctors.map(d => d.specialization).filter(Boolean))];
    }, [doctors]);

    const filteredDoctors = useMemo(() => {
        return doctors.filter(doc => {
            const fullName = `${doc.firstName} ${doc.lastName}`.toLowerCase();
            const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.email?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = selectedDept === "All" || doc.specialization === selectedDept;
            const matchesStatus = selectedStatus === "All" ||
                (selectedStatus === "Active" && !doc.isBlocked) ||
                (selectedStatus === "Blocked" && doc.isBlocked);
            const matchesVerification = selectedVerification === "All" ||
                (selectedVerification === "Verified" && doc.isVerified) ||
                (selectedVerification === "Unverified" && !doc.isVerified);
            return matchesSearch && matchesDept && matchesStatus && matchesVerification;
        });
    }, [doctors, searchTerm, selectedDept, selectedStatus, selectedVerification]);

    const getRatingStars = (rating) => {
        if (!rating) return null;
        return (
            <div className="flex items-center gap-0.5">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-600">{rating.toFixed(1)}</span>
            </div>
        );
    };

    const stats = useMemo(() => ({
        total: doctors.length,
        active: doctors.filter(d => !d.isBlocked).length,
        blocked: doctors.filter(d => d.isBlocked).length,
        verified: doctors.filter(d => d.isVerified).length,
        unverified: doctors.filter(d => !d.isVerified).length,
    }), [doctors]);

    return (
        <div className={`p-4 md:p-8 bg-linear-to-br from-purple-50 via-white to-indigo-50 min-h-screen ${isEmbedded ? '' : 'pt-20'} font-sans`}>
            <div className="max-w-full mx-auto">

                {/* HEADER WITH STATS */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                        <div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => dispatch(getAllDoctorsThunk())}
                                className="p-2.5 bg-white border border-purple-200 rounded-sm hover:border-purple-400 hover:shadow-md transition-all group"
                                title="Refresh"
                            >
                                <RefreshCcw size={18} className="text-purple-500 group-hover:rotate-180 transition-transform duration-500" />
                            </button>
                            <Link
                                to="/doctor/register"
                                className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-md"
                            >
                                <Plus size={16} /> Register New Doctor
                            </Link>
                        </div>
                    </div>

                    {/* STATISTICS CARDS */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white rounded-sm border border-purple-100 p-4 shadow-sm hover:shadow-md transition-all">
                            <p className="text-[10px] font-bold text-purple-500 uppercase">Total Faculty</p>
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
                            <p className="text-[10px] font-bold text-indigo-500 uppercase">Verified</p>
                            <p className="text-2xl font-black text-indigo-600">{stats.verified}</p>
                        </div>
                        <div className="bg-white rounded-sm border border-purple-100 p-4 shadow-sm">
                            <p className="text-[10px] font-bold text-amber-500 uppercase">Pending</p>
                            <p className="text-2xl font-black text-amber-600">{stats.unverified}</p>
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
                                placeholder="Search by name, specialization, email..."
                                className="w-full pl-10 pr-3 py-2.5 text-sm border border-purple-200 rounded-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-purple-50/30"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-sm border border-purple-200">
                            <Building2 size={14} className="text-purple-500" />
                            <select
                                value={selectedDept}
                                onChange={(e) => setSelectedDept(e.target.value)}
                                className="flex-1 text-xs font-semibold text-purple-700 bg-transparent outline-none cursor-pointer uppercase tracking-wider"
                            >
                                {departments.map(d => (
                                    <option key={d} value={d}>{d === "All" ? "ALL DEPARTMENTS" : d.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-sm border border-purple-200">
                            <UserCheck size={14} className="text-purple-500" />
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
                            <ShieldCheck size={14} className="text-purple-500" />
                            <select
                                value={selectedVerification}
                                onChange={(e) => setSelectedVerification(e.target.value)}
                                className="flex-1 text-xs font-semibold text-purple-700 bg-transparent outline-none cursor-pointer"
                            >
                                <option value="All">ALL VERIFICATION</option>
                                <option value="Verified">VERIFIED</option>
                                <option value="Unverified">UNVERIFIED</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-purple-100">
                        <div className="text-[10px] font-bold text-purple-400">
                            Showing {filteredDoctors.length} of {doctors.length} specialists
                        </div>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedDept("All");
                                setSelectedStatus("All");
                                setSelectedVerification("All");
                            }}
                            className="text-[10px] font-bold text-purple-500 hover:text-purple-700 flex items-center gap-1"
                        >
                            <RefreshCcw size={10} /> Clear Filters
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
                                        <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Doctor</th>
                                        <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Contact</th>
                                        <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Specialization</th>
                                        <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Experience</th>
                                        <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Consultation Fee</th>
                                        <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Rating</th>
                                        <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Verification</th>
                                        <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-4 text-[10px] font-black text-purple-700 uppercase tracking-wider text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-purple-100">
                                    {filteredDoctors.length > 0 ? (
                                        filteredDoctors.map((doc, index) => (
                                            <tr
                                                key={doc._id}
                                                className={`hover:bg-purple-50/50 transition-all duration-200 group ${doc.isBlocked ? 'opacity-60 bg-gray-50' : ''}`}
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                {/* Doctor Info */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative">
                                                            <img
                                                                src={doc?.profile?.url?.replace("/upload/", "/upload/w_50,h_50,c_fill/") || "https://via.placeholder.com/50"}
                                                                className="w-12 h-12 rounded-sm object-cover border-2 border-purple-200 group-hover:border-purple-400 transition-all"
                                                                alt=""
                                                            />
                                                            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${doc.isBlocked ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                                                                <div className={`w-full h-full rounded-full animate-ping ${doc.isBlocked ? 'bg-rose-400' : 'bg-emerald-400'} opacity-75`}></div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-black text-gray-800 group-hover:text-purple-700 transition-colors">
                                                                Dr. {doc.firstName} {doc.lastName}
                                                            </div>
                                                            <div className="flex items-center gap-1 mt-0.5">
                                                                <MapPin size={10} className="text-purple-400" />
                                                                <span className="text-[9px] font-medium text-gray-500">{doc.location || "City Medical Center"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contact Info */}
                                                <td className="px-4 py-3">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1">
                                                            <Mail size={10} className="text-purple-400" />
                                                            <span className="text-[10px] font-medium text-gray-600">{doc.email || "N/A"}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Phone size={10} className="text-purple-400" />
                                                            <span className="text-[10px] font-medium text-gray-600">{doc.phone || "N/A"}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Specialization */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <Building2 size={12} className="text-purple-500" />
                                                        <span className="text-xs font-bold text-purple-700 uppercase">
                                                            {doc.specialization || "General Medicine"}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Experience */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <Briefcase size={12} className="text-purple-400" />
                                                        <span className="text-xs font-bold text-gray-700">
                                                            {doc.experience || 0} Years
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Clock size={10} className="text-purple-300" />
                                                        <span className="text-[9px] text-gray-500">{doc.availability || "Mon-Sat"}</span>
                                                    </div>
                                                </td>

                                                {/* Fee */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <IndianRupee size={12} className="text-emerald-500" />
                                                        <span className="text-sm font-black text-emerald-600">
                                                            {doc.consultationFees?.toLocaleString() || 500}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Rating */}
                                                <td className="px-4 py-3">
                                                    {getRatingStars(doc.rating) || (
                                                        <span className="text-[10px] text-gray-400">No rating</span>
                                                    )}
                                                </td>

                                                {/* Verification */}
                                                <td className="px-4 py-3">
                                                    {doc.isVerified ? (
                                                        <div className="flex items-center gap-1">
                                                            <CheckCircle size={12} className="text-emerald-500" />
                                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Verified</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1">
                                                            <XCircle size={12} className="text-amber-500" />
                                                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Pending</span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Status */}
                                                <td className="px-4 py-3">
                                                    {!doc.isBlocked ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-black">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                            ACTIVE
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-50 text-rose-700 text-[9px] font-black">
                                                            <Ban size={10} />
                                                            BLOCKED
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            title="View Details"
                                                            className="p-1.5 text-purple-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-sm transition-all"
                                                            onClick={() => navigate(`/doctor/detail/${doc._id}`)}
                                                        >
                                                            <Eye size={14} />
                                                        </button>
                                                        <button
                                                            title="Edit Profile"
                                                            className="p-1.5 text-purple-400 hover:text-amber-500 hover:bg-amber-50 rounded-sm transition-all"
                                                            onClick={() => handleEditClick(doc)}
                                                        >
                                                            <Edit3 size={14} />
                                                        </button>
                                                        <button
                                                            title="Schedule"
                                                            className="p-1.5 text-purple-400 hover:text-blue-500 hover:bg-blue-50 rounded-sm transition-all"
                                                            onClick={() => navigate(`/doctor/scheduel/${doc._id}`)}
                                                        >
                                                            <Calendar size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleBlockDoctor(doc._id, doc.isBlocked)}
                                                            title={doc.isBlocked ? "Unblock Doctor" : "Block Doctor"}
                                                            className={`p-1.5 rounded-sm transition-all ${doc.isBlocked
                                                                ? 'text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600'
                                                                : 'text-purple-400 hover:text-rose-500 hover:bg-rose-50'
                                                                }`}
                                                        >
                                                            {doc.isBlocked ? <UserCheck size={14} /> : <UserX size={14} />}
                                                        </button>
                                                        <button
                                                            title="Delete"
                                                            className="p-1.5 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-sm transition-all"
                                                            onClick={() => {
                                                                const confirmDelete = window.confirm("Are you sure you want to delete this doctor?");

                                                                if (confirmDelete) {
                                                                    dispatch(deleteDoctorThunk(doc._id));
                                                                    console.log(doc._id);
                                                                    toast.success("Doctor deleted successfully");
                                                                }
                                                            }}
                                                        >
                                                            <Trash size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="py-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                                                        <Search size={32} className="text-purple-400" />
                                                    </div>
                                                    <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">No doctors found</p>
                                                    <p className="text-xs text-purple-400 mt-1">Try adjusting your filters</p>
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

            {/* EDIT MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-sm w-full max-w-xl shadow-2xl overflow-hidden border-t-4 border-purple-600">
                        <div className="flex justify-between items-center p-4 lg:p-6 bg-purple-50">
                            <h2 className="text-xl font-black text-gray-800">Edit Doctor Profile</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-rose-500 transition-colors">
                                <XCircle size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-4 lg:p-6 space-y-4 h-[70vh] lg:h-auto overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">First Name</label>
                                    <input type="text" name="firstName" value={editFormData.firstName || ''} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Last Name</label>
                                    <input type="text" name="lastName" value={editFormData.lastName || ''} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Email</label>
                                    <input type="email" name="email" value={editFormData.email || ''} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Phone</label>
                                    <input type="text" name="phone" value={editFormData.phone || ''} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Specialization</label>
                                    <input type="text" name="specialization" value={editFormData.specialization || ''} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Fee (₹)</label>
                                    <input type="number" name="consultationFees" value={editFormData.consultationFees || ''} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Experience (Years)</label>
                                    <input type="number" name="experience" value={editFormData.experience || ''} onChange={handleEditChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div className="flex items-center gap-6 mt-6">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" name="isVerified" checked={editFormData.isVerified || false} onChange={handleEditChange} className="w-4 h-4 text-purple-600 rounded-sm focus:ring-purple-500" />
                                        <span className="text-sm font-bold text-gray-700 group-hover:text-purple-700 transition">Verified</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" name="isBlocked" checked={editFormData.isBlocked || false} onChange={handleEditChange} className="w-4 h-4 text-rose-600 rounded-sm focus:ring-rose-500" />
                                        <span className="text-sm font-bold text-gray-700 group-hover:text-rose-700 transition">Blocked</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 outline-none rounded-sm transition-colors border border-gray-300 hover:border-gray-400 shadow-sm">
                                    Cancel
                                </button>
                                <button type="submit" className="px-8 py-2 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-bold uppercase tracking-wider rounded-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all outline-none flex items-center gap-2">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorManage;