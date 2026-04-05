import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Calendar,
    ShieldCheck,
    Camera,
    Fingerprint,
    HeartPulse,
    Download,
    FileText,
    Pill,
    Activity,
    AlertCircle,
    CheckCircle,
    XCircle,
    Loader2,
    Stethoscope,
    Clock3,
    BadgeInfo,
    MapPin,
    UserRound,
    TimerReset,
    ChevronRight,
    CreditCard,
    DollarSign,
    FileCheck,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPatientByIdThunk } from "../../redux/slices/patient.slice";
import { getAppointmentById } from "../../redux/slices/appointment.slice";

// Helper Functions
const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return "N/A";

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const formatDate = (value) => {
    if (!value) return "N/A";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatDateTime = (value) => {
    if (!value) return "N/A";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const PatientDetail = () => {
    const { patientId } = useParams();
    const dispatch = useDispatch();
    const { patientFromId, loading, error } = useSelector((state) => state.patient);
    const { appointmentsMap, loading: appointmentLoading } = useSelector((state) => state.appointment);

    const [activeTab, setActiveTab] = useState("overview");
    const [fetchAttempted, setFetchAttempted] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const fetchedIdsRef = useRef(new Set());

    // Fetch patient data
    useEffect(() => {
        if (patientId && !fetchAttempted) {
            dispatch(getPatientByIdThunk(patientId));
            setFetchAttempted(true);
        }
    }, [dispatch, patientId, fetchAttempted]);

    // Process patient data
    const patient = useMemo(() => {
        const raw = patientFromId?.patient ?? patientFromId ?? null;
        if (!raw || typeof raw !== "object") return null;
        return raw;
    }, [patientFromId]);

    // Fetch all appointments for this patient
    useEffect(() => {
        if (!patient) return;

        const allIds = [
            ...(patient.appointmentIds || []),
            ...(patient.previousAppointmentIds || []),
        ];

        allIds.forEach((id) => {
            if (id && !fetchedIdsRef.current.has(id)) {
                fetchedIdsRef.current.add(id);
                dispatch(getAppointmentById(id));
            }
        });
    }, [dispatch, patient]);

    // Handle appointment view
    const handleViewAppointment = useCallback((appointmentId) => {
        if (appointmentId && appointmentsMap[appointmentId]) {
            setSelectedAppointment(appointmentsMap[appointmentId]);
        }
    }, [appointmentsMap]);

    const handleRetry = () => {
        setFetchAttempted(false);
        dispatch(getPatientByIdThunk(patientId));
    };

    const tabs = [
        { id: "overview", name: "Overview", icon: User },
        { id: "appointments", name: "Appointments", icon: Calendar },
        { id: "reports", name: "Reports", icon: FileText },
        { id: "prescriptions", name: "Prescriptions", icon: Pill },
    ];

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={48} className="text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading patient data...</p>
                    <p className="text-sm text-gray-400 mt-2">Patient ID: {patientId}</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !patient) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-sm shadow-xl border border-indigo-100 p-8 text-center">
                    <AlertCircle size={48} className="text-rose-600 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Patient Data</h2>
                    <p className="text-gray-600 mb-4">
                        {typeof error === "string" ? error : "Patient not found or unable to load data."}
                    </p>
                    <p className="text-sm text-gray-500 mb-6">Patient ID: {patientId}</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={handleRetry}
                            className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-200"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // No data state
    if (!patient && !loading && !error) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-sm shadow-xl border border-indigo-100 p-8 text-center">
                    <User size={48} className="text-indigo-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">No Patient Data</h2>
                    <p className="text-gray-600 mb-6">No patient data found for ID: {patientId}</p>
                    <button
                        onClick={handleRetry}
                        className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-200"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const profileName = `${patient.firstName || "Unknown"} ${patient.lastName || "Patient"}`;
    const upcomingAppointments = patient.appointmentIds || [];
    const previousAppointments = patient.previousAppointmentIds || [];

    return (
        <div className="min-h-screen bg-linear-to-br pt-14 from-slate-50 via-indigo-50/20 to-purple-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                {/* Header Section - Same as before */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-sm p-6 md:p-8 shadow-xl shadow-indigo-100/50 border border-indigo-100 mb-8 overflow-hidden relative"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600" />
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                        <div className="relative">
                            {patient.profileUrl?.url ? (
                                <img
                                    src={patient.profileUrl.url}
                                    alt={profileName}
                                    className="w-28 h-28 md:w-36 md:h-36 rounded-sm object-cover border-2 border-indigo-200 shadow-lg"
                                />
                            ) : (
                                <div className="w-28 h-28 md:w-36 md:h-36 rounded-sm bg-linear-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center text-indigo-600">
                                    <User size={56} strokeWidth={1.5} />
                                </div>
                            )}
                            <button className="absolute -bottom-2 -right-2 p-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 border-2 border-white">
                                <Camera size={14} />
                            </button>
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl font-black bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                                    {profileName}
                                </h1>
                                <span className={`w-fit mx-auto md:mx-0 px-3 py-1 border text-[9px] font-black uppercase tracking-[0.2em] rounded-full ${patient.isVerified ? "border-teal-200 text-teal-600 bg-teal-50" : "border-rose-200 text-rose-600 bg-rose-50"}`}>
                                    {patient.isVerified ? "Verified Patient" : "Unverified Patient"}
                                </span>
                            </div>
                            <p className="text-gray-400 font-bold mb-6 flex items-center justify-center md:justify-start gap-2 text-xs uppercase tracking-widest">
                                <Fingerprint size={14} className="text-purple-500" />
                                ID: {patient.patientId || patientId}
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <button className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-sm font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-200">
                                    <Download size={14} /> Medical Summary
                                </button>
                                <button className="bg-white border border-indigo-200 text-gray-700 px-6 py-2.5 rounded-sm font-black uppercase tracking-widest text-[10px] hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200">
                                    Security
                                </button>
                                <button className="bg-white border border-indigo-200 text-gray-700 px-6 py-2.5 rounded-sm font-black uppercase tracking-widest text-[10px] hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200">
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs Navigation */}
                <div className="hidden md:flex gap-2 border border-indigo-100 bg-white rounded-sm p-2 mb-8 overflow-x-auto shadow-sm">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex items-center gap-2 px-5 py-3 rounded-sm text-xs font-black uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${active ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md" : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"}`}
                            >
                                <Icon size={16} />
                                {tab.name}
                            </button>
                        );
                    })}
                </div>

                <div className="md:hidden mb-6">
                    <select
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value)}
                        className="w-full p-3 border border-indigo-200 rounded-sm text-sm font-bold bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    >
                        {tabs.map((tab) => (
                            <option key={tab.id} value={tab.id}>
                                {tab.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard icon={Calendar} title="Upcoming Appointments" value={upcomingAppointments.length} iconClass="text-indigo-600" bgClass="bg-indigo-50" />
                                <StatCard icon={FileText} title="Reports" value={patient.reportIds?.length || 0} iconClass="text-purple-600" bgClass="bg-purple-50" />
                                <StatCard icon={Pill} title="Prescriptions" value={patient.prescriptionIds?.length || 0} iconClass="text-indigo-600" bgClass="bg-indigo-50" />
                                <StatCard icon={HeartPulse} title="Age" value={calculateAge(patient.dob)} iconClass="text-purple-600" bgClass="bg-purple-50" />
                            </div>
                            <div className="grid lg:grid-cols-2 gap-8">
                                <InfoCard title="Patient Information" icon={Activity} items={[["Full Name", profileName], ["Date of Birth", formatDate(patient.dob)], ["Gender", patient.gender || "Not recorded"], ["Blood Group", patient.bloodGroup || "Not recorded"], ["Patient ID", patient.patientId || patientId], ["Status", patient.isActive ? "Active" : "Inactive"]]} />
                                <InfoCard title="Contact Information" icon={ShieldCheck} items={[["Email", patient.email || "Not provided"], ["Phone", patient.phone || "Not provided"], ["Role", patient.role || "Patient"], ["Created At", formatDateTime(patient.createdAt)], ["Updated At", formatDateTime(patient.updatedAt)], ["About", patient.about || "No additional information"]]} />
                            </div>
                            <div className="grid lg:grid-cols-2 gap-8">
                                <StatusCard title="Account Status" icon={BadgeInfo} rows={[["Verified", patient.isVerified], ["Blocked", patient.isBlocked], ["Active", patient.isActive]]} />
                                <InfoCard title="Associated Doctors" icon={Stethoscope} items={patient.doctorIds?.length > 0 ? patient.doctorIds.map((id, index) => [`Doctor ${index + 1}`, id]) : [["Doctors", "No doctors assigned"]]} />
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "appointments" && (
                        <motion.div
                            key="appointments"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-8"
                        >
                            <AppointmentSection
                                title="Upcoming Appointments"
                                subtitle="All upcoming appointments linked to this patient"
                                icon={Calendar}
                                appointmentIds={upcomingAppointments}
                                appointmentsMap={appointmentsMap}
                                onViewAppointment={handleViewAppointment}
                                loading={appointmentLoading}
                            />
                            <AppointmentSection
                                title="Previous Appointments"
                                subtitle="Completed appointment history"
                                icon={Clock3}
                                appointmentIds={previousAppointments}
                                appointmentsMap={appointmentsMap}
                                onViewAppointment={handleViewAppointment}
                                loading={appointmentLoading}
                                isPrevious
                            />
                        </motion.div>
                    )}

                    {activeTab === "reports" && (
                        <motion.div key="reports" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                            <SectionHeader title="Reports" subtitle="Patient lab reports and medical documents" icon={FileText} />
                            <DataSection emptyText="No reports available" icon={FileText} items={(patient.reportIds || []).map((id, index) => ({ title: `Report #${index + 1}`, value: id, badge: "Report", badgeClass: "bg-indigo-100 text-indigo-700" }))} />
                        </motion.div>
                    )}

                    {activeTab === "prescriptions" && (
                        <motion.div key="prescriptions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                            <SectionHeader title="Prescriptions" subtitle="All prescription records linked to this patient" icon={Pill} />
                            <DataSection emptyText="No prescriptions available" icon={Pill} items={(patient.prescriptionIds || []).map((id, index) => ({ title: `Prescription #${index + 1}`, value: id, badge: "Prescription", badgeClass: "bg-purple-100 text-purple-700" }))} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {selectedAppointment && (
                <AppointmentDetailsModal
                    appointment={selectedAppointment}
                    loading={appointmentLoading}
                    onClose={() => setSelectedAppointment(null)}
                />
            )}
        </div>
    );
};

