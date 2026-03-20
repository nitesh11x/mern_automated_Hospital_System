import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    User,
    ChevronRight,
    ShieldCheck,
    Check,
    ChevronDown,
    Search,
    Stethoscope,
    Activity,
    Zap,
    RefreshCw
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { getAllDoctorsThunk } from "../../redux/slices/doctor.slice";
import {
    bookAppointment,
    resetBookingState,
} from "../../redux/slices/appointment.slice";
import { notifyProcessingAppointmentThunk } from "../../redux/slices/notification.slice";

const BookAppointmentOfSpecificDoctor = () => {
    const dispatch = useDispatch();
    const { doctorId } = useParams();

    const { doctors } = useSelector((state) => state.doctor);
    const {
        loading: bookingLoading,
        bookingSuccess,
        error,
    } = useSelector((state) => state.appointment);

    const [isOpen, setIsOpen] = useState(false);
    const [docSearch, setDocSearch] = useState("");

    const [formData, setFormData] = useState({
        doctorId: "",
        selectedDocName: "Assign Specialist",
        name: "",
        email: "",
        gender: "",
        relation: "Self",
        appointmentDate: "",
        requestedTimeSlot: "",
        paymentMode: "Offline",
        isVisited: false, // Initialized as boolean
    });

    // Handle URL Params: Find and set the doctor if doctorId is present
    useEffect(() => {
        if (doctors?.length > 0 && doctorId) {
            const selectedDoctor = doctors.find(
                (doc) => doc._id?.toString() === doctorId
            );

            if (selectedDoctor) {
                setFormData((prev) => ({
                    ...prev,
                    doctorId: selectedDoctor._id,
                    selectedDocName: `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
                }));
            }
        }
    }, [doctorId, doctors]);

    const minDateValue = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date.toISOString().split("T")[0];
    }, []);

    const formatTo12Hr = (time24) => {
        if (!time24) return "";
        const [hours, minutes] = time24.split(":");
        const h = hours % 12 || 12;
        const ampm = hours >= 12 ? "PM" : "AM";
        return `${h}:${minutes} ${ampm}`;
    };

    useEffect(() => {
        if (!doctors || doctors.length === 0) {
            dispatch(getAllDoctorsThunk());
        }
    }, [dispatch, doctors]);

    useEffect(() => {
        if (bookingSuccess) {
            toast.success("Schedule Synchronized");
            dispatch(notifyProcessingAppointmentThunk({ email: formData.email, name: formData.name }));
            setFormData({
                doctorId: "",
                selectedDocName: "Assign Specialist",
                name: "",
                email: "",
                gender: "",
                relation: "Self",
                appointmentDate: "",
                requestedTimeSlot: "",
                paymentMode: "Offline",
                isVisited: false,
            });
            dispatch(resetBookingState());
        }
        if (error) {
            toast.error(error);
            dispatch(resetBookingState());
        }
    }, [bookingSuccess, error, dispatch, formData.email, formData.name]);


    const filteredDoctors = useMemo(() => {
        if (!doctors) return [];
        return doctors.filter((doc) =>
            `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(docSearch.toLowerCase()) ||
            doc.specialization?.toLowerCase().includes(docSearch.toLowerCase())
        );
    }, [doctors, docSearch]);

    const handleSelectDoctor = (doc) => {
        setFormData((prev) => ({
            ...prev,
            doctorId: doc._id,
            selectedDocName: `Dr. ${doc.firstName} ${doc.lastName}`,
        }));
        setIsOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Fix for isVisited functionality: convert string value to boolean
        const finalValue = name === "isVisited" ? value === "true" : value;
        setFormData((prev) => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.doctorId) return toast.error("Please assign a specialist");

        const submissionData = {
            ...formData,
            requestedTimeSlot: formatTo12Hr(formData.requestedTimeSlot)
        };
        dispatch(bookAppointment(submissionData));
    };

    return (
        <div className="min-h-screen bg-[#FDFDFF] pt-24 pb-20 px-4 md:px-8 selection:bg-indigo-100">
            <div className="max-w-6xl mx-auto">

                {/* --- HEADER --- */}
                <header className="mb-14 border-l-4 border-indigo-600 pl-6 relative">
                    <div className="flex items-center gap-3 mb-2">
                        <Zap size={16} className="text-indigo-600 fill-indigo-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Secure Intake Protocol</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase italic">
                        Book <span className="text-indigo-600">Consultation</span>
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* --- MAIN FORM --- */}
                    <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">

                        {/* 01. SPECIALIST PICKER */}
                        <section className="bg-white border border-slate-200 shadow-sm p-8 rounded-sm">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 flex items-center gap-2 tracking-widest">
                                <Stethoscope size={14} className="text-indigo-600" /> 01. Specialist Unit
                            </h3>

                            <div className="relative z-50">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 border border-slate-200 rounded-sm text-sm font-bold text-slate-800 hover:bg-white transition-all outline-none focus:border-indigo-600"
                                >
                                    <span>{formData.selectedDocName}</span>
                                    <ChevronDown size={18} className={`text-indigo-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-2xl rounded-sm overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                                    <input
                                                        type="text"
                                                        placeholder="FILTER EXPERTS..."
                                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-sm text-[11px] font-bold uppercase tracking-widest outline-none focus:border-indigo-600"
                                                        value={docSearch}
                                                        onChange={(e) => setDocSearch(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="max-h-60 overflow-y-auto">
                                                {filteredDoctors.map((doc) => (
                                                    <button
                                                        key={doc._id}
                                                        type="button"
                                                        onClick={() => handleSelectDoctor(doc)}
                                                        className="w-full flex items-center justify-between p-4 hover:bg-indigo-600 hover:text-white transition-all text-left group border-b border-slate-50"
                                                    >
                                                        <div>
                                                            <p className="text-xs font-black uppercase tracking-tight">Dr. {doc.firstName} {doc.lastName}</p>
                                                            <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100">{doc.specialization}</p>
                                                        </div>
                                                        {formData.doctorId === doc._id && <Check size={16} className="text-indigo-400 group-hover:text-white" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </section>

                        {/* 02. PATIENT DATA */}
                        <section className="bg-white border border-slate-200 shadow-sm p-8 rounded-sm">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-8 flex items-center gap-2 tracking-widest">
                                <User size={14} className="text-indigo-600" /> 02. Patient Dossier
                            </h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <FormGroup label="Full Legal Name">
                                    <input name="name" placeholder="JOHN DOE" value={formData.name} onChange={handleChange} required />
                                </FormGroup>
                                <FormGroup label="Patient Email">
                                    <input name="email" type="email" placeholder="EMAIL@NETWORK.COM" value={formData.email} onChange={handleChange} required />
                                </FormGroup>
                                <FormGroup label="Gender">
                                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                                        <option value="">SELECT</option>
                                        <option value="Male">MALE</option>
                                        <option value="Female">FEMALE</option>
                                        <option value="Other">OTHER</option>
                                    </select>
                                </FormGroup>
                                <FormGroup label="Relation">
                                    <select name="relation" value={formData.relation} onChange={handleChange}>
                                        <option value="Self">SELF / PRIMARY</option>
                                        <option value="Parent">PARENT</option>
                                        <option value="Other">OTHER</option>
                                    </select>
                                </FormGroup>
                            </div>
                        </section>

                        {/* 03. LOGISTICS */}
                        <section className="bg-white border border-slate-200 shadow-sm p-8 rounded-sm">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-8 flex items-center gap-2 tracking-widest">
                                <Calendar size={14} className="text-indigo-600" /> 03. Scheduling & Case Type
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <FormGroup label="Visit Date">
                                    <input type="date" name="appointmentDate" min={minDateValue} value={formData.appointmentDate} onChange={handleChange} required />
                                </FormGroup>
                                <FormGroup label="Time Slot">
                                    <input type="time" name="requestedTimeSlot" value={formData.requestedTimeSlot} onChange={handleChange} required />
                                </FormGroup>
                                <FormGroup label="Payment Mode">
                                    <select name="paymentMode" value={formData.paymentMode} onChange={handleChange}>
                                        <option value="Offline">OFFLINE</option>
                                        <option value="Online">ONLINE</option>
                                    </select>
                                </FormGroup>
                                <FormGroup label="Is Follow-up?">
                                    <select name="isVisited" value={formData.isVisited.toString()} onChange={handleChange}>
                                        <option value="false">NO (NEW CASE)</option>
                                        <option value="true">YES (FOLLOW-UP)</option>
                                    </select>
                                </FormGroup>
                            </div>
                        </section>

                        <button
                            type="submit"
                            disabled={bookingLoading}
                            className="w-full bg-slate-900 text-white py-6 rounded-sm font-black text-[11px] uppercase tracking-[0.4em] hover:bg-indigo-600 shadow-lg active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {bookingLoading ? "INITIALIZING NODE..." : "Secure Appointment"}
                            {!bookingLoading && <ChevronRight size={18} />}
                        </button>
                    </form>

                    {/* --- SIDEBAR SUMMARY --- */}
                    <aside className="lg:col-span-4">
                        <div className="bg-slate-900 rounded-sm p-8 sticky top-28 border border-slate-800 shadow-2xl">
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-10 pb-4 border-b border-slate-800">
                                    <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Visit Ledger</h3>
                                    <Activity size={14} className="text-indigo-400" />
                                </div>

                                <div className="space-y-8">
                                    <SummaryItem label="Assigned Expert" value={formData.selectedDocName} />
                                    <SummaryItem
                                        label="Timeline"
                                        value={formData.appointmentDate ? `${formData.appointmentDate} @ ${formatTo12Hr(formData.requestedTimeSlot) || 'TBD'}` : "NOT SCHEDULED"}
                                    />
                                    <SummaryItem label="Primary Patient" value={formData.name || "AWAITING..."} />

                                    {/* Is Visited Badge */}
                                    <div>
                                        <p className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2">/ Case Classification</p>
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border text-[9px] font-black uppercase tracking-widest ${formData.isVisited ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                                            {formData.isVisited ? <><RefreshCw size={10} /> Follow-up</> : "Initial Intake"}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-sm">
                                    <div className="flex items-center gap-2 text-indigo-400 mb-3">
                                        <ShieldCheck size={16} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Secure Network</span>
                                    </div>
                                    <p className="text-[9px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight">
                                        Clinical data is processed via AES-256 encrypted channels.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

// --- HELPERS ---

const FormGroup = ({ label, children }) => {
    const child = React.Children.only(children);
    return (
        <div className="flex flex-col gap-2 group">
            <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest group-focus-within:text-indigo-600 transition-colors">
                {label}
            </label>
            <div className="relative">
                {React.cloneElement(child, {
                    className: `w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-[12px] font-black text-slate-900 uppercase tracking-tight outline-none transition-all focus:bg-white focus:border-indigo-600 placeholder:text-slate-300 ${child.props.className || ""}`
                })}
            </div>
        </div>
    );
};

const SummaryItem = ({ label, value }) => (
    <div>
        <p className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em] mb-1">/ {label}</p>
        <p className="text-xs font-black text-white uppercase tracking-wider truncate transition-colors">{value}</p>
    </div>
);

export default BookAppointmentOfSpecificDoctor;