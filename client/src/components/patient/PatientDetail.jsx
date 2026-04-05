import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ShieldCheck,
    Edit3,
    Camera,
    Fingerprint,
    HeartPulse,
    Download,
    FileText,
    Clock,
    Pill,
    Activity,
    AlertCircle,
    CheckCircle,
    XCircle,
    PlusCircle,
    Bell,
    Syringe,
    Microscope,
    Scissors,
    MoreVertical,
    Loader2,
    Stethoscope,
    Thermometer,
    Droplet,
    Ruler,
    Weight
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPatientByIdThunk } from "../../redux/slices/patient.slice";

const PatientDetail = () => {
    const { patientId } = useParams();
    const { patientFromId, loading, error } = useSelector(state => state.patient);
    const dispatch = useDispatch();

    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [medications, setMedications] = useState([]);
    const [labResults, setLabResults] = useState([]);
    const [vaccinations, setVaccinations] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [fetchAttempted, setFetchAttempted] = useState(false);

    useEffect(() => {
        if (patientId && !fetchAttempted) {
            console.log("Fetching patient with ID:", patientId);
            dispatch(getPatientByIdThunk(patientId));
            setFetchAttempted(true);
        }
    }, [dispatch, patientId, fetchAttempted]);

    useEffect(() => {
        if (patientFromId && !loading) {
            let patientData = patientFromId;
            console.log("Patient data received:", patientData);

            // Handle different response structures
            if (Array.isArray(patientFromId) && patientFromId.length > 0) {
                patientData = patientFromId[0];
            }
            if (patientFromId.patient) {
                patientData = patientFromId.patient;
            }

            if (patientData && Object.keys(patientData).length > 0) {
                const transformedPatient = {
                    // Basic Info - directly from response
                    firstName: patientData.firstName || "",
                    lastName: patientData.lastName || "",
                    email: patientData.email || "",
                    phone: patientData.phone || "",
                    dob: patientData.dob || "",
                    age: calculateAge(patientData.dob),
                    gender: patientData.gender || "",
                    patientId: patientData.patientId || patientId || "",
                    bloodGroup: patientData.bloodGroup || "Unknown",
                    rhesusFactor: "Positive", // Default since not in response

                    // Address info (not in response, set defaults)
                    address: patientData.address || "Not provided",
                    emergencyContact: patientData.emergencyContact || "",
                    emergencyRelation: "Emergency Contact",
                    maritalStatus: patientData.maritalStatus || "Not Specified",
                    occupation: patientData.occupation || "",
                    nationality: patientData.nationality || "",

                    // Insurance info (not in response)
                    nhsNumber: patientData.nhsNumber || "",
                    insuranceProvider: patientData.insuranceProvider || "Not provided",
                    insuranceId: patientData.insuranceId || "",
                    primaryPhysician: patientData.primaryPhysician || "Not assigned",

                    // Vitals (not in response, set defaults)
                    height: patientData.height || "Not recorded",
                    weight: patientData.weight || "Not recorded",
                    bmi: patientData.bmi || "N/A",
                    bloodPressure: patientData.bloodPressure || "Not recorded",
                    heartRate: patientData.heartRate || "Not recorded",
                    temperature: patientData.temperature || "98.6°F",
                    respiratoryRate: patientData.respiratoryRate || "Not recorded",

                    // Medical history (not in response, set empty arrays)
                    allergies: Array.isArray(patientData.allergies) ? patientData.allergies : [],
                    allergiesReactions: Array.isArray(patientData.allergiesReactions) ? patientData.allergiesReactions : [],
                    conditions: Array.isArray(patientData.conditions) ? patientData.conditions : [],
                    surgeries: Array.isArray(patientData.surgeries) ? patientData.surgeries : [],
                    familyHistory: Array.isArray(patientData.familyHistory) ? patientData.familyHistory : [],

                    // Social history
                    socialHistory: patientData.socialHistory || {
                        smoking: "Not specified",
                        alcohol: "Not specified",
                        exercise: "Not specified",
                        diet: "Not specified"
                    },

                    // Profile image
                    profileUrl: patientData.profileUrl?.url || null,

                    // Status flags
                    isVerified: patientData.isVerified || false,
                    isBlocked: patientData.isBlocked || false,
                    isActive: patientData.isActive || true,
                    about: patientData.about || ""
                };

                setPatient(transformedPatient);

                // Set empty arrays for data that doesn't exist in response
                setAppointments([]);
                setMedications([]);
                setLabResults([]);
                setVaccinations([]);
            } else {
                console.error("No patient data found in response");
            }
        }
    }, [patientFromId, loading, patientId]);

    const calculateAge = (dob) => {
        if (!dob) return "N/A";
        try {
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        } catch (error) {
            return "N/A";
        }
    };

    const calculateBMI = (weight, height) => {
        if (!weight || !height) return "N/A";
        try {
            const weightNum = parseFloat(weight);
            const heightNum = parseFloat(height);
            if (isNaN(weightNum) || isNaN(heightNum)) return "N/A";
            const bmi = weightNum / ((heightNum / 100) ** 2);
            return bmi.toFixed(1);
        } catch (error) {
            return "N/A";
        }
    };

    const tabs = [
        { id: "overview", name: "Overview", icon: User },
        { id: "medical", name: "Medical Records", icon: FileText },
        { id: "appointments", name: "Appointments", icon: Calendar },
        { id: "medications", name: "Medications", icon: Pill },
        { id: "labs", name: "Labs & Tests", icon: Microscope }
    ];

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'upcoming': return 'bg-blue-100 text-blue-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            case 'active': return 'bg-emerald-100 text-emerald-700';
            case 'normal': return 'bg-green-100 text-green-700';
            case 'borderline': return 'bg-yellow-100 text-yellow-700';
            case 'low': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleRetry = () => {
        setFetchAttempted(false);
        setPatient(null);
        dispatch(getPatientByIdThunk(patientId));
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={48} className="text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading patient data...</p>
                    <p className="text-sm text-gray-400 mt-2">Patient ID: {patientId}</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error && !patient) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
                <div className="text-center max-w-md mx-auto p-8 bg-white rounded-sm shadow-sm border border-gray-100">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Patient Data</h2>
                    <p className="text-gray-600 mb-4">{typeof error === 'string' ? error : "Patient not found or unable to load data."}</p>
                    <p className="text-sm text-gray-500 mb-6">Patient ID: {patientId}</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={handleRetry}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // No Data State
    if (!patient && !loading && !error) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
                <div className="text-center max-w-md mx-auto p-8 bg-white rounded-sm shadow-sm border border-gray-100">
                    <User size={48} className="text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">No Patient Data</h2>
                    <p className="text-gray-600 mb-6">No patient data found for ID: {patientId}</p>
                    <button
                        onClick={handleRetry}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-sm p-6 md:p-10 shadow-xl shadow-indigo-100/50 border border-gray-100 mb-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-indigo-600 to-purple-600" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            {patient.profileUrl ? (
                                <img
                                    src={patient.profileUrl}
                                    alt={`${patient.firstName} ${patient.lastName}`}
                                    className="w-28 h-28 md:w-36 md:h-36 rounded-sm object-cover border-2 border-indigo-100"
                                />
                            ) : (
                                <div className="w-28 h-28 md:w-36 md:h-36 bg-linear-to-br from-indigo-50 to-purple-50 rounded-sm border-2 border-indigo-100 flex items-center justify-center text-indigo-600">
                                    <User size={56} strokeWidth={1.5} />
                                </div>
                            )}
                            <button className="absolute -bottom-2 -right-2 p-2.5 bg-purple-600 text-white rounded-sm shadow-lg hover:bg-purple-700 transition-colors border-2 border-white">
                                <Camera size={14} />
                            </button>
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">
                                    {patient.firstName || "Unknown"} {patient.lastName || "Patient"}
                                </h1>
                                <span className={`w-fit mx-auto md:mx-0 px-3 py-1 border text-[9px] font-black uppercase tracking-[0.2em] rounded-sm ${patient.isVerified
                                        ? 'border-green-200 text-green-600 bg-green-50'
                                        : 'border-amber-200 text-amber-600 bg-amber-50'
                                    }`}>
                                    {patient.isVerified ? 'Verified Patient' : 'Unverified Patient'}
                                </span>
                            </div>
                            <p className="text-gray-400 font-bold mb-6 flex items-center justify-center md:justify-start gap-2 text-xs uppercase tracking-widest">
                                <Fingerprint size={14} className="text-purple-500" /> ID: {patient.patientId}
                            </p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-sm font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                                    <Edit3 size={14} /> Edit Profile
                                </button>
                                <button className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-sm font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all">
                                    Security
                                </button>
                                <button className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-sm font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all">
                                    <Download size={14} className="inline mr-1" /> Medical Summary
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs Navigation */}
                <div className="hidden md:flex border-b border-gray-200 mb-8 bg-white rounded-sm px-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-wider transition-all relative ${activeTab === tab.id ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.name}
                            {activeTab === tab.id && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Mobile Tab Selector */}
                <div className="md:hidden mb-6">
                    <select
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-sm text-sm font-bold bg-white"
                    >
                        {tabs.map(tab => (
                            <option key={tab.id} value={tab.id}>{tab.name}</option>
                        ))}
                    </select>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                        <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                            {/* Quick Stats Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 rounded-sm bg-indigo-50 flex items-center justify-center mb-4">
                                        <Calendar size={20} className="text-indigo-600" />
                                    </div>
                                    <p className="text-2xl font-black text-gray-900">{appointments.filter(a => a.status === 'upcoming').length}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Upcoming Appointments</p>
                                </div>
                                <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 rounded-sm bg-purple-50 flex items-center justify-center mb-4">
                                        <Pill size={20} className="text-purple-600" />
                                    </div>
                                    <p className="text-2xl font-black text-gray-900">{medications.filter(m => m.status === 'active').length}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Active Medications</p>
                                </div>
                                <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 rounded-sm bg-blue-50 flex items-center justify-center mb-4">
                                        <Microscope size={20} className="text-blue-600" />
                                    </div>
                                    <p className="text-2xl font-black text-gray-900">{labResults.length}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Lab Reports</p>
                                </div>
                                <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 rounded-sm bg-pink-50 flex items-center justify-center mb-4">
                                        <HeartPulse size={20} className="text-pink-600" />
                                    </div>
                                    <p className="text-2xl font-black text-gray-900">{patient.age}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Age</p>
                                </div>
                            </div>

                            {/* Vitals & Info */}
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Vitals Section */}
                                <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Activity size={18} className="text-indigo-600" />
                                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">Patient Information</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="border-b border-gray-50 pb-2">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Full Name</p>
                                            <p className="text-base font-bold text-gray-800">{patient.firstName} {patient.lastName}</p>
                                        </div>
                                        <div className="border-b border-gray-50 pb-2">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Date of Birth</p>
                                            <p className="text-base font-bold text-gray-800">{new Date(patient.dob).toLocaleDateString()}</p>
                                        </div>
                                        <div className="border-b border-gray-50 pb-2">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Gender</p>
                                            <p className="text-base font-bold text-gray-800">{patient.gender}</p>
                                        </div>
                                        <div className="border-b border-gray-50 pb-2">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Blood Group</p>
                                            <p className="text-base font-bold text-gray-800">{patient.bloodGroup || "Not recorded"}</p>
                                        </div>
                                        <div className="border-b border-gray-50 pb-2">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Patient ID</p>
                                            <p className="text-base font-bold text-gray-800">{patient.patientId}</p>
                                        </div>
                                        <div className="border-b border-gray-50 pb-2">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Status</p>
                                            <p className="text-base font-bold text-gray-800">
                                                {patient.isActive ? 'Active' : 'Inactive'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact & Insurance */}
                                <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <ShieldCheck size={18} className="text-indigo-600" />
                                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">Contact Information</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Email</p>
                                            <p className="text-sm font-semibold text-gray-800">{patient.email || "Not provided"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Phone</p>
                                            <p className="text-sm font-semibold text-gray-800">{patient.phone || "Not provided"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">About</p>
                                            <p className="text-sm font-semibold text-gray-800">{patient.about || "No additional information"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Account Created</p>
                                            <p className="text-sm font-semibold text-gray-800">{new Date(patientFromId?.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Last Updated</p>
                                            <p className="text-sm font-semibold text-gray-800">{new Date(patientFromId?.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <AlertCircle size={18} className="text-amber-600" />
                                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">Account Status</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
                                            <span className="text-sm font-medium text-gray-700">Verified</span>
                                            {patient.isVerified ? (
                                                <CheckCircle size={20} className="text-green-500" />
                                            ) : (
                                                <XCircle size={20} className="text-red-400" />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
                                            <span className="text-sm font-medium text-gray-700">Blocked</span>
                                            {patient.isBlocked ? (
                                                <XCircle size={20} className="text-red-500" />
                                            ) : (
                                                <CheckCircle size={20} className="text-green-500" />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
                                            <span className="text-sm font-medium text-gray-700">Active</span>
                                            {patient.isActive ? (
                                                <CheckCircle size={20} className="text-green-500" />
                                            ) : (
                                                <XCircle size={20} className="text-red-500" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Bell size={18} className="text-red-600" />
                                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">Additional Information</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-gray-50 rounded-sm">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Role</p>
                                            <p className="text-sm font-semibold text-gray-800">{patientFromId?.role || "Patient"}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-sm">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Doctor ID</p>
                                            <p className="text-sm font-semibold text-gray-800">{patientFromId?.doctorId || "Not assigned"}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-sm">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Prescription ID</p>
                                            <p className="text-sm font-semibold text-gray-800">{patientFromId?.prescriptionId || "None"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Other tabs remain the same but will show empty states */}
                    {activeTab === "medical" && (
                        <motion.div key="medical" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <div className="flex items-center gap-3">
                                        <Scissors size={18} className="text-indigo-600" />
                                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">Medical Records</h3>
                                    </div>
                                </div>
                                <div className="p-8 text-center">
                                    <FileText size={48} className="text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No medical records available</p>
                                    <p className="text-xs text-gray-400 mt-2">Medical history will appear here once added</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "appointments" && (
                        <motion.div key="appointments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="flex justify-end">
                                <button className="bg-indigo-600 text-white px-5 py-2 rounded-sm text-[10px] font-black uppercase tracking-wider flex items-center gap-2 hover:bg-indigo-700 transition-all">
                                    <PlusCircle size={14} /> New Appointment
                                </button>
                            </div>
                            <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 text-center">
                                <Calendar size={48} className="text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No appointments scheduled</p>
                                <button className="mt-3 text-indigo-600 text-sm font-medium">Schedule an appointment</button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "medications" && (
                        <motion.div key="medications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 text-center">
                            <Pill size={48} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No active medications</p>
                        </motion.div>
                    )}

                    {activeTab === "labs" && (
                        <motion.div key="labs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 text-center">
                            <Microscope size={48} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No lab results available</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PatientDetail;