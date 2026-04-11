import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorByIdThunk, updateAdminDoctorThunk } from '../../redux/slices/doctor.slice';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, Star, MapPin, Mail, Phone, 
  Briefcase, GraduationCap, Building2, 
  Clock, IndianRupee, ShieldCheck, CheckCircle2,
  Calendar, Award, XCircle, Edit3, Loader2, Key
} from 'lucide-react';

const DoctorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { singleDoctor: doctor, loading, error } = useSelector((state) => state.doctor);

    // Editing State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(getDoctorByIdThunk(id));
        }
    }, [dispatch, id]);

    // Handle Edit Click Initialization
    const handleOpenEdit = () => {
        setEditForm({
            ...doctor,
            password: "", // Always start with empty password string
            languagesStr: doctor.languages?.join(", ") || "", // Flatten to string for editing
            morningStart: doctor.workingHours?.morning?.start || "10:00",
            morningEnd: doctor.workingHours?.morning?.end || "14:00",
            eveningStart: doctor.workingHours?.evening?.start || "16:00",
            eveningEnd: doctor.workingHours?.evening?.end || "20:00",
        });
        setIsEditOpen(true);
    };

    const handleChange = (e) => {
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
            // Reconstruct nested schema structures
            const payload = {
                ...editForm,
                languages: editForm.languagesStr.split(",").map(s => s.trim()).filter(Boolean),
                workingHours: {
                    morning: { start: editForm.morningStart, end: editForm.morningEnd },
                    evening: { start: editForm.eveningStart, end: editForm.eveningEnd }
                }
            };
            
            await dispatch(updateAdminDoctorThunk({ 
                id: doctor._id, 
                updateData: payload 
            })).unwrap();
            
            toast.success("Doctor's Master Profile Synchronized!");
            setIsEditOpen(false);
        } catch (err) {
            toast.error(err || "Failed to push edits.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading && !isEditOpen) {
        return (
            <div className="flex bg-gradient-to-br from-purple-50 via-white to-indigo-50 items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    <p className="text-purple-600 font-bold tracking-widest uppercase text-xs animate-pulse">Synchronizing Cortex...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex bg-gradient-to-br from-purple-50 via-white to-indigo-50 items-center justify-center min-h-screen p-4">
                <div className="bg-white p-8 rounded-sm shadow-2xl flex flex-col items-center text-center max-w-md w-full border border-red-100">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                        <XCircle className="text-red-500 w-10 h-10" />
                    </div>
                    <h2 className="text-xl font-black text-gray-800 mb-2">Profile Not Found</h2>
                    <p className="text-sm text-gray-500 mb-8">{error}</p>
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-sm transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} /> Retreat
                    </button>
                </div>
            </div>
        );
    }

    if (!doctor) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br transition-all duration-500 from-purple-50 via-white to-indigo-50 font-sans pb-12 relative">
            
            {/* Header Area */}
            <div className="bg-white border-b border-purple-100 sticky top-0 z-10 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate(-1)}
                            className="p-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-sm transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-lg md:text-xl font-black text-gray-800">Master Record</h1>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{doctor._id}</p>
                        </div>
                    </div>
                    
                    {/* EDIT TRIGGER BUTTON */}
                    <button 
                        onClick={handleOpenEdit}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all"
                    >
                        <Edit3 size={16} /> Edit Profile
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Hero & Quick Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-sm shadow-xl border border-purple-100 overflow-hidden relative">
                            <div className="h-32 bg-gradient-to-r from-purple-600 to-indigo-600 relative overflow-hidden">
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] uppercase font-black border border-white/30 truncate max-w-full">
                                    Lic: {doctor.licenseNumber || "Pending"}
                                </div>
                            </div>
                            <div className="px-6 pb-6 relative -mt-16 text-center">
                                <div className="inline-block relative group">
                                    <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-xl">
                                        <img 
                                            src={doctor.profile?.url || "https://via.placeholder.com/150"} 
                                            alt={`${doctor.firstName} ${doctor.lastName}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    {doctor.isVerified && (
                                        <div className="absolute bottom-2 right-2 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-md">
                                            <ShieldCheck size={16} />
                                        </div>
                                    )}
                                </div>
                                
                                <h2 className="mt-4 text-2xl font-black text-gray-800">
                                    Dr. {doctor.firstName} {doctor.lastName}
                                </h2>
                                <p className="text-sm font-bold text-purple-600 uppercase tracking-wide mt-1">
                                    {doctor.specialization || "General Medicine"}
                                </p>
                                
                                <div className="flex justify-center items-center gap-1 mt-3">
                                    <Star className="text-amber-400 fill-amber-400" size={16} />
                                    <span className="font-bold text-gray-700">{doctor.rating?.toFixed(1) || "New"}</span>
                                    <span className="text-xs text-gray-400 ml-1">({doctor.reviews?.length || 0} reviews)</span>
                                </div>

                                <div className="mt-6 flex flex-wrap justify-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${doctor.isBlocked ? 'bg-red-50 border border-red-200 text-red-600' : 'bg-emerald-50 border border-emerald-200 text-emerald-600'}`}>
                                        {doctor.isBlocked ? 'Access Blocked' : 'Active Duty'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Card */}
                        <div className="bg-white p-6 rounded-sm shadow-lg border border-purple-100">
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Mail size={16} className="text-purple-500"/> Direct Contact
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                                        <Phone size={16} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Comm Link</p>
                                        <p className="text-sm font-semibold text-gray-800">{doctor.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                                        <Mail size={16} className="text-purple-600" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-bold text-gray-400 uppercase">Mail Drop</p>
                                        <p className="text-sm font-semibold text-gray-800 truncate">{doctor.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                                        <MapPin size={16} className="text-purple-600" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-bold text-gray-400 uppercase">Sector Base</p>
                                        <p className="text-sm font-semibold text-gray-800 truncate">{doctor.location || "Hospital Main Campus"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Detailed Info */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Bio / About */}
                        <div className="bg-white p-6 md:p-8 rounded-sm shadow-lg border border-purple-100">
                            <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
                                <GraduationCap size={20} className="text-indigo-600" /> Professional Bio
                            </h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                                {doctor.bio || "No professional biography provided."}
                            </p>
                        </div>

                        {/* Professional Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Experience */}
                            <div className="bg-white p-6 rounded-sm shadow-lg border border-purple-100 hover:shadow-xl transition-shadow relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50 border border-purple-200"></div>
                                <div className="w-12 h-12 bg-gradient-to-br relative z-10 from-indigo-500 to-purple-600 rounded-sm flex items-center justify-center mb-4 shadow-md text-white">
                                    <Briefcase size={24} />
                                </div>
                                <h4 className="text-xs relative z-10 font-bold text-gray-500 uppercase tracking-widest mb-1">Field Experience</h4>
                                <p className="text-3xl relative z-10 font-black text-gray-800">{doctor.experience} <span className="text-sm text-gray-500 font-medium tracking-widest uppercase">Years</span></p>
                            </div>

                            {/* Consultation Fee */}
                            <div className="bg-white p-6 rounded-sm shadow-lg border border-purple-100 hover:shadow-xl transition-shadow relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50 border border-emerald-200"></div>
                                <div className="w-12 h-12 bg-gradient-to-br relative z-10 from-emerald-500 to-teal-500 rounded-sm flex items-center justify-center mb-4 shadow-md text-white">
                                    <IndianRupee size={24} />
                                </div>
                                <h4 className="text-xs relative z-10 font-bold text-gray-500 uppercase tracking-widest mb-1">Standard Levy</h4>
                                <p className="text-3xl relative z-10 font-black text-gray-800">₹{doctor.consultationFees?.toLocaleString() || 500}</p>
                            </div>
                            
                            {/* Protocols / Languages */}
                            <div className="bg-white p-6 rounded-sm shadow-lg border border-purple-100">
                                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Award size={16} className="text-purple-600" /> Operational Protocols
                                </h4>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-3 rounded-sm border border-gray-100">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Registry Code</p>
                                        <p className="font-semibold text-gray-800">{doctor.licenseNumber || "N/A"}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-sm border border-gray-100">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Comm Linguistics</p>
                                        <p className="font-semibold text-gray-800">
                                            {doctor.languages?.join(", ") || "English"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Schedule */}
                            <div className="bg-white p-6 rounded-sm shadow-lg border border-purple-100">
                                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Clock size={16} className="text-purple-600" /> Authorized Windows
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-purple-50 p-4 rounded-sm border border-purple-100 hover:bg-purple-100 transition-colors">
                                        <span className="text-xs font-bold uppercase text-purple-700">Morning Sequence</span>
                                        <span className="text-sm font-black text-gray-700 bg-white px-2 py-1 rounded shadow-sm">
                                            {doctor.workingHours?.morning?.start || '10:00'} - {doctor.workingHours?.morning?.end || '14:00'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-sm border border-indigo-100 hover:bg-indigo-100 transition-colors">
                                        <span className="text-xs font-bold uppercase text-indigo-700">Evening Sequence</span>
                                        <span className="text-sm font-black text-gray-700 bg-white px-2 py-1 rounded shadow-sm">
                                            {doctor.workingHours?.evening?.start || '16:00'} - {doctor.workingHours?.evening?.end || '20:00'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* FULL SCHEMA EDIT MODAL OVERLAY */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md overflow-hidden">
                    <div className="bg-white rounded-sm w-full max-w-4xl shadow-2xl border border-purple-100 flex flex-col max-h-[90vh] overflow-hidden transform transition-all duration-300">
                        
                        <div className="px-6 py-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-white flex justify-between items-center sticky top-0 z-10 shrink-0">
                            <div>
                                <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                                    <Edit3 size={20} className="text-purple-600" /> Master Edit Console
                                </h2>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Modifying: {doctor._id}</p>
                            </div>
                            <button onClick={() => setIsEditOpen(false)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-sm transition-colors">
                                <XCircle size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSave} className="overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar">
                            
                            {/* BASE IDENTITY */}
                            <div>
                                <h3 className="text-xs font-black uppercase text-purple-600 tracking-widest mb-4 border-b border-purple-100 pb-2">Core Identity</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">First Name</label>
                                        <input type="text" name="firstName" value={editForm.firstName || ''} onChange={handleChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-semibold" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Last Name</label>
                                        <input type="text" name="lastName" value={editForm.lastName || ''} onChange={handleChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-semibold" required />
                                    </div>
                                </div>
                            </div>

                            {/* COMM & SEC */}
                            <div>
                                <h3 className="text-xs font-black uppercase text-purple-600 tracking-widest mb-4 border-b border-purple-100 pb-2">Security & Communications</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Email Node</label>
                                        <input type="email" name="email" value={editForm.email || ''} onChange={handleChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-semibold" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Phone Line</label>
                                        <input type="text" name="phone" value={editForm.phone || ''} onChange={handleChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-semibold" required />
                                    </div>
                                </div>
                                <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm relative overflow-hidden group">
                                    <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
                                        <Key size={100} className="text-amber-500" />
                                    </div>
                                    <label className="block text-xs font-black text-amber-800 uppercase tracking-wide mb-1 relative z-10 flex items-center gap-1">
                                        <Key size={12}/> Override Password
                                    </label>
                                    <p className="text-[10px] text-amber-600 mb-2 relative z-10 font-medium">Leave completely blank to preserve original active password hash.</p>
                                    <input type="password" name="password" placeholder="Enter new highly secure sequence..." value={editForm.password || ''} onChange={handleChange} className="w-full relative z-10 px-4 py-2 text-sm bg-white border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-black" />
                                </div>
                            </div>

                            {/* PROFESSIONAL ATTRIBUTES */}
                            <div>
                                <h3 className="text-xs font-black uppercase text-purple-600 tracking-widest mb-4 border-b border-purple-100 pb-2">Professional Directives</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Specialization</label>
                                        <input type="text" name="specialization" value={editForm.specialization || ''} onChange={handleChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-semibold" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Cost Levy (₹)</label>
                                        <input type="number" name="consultationFees" value={editForm.consultationFees || ''} onChange={handleChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-black" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Yield (Years)</label>
                                        <input type="number" name="experience" value={editForm.experience || ''} onChange={handleChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-black" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Registry Code</label>
                                        <input type="text" name="licenseNumber" value={editForm.licenseNumber || ''} onChange={handleChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-semibold uppercase" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Base Sector</label>
                                        <input type="text" name="location" value={editForm.location || ''} onChange={handleChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-semibold" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Languages Array (CSV)</label>
                                    <input type="text" name="languagesStr" value={editForm.languagesStr || ''} onChange={handleChange} placeholder="English, Hindi, Spanish" className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-semibold" required />
                                </div>
                                <div className="mt-5">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">System Profile Bio</label>
                                    <textarea name="bio" value={editForm.bio || ''} onChange={handleChange} rows="3" className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium custom-scrollbar"></textarea>
                                </div>
                            </div>

                            {/* CHRONO SCHEDULE */}
                            <div>
                                <h3 className="text-xs font-black uppercase text-purple-600 tracking-widest mb-4 border-b border-purple-100 pb-2 flex items-center gap-2">
                                    <Clock size={14}/> Chrono Scheduling Matrix
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-purple-50/50 p-4 rounded-sm border border-purple-100">
                                    
                                    <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100">
                                        <label className="block text-xs font-black text-indigo-700 uppercase tracking-widest mb-3">Morning Sequence</label>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1">
                                                <input type="time" name="morningStart" value={editForm.morningStart} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-400">TO</span>
                                            <div className="flex-1">
                                                <input type="time" name="morningEnd" value={editForm.morningEnd} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100">
                                        <label className="block text-xs font-black text-purple-700 uppercase tracking-widest mb-3">Evening Sequence</label>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1">
                                                <input type="time" name="eveningStart" value={editForm.eveningStart} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-400">TO</span>
                                            <div className="flex-1">
                                                <input type="time" name="eveningEnd" value={editForm.eveningEnd} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold" />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* ACCESS STATUSES */}
                            <div className="bg-gray-50 border border-gray-200 p-5 rounded-sm flex items-center justify-around flex-wrap gap-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center p-1">
                                        <input type="checkbox" name="isVerified" checked={editForm.isVerified || false} onChange={handleChange} className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer shadow-sm relative z-10 peer" />
                                        <div className="absolute inset-0 bg-emerald-100 rounded opacity-0 peer-checked:opacity-100 scale-150 transition-all duration-300"></div>
                                    </div>
                                    <span className="text-sm font-black uppercase text-gray-700 group-hover:text-emerald-700 transition">Is Official (Verified)</span>
                                </label>
                                <div className="w-px h-8 bg-gray-300 hidden md:block"></div>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center p-1">
                                        <input type="checkbox" name="isBlocked" checked={editForm.isBlocked || false} onChange={handleChange} className="w-5 h-5 text-rose-600 rounded border-gray-300 focus:ring-rose-500 cursor-pointer shadow-sm relative z-10 peer" />
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
                            <button type="button" onClick={handleSave} className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black uppercase tracking-widest rounded-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all outline-none flex items-center gap-2 border border-purple-500/50">
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : "Deploy Updates"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DoctorDetail;