// Appointment Section Component - UPDATED to use appointmentsMap
const AppointmentSection = ({
    title,
    subtitle,
    icon: Icon,
    appointmentIds,
    appointmentsMap,
    onViewAppointment,
    loading,
    isPrevious = false
}) => {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-teal-100 text-teal-700';
            case 'approved': return 'bg-emerald-100 text-emerald-700';
            case 'cancelled': return 'bg-rose-100 text-rose-700';
            case 'pending': return 'bg-amber-100 text-amber-700';
            default: return isPrevious ? 'bg-teal-100 text-teal-700' : 'bg-indigo-100 text-indigo-700';
        }
    };

    const getDisplayTitle = (appointment) => {
        if (appointment?.reason) return appointment.reason;
        if (appointment?.chiefComplaint) return appointment.chiefComplaint;
        if (appointment?.visitType) return appointment.visitType;
        if (appointment?.type) return appointment.type;
        if (appointment?.name) return `Appointment with ${appointment.name}`;
        return "Medical Consultation";
    };

    const getDoctorInfo = (appointment) => {
        if (appointment?.doctorId?.name) return appointment.doctorId.name;
        if (appointment?.doctorName) return appointment.doctorName;
        if (appointment?.doctorId && typeof appointment.doctorId === 'string') return "Doctor";
        return "Doctor Assigned";
    };

    if (!appointmentIds?.length) {
        return (
            <div className="space-y-4">
                <SectionHeader title={title} subtitle={subtitle} icon={Icon} />
                <div className="bg-white rounded-sm shadow-md border border-indigo-100 p-8 text-center">
                    <Icon size={48} className="text-indigo-300 mx-auto mb-3" />
                    <p className="text-gray-500">No {title.toLowerCase()} found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <SectionHeader title={title} subtitle={subtitle} icon={Icon} />
            <div className="grid gap-4">
                {appointmentIds.map((id, index) => {
                    const appointment = appointmentsMap?.[id];
                    return (
                        <motion.div
                            key={id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => appointment && onViewAppointment(id)}
                            className={`bg-white rounded-sm shadow-md border border-indigo-100 p-5 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 ${appointment ? 'cursor-pointer' : 'cursor-default'} group`}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-sm bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                                        <Calendar size={20} className="text-indigo-600" />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h4 className="text-base font-bold text-gray-900">
                                                {appointment ? getDisplayTitle(appointment) : `Appointment #${index + 1}`}
                                            </h4>
                                            {appointment?.status && (
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(appointment.status)}`}>
                                                    {appointment.status}
                                                </span>
                                            )}
                                            {appointment?.appointmentId && (
                                                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-gray-100 text-gray-600">
                                                    {appointment.appointmentId}
                                                </span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                                            <p className="flex items-center gap-2">
                                                <Calendar size={14} className="text-indigo-500" />
                                                {appointment ? formatDate(appointment.appointmentDate) : 'Loading...'}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <TimerReset size={14} className="text-indigo-500" />
                                                {appointment?.approvedTimeSlot || appointment?.requestedTimeSlot || 'N/A'}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <UserRound size={14} className="text-indigo-500" />
                                                {appointment ? getDoctorInfo(appointment) : 'Loading...'}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><CreditCard size={13} /> Payment: {appointment?.paymentStatus || 'N/A'}</span>
                                            <span className="flex items-center gap-1"><DollarSign size={13} /> Mode: {appointment?.paymentMode || 'N/A'}</span>
                                            <span className="break-all font-mono text-[10px]">ID: {id.slice(-8)}</span>
                                        </div>
                                    </div>
                                </div>
                                {appointment && (
                                    <div className="flex items-center gap-3 lg:border-l lg:border-indigo-100 lg:pl-4">
                                        <ChevronRight size={20} className="text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-200" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// Appointment Details Modal
const AppointmentDetailsModal = ({ appointment, loading, onClose }) => {
    if (!appointment) return null;

    const getStatusBadge = (status) => {
        const styles = { completed: 'bg-teal-100 text-teal-700', approved: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-rose-100 text-rose-700', pending: 'bg-amber-100 text-amber-700' };
        return styles[status?.toLowerCase()] || 'bg-gray-100 text-gray-700';
    };

    const getPaymentStatusBadge = (status) => {
        return status?.toLowerCase() === 'paid' ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-sm shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                <div className="sticky top-0 bg-white border-b border-indigo-100 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2"><FileCheck className="text-indigo-600" size={20} /><h3 className="text-lg font-bold text-gray-900">Appointment Details</h3></div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"><XCircle size={24} /></button>
                </div>
                {loading ? (
                    <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" size={32} /><p className="mt-2 text-gray-500">Loading appointment details...</p></div>
                ) : (
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-indigo-100">
                                <div><p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Appointment ID</p><p className="text-sm font-mono text-gray-800 mt-1">{appointment.appointmentId || appointment._id?.slice(-8)}</p></div>
                                <div><p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Status</p><span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(appointment.status)}`}>{appointment.status || 'pending'}</span></div>
                            </div>
                            <div className="bg-indigo-50 p-4 rounded-sm">
                                <h4 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2"><User size={16} /> Patient Information</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><p className="text-xs text-indigo-600">Name</p><p className="text-sm font-semibold text-gray-800">{appointment.name || 'N/A'}</p></div>
                                    <div><p className="text-xs text-indigo-600">Email</p><p className="text-sm font-semibold text-gray-800">{appointment.email || 'N/A'}</p></div>
                                    <div><p className="text-xs text-indigo-600">Gender</p><p className="text-sm font-semibold text-gray-800">{appointment.gender || 'N/A'}</p></div>
                                    <div><p className="text-xs text-indigo-600">Relation</p><p className="text-sm font-semibold text-gray-800">{appointment.relation || 'Self'}</p></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-purple-50 p-3 rounded-sm"><p className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1"><Calendar size={12} /> Date</p><p className="text-sm font-semibold text-gray-800 mt-1">{appointment.appointmentDate ? formatDate(appointment.appointmentDate) : 'N/A'}</p></div>
                                <div className="bg-purple-50 p-3 rounded-sm"><p className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1"><TimerReset size={12} /> Time Slot</p><p className="text-sm font-semibold text-gray-800 mt-1">{appointment.approvedTimeSlot || appointment.requestedTimeSlot || 'N/A'}</p></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-amber-50 p-3 rounded-sm"><p className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1"><CreditCard size={12} /> Payment Status</p><p className="text-sm font-semibold mt-1"><span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getPaymentStatusBadge(appointment.paymentStatus)}`}>{appointment.paymentStatus || 'pending'}</span></p></div>
                                <div className="bg-emerald-50 p-3 rounded-sm"><p className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1"><DollarSign size={12} /> Payment Mode</p><p className="text-sm font-semibold text-gray-800 mt-1">{appointment.paymentMode || 'N/A'}</p></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Slot ID</p><p className="text-sm text-gray-800 mt-1">{appointment.slotId || 'N/A'}</p></div>
                                <div><p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Visited Status</p><p className="text-sm text-gray-800 mt-1">{appointment.isVisited ? 'Yes' : 'No'}</p></div>
                            </div>
                            {appointment.notes && (<div><p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Notes</p><div className="bg-gray-50 p-3 rounded-sm"><p className="text-sm text-gray-700">{appointment.notes}</p></div></div>)}
                            <div className="border-t border-indigo-100 pt-4 text-xs text-gray-500">
                                <div className="flex justify-between"><span>Created: {formatDateTime(appointment.createdAt)}</span><span>Updated: {formatDateTime(appointment.updatedAt)}</span></div>
                                {appointment.completedAt && (<div className="mt-1 text-right">Completed: {formatDateTime(appointment.completedAt)}</div>)}
                            </div>
                            {appointment.qrCode && (<div className="border-t border-indigo-100 pt-4"><p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">QR Code</p><div className="flex justify-center"><img src={appointment.qrCode} alt="Appointment QR Code" className="w-32 h-32 object-contain border border-gray-200 rounded-sm p-2" /></div></div>)}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ icon: Icon, title, value, iconClass, bgClass }) => {
    return (<div className="bg-white rounded-sm p-5 shadow-md border border-indigo-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-200"><div className={`w-10 h-10 rounded-sm ${bgClass} flex items-center justify-center mb-4`}><Icon size={20} className={iconClass} /></div><p className="text-2xl font-black bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{value}</p><p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mt-1">{title}</p></div>);
};

// Info Card Component
const InfoCard = ({ title, icon: Icon, items }) => {
    return (<div className="bg-white rounded-sm p-6 shadow-md border border-indigo-100 hover:shadow-lg transition-all duration-200"><div className="flex items-center gap-3 mb-6"><div className="w-8 h-8 rounded-sm bg-linear-to-r from-indigo-600 to-purple-600 flex items-center justify-center"><Icon size={16} className="text-white" /></div><h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">{title}</h3></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{items.map(([label, value]) => (<div key={label} className="border-b border-indigo-50 pb-2"><p className="text-[9px] font-black text-indigo-500 uppercase tracking-wider">{label}</p><p className="text-sm font-semibold text-gray-800 wrap-break-word mt-1">{value}</p></div>))}</div></div>);
};

// Status Card Component
const StatusCard = ({ title, icon: Icon, rows }) => {
    return (<div className="bg-white rounded-sm p-6 shadow-md border border-indigo-100 hover:shadow-lg transition-all duration-200"><div className="flex items-center gap-3 mb-6"><div className="w-8 h-8 rounded-sm bg-linear-to-r from-indigo-600 to-purple-600 flex items-center justify-center"><Icon size={16} className="text-white" /></div><h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">{title}</h3></div><div className="space-y-3">{rows.map(([label, value]) => (<div key={label} className="flex items-center justify-between p-3 bg-linear-to-r from-indigo-50/30 to-purple-50/30 rounded-sm"><span className="text-sm font-medium text-gray-700">{label}</span>{value ? <CheckCircle size={20} className="text-teal-500" /> : <XCircle size={20} className="text-rose-500" />}</div>))}</div></div>);
};

// Section Header Component
const SectionHeader = ({ title, subtitle, icon: Icon }) => {
    return (<div className="bg-white rounded-sm shadow-md border border-indigo-100 px-6 py-4"><div className="flex items-start gap-3"><div className="w-10 h-10 rounded-sm bg-linear-to-r from-indigo-100 to-purple-100 flex items-center justify-center"><Icon size={18} className="text-indigo-600" /></div><div><h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">{title}</h3><p className="text-xs text-gray-500 mt-1">{subtitle}</p></div></div></div>);
};

// Data Section Component
const DataSection = ({ items, emptyText, icon: Icon }) => {
    if (!items?.length) {
        return (<div className="bg-white rounded-sm shadow-md border border-indigo-100 p-8 text-center"><Icon size={48} className="text-indigo-300 mx-auto mb-3" /><p className="text-gray-500">{emptyText}</p></div>);
    }
    return (<div className="grid gap-4">{items.map((item, index) => (<motion.div key={item.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="bg-white rounded-sm shadow-md border border-indigo-100 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:shadow-lg hover:border-indigo-200 transition-all duration-200"><div><p className="text-sm font-bold text-gray-900">{item.title}</p><p className="text-xs text-gray-500 break-all mt-1 font-mono">{item.value}</p></div><div className="flex items-center gap-3">{item.badge && (<span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.badgeClass}`}>{item.badge}</span>)}</div></motion.div>))}</div>);
};

export default PatientDetail;