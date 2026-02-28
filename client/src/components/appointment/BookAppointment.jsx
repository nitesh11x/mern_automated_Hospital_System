import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Clock,
    User,
    Mail,
    ChevronRight,
    ShieldCheck,
    HeartPulse,
    Check,
    ChevronDown,
    Search,
    Stethoscope,
    Users,
    CreditCard,
    AlertCircle
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { getAllDoctorsThunk } from "../../redux/slices/doctor.slice";
import {
    bookAppointment,
    resetBookingState,
} from "../../redux/slices/appointment.slice";

const BookAppointment = () => {
    const dispatch = useDispatch();

    // Redux State
    const { doctors } = useSelector((state) => state.doctor);
    const {
        loading: bookingLoading,
        bookingSuccess,
        error,
    } = useSelector((state) => state.appointment);

    // Local UI State
    const [isOpen, setIsOpen] = useState(false);
    const [docSearch, setDocSearch] = useState("");

    const [formData, setFormData] = useState({
        doctorId: "",
        selectedDocName: "Select a Specialist",
        name: "",
        email: "",
        gender: "",
        relation: "Self",
        appointmentDate: "",
        requestedTimeSlot: "",
        paymentMode: "Offline",
    });

    // --- HELPER LOGIC ---

    // Calculate minimum allowed date (Today + 2 Days)
    const minDateValue = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + 2);
        return date.toISOString().split("T")[0];
    }, []);

    // Format 24h input to 12h AM/PM for preview/submission
    const formatTo12Hr = (time24) => {
        if (!time24) return "";
        const [hours, minutes] = time24.split(":");
        const h = hours % 12 || 12;
        const ampm = hours >= 12 ? "PM" : "AM";
        return `${h}:${minutes} ${ampm}`;
    };

    // --- EFFECTS ---

    useEffect(() => {
        if (!doctors || doctors.length === 0) {
            dispatch(getAllDoctorsThunk());
        }
    }, [dispatch, doctors]);

    useEffect(() => {
        if (bookingSuccess) {
            toast.success("Appointment Request Sent Successfully!");
            setFormData({
                doctorId: "",
                selectedDocName: "Select a Specialist",
                name: "",
                email: "",
                gender: "",
                relation: "Self",
                appointmentDate: "",
                requestedTimeSlot: "",
                paymentMode: "Offline",
            });
            dispatch(resetBookingState());
        }
        if (error) {
            toast.error(error);
        }
    }, [bookingSuccess, error, dispatch]);

    // --- HANDLERS ---

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
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Strict Validations
        if (!formData.doctorId) return toast.error("Please select a specialist");
        if (!formData.name) return toast.error("Patient name is required");
        if (!formData.appointmentDate) return toast.error("Please select a date");
        if (!formData.requestedTimeSlot) return toast.error("Please select a time slot");

        // Convert time to 12hr format before dispatching
        const submissionData = {
            ...formData,
            requestedTimeSlot: formatTo12Hr(formData.requestedTimeSlot)
        };

        dispatch(bookAppointment(submissionData));
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] pt-28 pb-20 px-4 md:px-8 font-sans">
            <div className="max-w-6xl mx-auto">

                <header className="mb-10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-indigo-600 rounded-sm text-white">
                            <HeartPulse size={16} />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Secure / Clinical Booking</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                        Confirm <span className="text-indigo-600">Consultation</span>
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT COLUMN: FORM */}
                    <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">

                        {/* 01. SPECIALIST BENTO */}
                        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm relative z-50">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4 flex items-center gap-2 tracking-[0.2em]">
                                <Stethoscope size={14} className="text-indigo-500" /> 01. Specialist Assignment
                            </h3>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-white hover:border-indigo-400 transition-all focus:ring-4 focus:ring-indigo-500/5 outline-none"
                                >
                                    <span className={formData.doctorId ? "text-slate-900" : "text-slate-400"}>
                                        {formData.selectedDocName}
                                    </span>
                                    <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-2xl rounded-xl overflow-hidden z-50"
                                        >
                                            <div className="p-3 bg-slate-50 border-b">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                                    <input
                                                        type="text"
                                                        placeholder="Filter specialists..."
                                                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-sm text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                                                        value={docSearch}
                                                        onChange={(e) => setDocSearch(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                                                {filteredDoctors.map((doc) => (
                                                    <button
                                                        key={doc._id}
                                                        type="button"
                                                        onClick={() => handleSelectDoctor(doc)}
                                                        className="w-full flex items-center justify-between p-3.5 hover:bg-indigo-50 rounded-xl transition-colors group"
                                                    >
                                                        <div className="text-left">
                                                            <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600">Dr. {doc.firstName} {doc.lastName}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{doc.specialization}</p>
                                                        </div>
                                                        {formData.doctorId === doc._id && <Check size={16} className="text-indigo-600" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* 02. PATIENT BENTO */}
                        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 flex items-center gap-2 tracking-[0.2em]">
                                <User size={14} className="text-indigo-500" /> 02. Patient Identity
                            </h3>
                            <div className="grid md:grid-cols-2 gap-5">
                                <FormGroup label="Full Name" icon={<User size={14} />}>
                                    <input name="name" placeholder="Full Legal Name" value={formData.name} onChange={handleChange} />
                                </FormGroup>
                                <FormGroup label="Email Address" icon={<Mail size={14} />}>
                                    <input name="email" type="email" placeholder="email@address.com" value={formData.email} onChange={handleChange} />
                                </FormGroup>
                                <FormGroup label="Biological Gender" icon={<Users size={14} />}>
                                    <select name="gender" value={formData.gender} onChange={handleChange}>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </FormGroup>
                                <FormGroup label="Relationship" icon={<Users size={14} />}>
                                    <select name="relation" value={formData.relation} onChange={handleChange}>
                                        <option value="Self">Self</option>
                                        <option value="Parent">Parent</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </FormGroup>
                            </div>
                        </div>

                        {/* 03. LOGISTICS BENTO */}
                        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 flex items-center gap-2 tracking-[0.2em]">
                                <Clock size={14} className="text-indigo-500" /> 03. Logistics & Billing
                            </h3>
                            <div className="grid md:grid-cols-3 gap-5">
                                <FormGroup label="Select Date" icon={<Calendar size={14} />}>
                                    <input
                                        type="date"
                                        name="appointmentDate"
                                        min={minDateValue}
                                        value={formData.appointmentDate}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                <FormGroup label="Select Time" icon={<Clock size={14} />}>
                                    <input type="time" name="requestedTimeSlot" value={formData.requestedTimeSlot} onChange={handleChange} />
                                </FormGroup>
                                <FormGroup label="Billing Type" icon={<CreditCard size={14} />}>
                                    <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} className="text-indigo-600">
                                        <option value="Offline">Offline / Cash</option>
                                        <option value="Online">Online / Card</option>
                                    </select>
                                </FormGroup>
                            </div>
                            <p className="mt-4 text-[10px] font-bold text-slate-400 italic">
                                * Note: Appointments must be scheduled at least 48 hours in advance.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={bookingLoading}
                            className="w-full bg-slate-900 text-white py-5 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {bookingLoading ? "Encrypting Data..." : "Finalize Appointment"}
                            {!bookingLoading && <ChevronRight size={18} />}
                        </button>
                    </form>

                    {/* RIGHT COLUMN: SUMMARY */}
                    <aside className="lg:col-span-4">
                        <div className="bg-slate-900 text-white p-8 rounded-xl sticky top-28 shadow-2xl border border-slate-800">
                            <div className="mb-8 border-b border-slate-800 pb-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Queue Status: Ready</h3>
                                <p className="text-xl font-bold">Consultation Brief</p>
                            </div>

                            <div className="space-y-6">
                                <SummaryDetail label="Practitioner" value={formData.selectedDocName} />
                                <SummaryDetail label="Schedule" value={formData.appointmentDate ? `${formData.appointmentDate} @ ${formatTo12Hr(formData.requestedTimeSlot) || 'TBD'}` : "Pending Date"} />
                                <SummaryDetail label="Patient" value={formData.name || "Pending Identity"} />
                                <SummaryDetail label="Billing" value={formData.paymentMode} />
                            </div>

                            <div className="mt-10 p-5 bg-slate-800/50 border border-slate-700 rounded-xl">
                                <div className="flex items-center gap-3 text-emerald-400 mb-2">
                                    <ShieldCheck size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Medical Privacy</span>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                    Appointment data is protected under HIPAA-aligned protocols. Your information is shared only with your assigned specialist.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

// --- REUSABLE SUB-COMPONENTS ---

const FormGroup = ({ label, icon, children }) => {
    const child = React.Children.only(children);
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2 tracking-widest">
                {icon} {label}
            </label>
            <div className="relative">
                {React.cloneElement(child, {
                    className: `w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 placeholder:text-slate-300 ${child.props.className || ""}`
                })}
            </div>
        </div>
    );
};

const SummaryDetail = ({ label, value }) => (
    <div className="flex flex-col gap-1">
        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.15em]">{label}</p>
        <p className="text-sm font-bold text-slate-100">{value}</p>
    </div>
);

export default BookAppointment;