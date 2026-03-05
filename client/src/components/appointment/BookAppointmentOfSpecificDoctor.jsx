import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Clock,
    User,
    Mail,
    ChevronRight,
    ShieldCheck,
    Check,
    ChevronDown,
    Search,
    Stethoscope,
    Users,
    CreditCard,
    FileText,
    Activity,
    Zap
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { getAllDoctorsThunk } from "../../redux/slices/doctor.slice";
import {
    bookAppointment,
    resetBookingState,
} from "../../redux/slices/appointment.slice";
import { useParams } from "react-router-dom";
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
        isVisited: "",

    });
    // console.log("id", doctorId)
    // console.log(doctors)
    // const selectedDoctor = doctors.find(
    //     (doc) => doc._id === doctorId
    // );
    // console.log(selectedDoctor.firstName)
    const minDateValue = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + 2);
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
        if (!doctorId || !doctors?.length) return;

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
    }, [doctorId, doctors]);

    useEffect(() => {
        if (!doctors || doctors.length === 0) {
            dispatch(getAllDoctorsThunk());
        }
    }, [dispatch, doctors]);

    useEffect(() => {
        if (bookingSuccess) {
            toast.success("Schedule Synchronized");
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
                isVisited: "",

            });
            dispatch(resetBookingState());
        }
        if (error) {
            toast.error(error);
        }
    }, [bookingSuccess, error, dispatch]);

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
        const submissionData = {
            ...formData,
            requestedTimeSlot: formatTo12Hr(formData.requestedTimeSlot)
        };
        dispatch(bookAppointment(submissionData));
    };

    return (
        <div className="min-h-screen bg-[#FDFDFF] pt-24 pb-20 px-4 md:px-8 font-sans selection:bg-indigo-100">
            <div className="max-w-6xl mx-auto">

                {/* --- HEADER WITH GRADIENT ACCENT --- */}
                <header className="mb-14 relative">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-linear-to-br from-indigo-600 to-purple-600 rounded-lg text-white shadow-lg shadow-indigo-200">
                            <Zap size={20} fill="currentColor" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600/60">NewCare / Priority Intake</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none uppercase italic">
                        Book <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">Consultation</span>
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* --- MAIN FORM (LIGHT MODE CONTENT) --- */}
                    <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">

                        {/* 01. SPECIALIST PICKER */}
                        <section className="bg-white border-l-4 border-indigo-600 shadow-xl shadow-indigo-900/5 p-8 rounded-r-2xl">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 flex items-center gap-2 tracking-widest">
                                <Stethoscope size={16} className="text-purple-600" /> Specialist Unit
                            </h3>

                            <div className="relative z-50">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="w-full flex items-center justify-between px-6 py-5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-800 hover:bg-white hover:border-purple-300 transition-all focus:ring-4 focus:ring-indigo-500/5 outline-none"
                                >
                                    <span>{formData.selectedDocName}</span>
                                    <ChevronDown size={20} className={`text-indigo-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden"
                                        >
                                            <div className="p-4 bg-indigo-50/30">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={16} />
                                                    <input
                                                        type="text"
                                                        placeholder="Search department or name..."
                                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-sm focus:border-purple-500 outline-none"
                                                        value={docSearch}
                                                        onChange={(e) => setDocSearch(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="max-h-64 overflow-y-auto p-2">
                                                {filteredDoctors.map((doc) => (
                                                    <button
                                                        key={doc._id}
                                                        type="button"
                                                        onClick={() => handleSelectDoctor(doc)}
                                                        className="w-full flex items-center justify-between p-4 hover:bg-linear-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all group"
                                                    >
                                                        <div className="text-left">
                                                            <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-700">Dr. {doc.firstName} {doc.lastName}</p>
                                                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{doc.specialization}</p>
                                                        </div>
                                                        {formData.doctorId === doc._id && <Check size={18} className="text-purple-600" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </section>

                        {/* 02. PATIENT DATA */}
                        <section className="bg-white border border-slate-100 shadow-lg p-8 rounded-2xl">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-8 flex items-center gap-2 tracking-widest">
                                <User size={16} className="text-indigo-600" /> Patient Dossier
                            </h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <FormGroup label="Full Name" activeColor="focus:border-indigo-600">
                                    <input name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} />
                                </FormGroup>
                                <FormGroup label="Email ID" activeColor="focus:border-purple-600">
                                    <input name="email" type="email" placeholder="j.doe@network.com" value={formData.email} onChange={handleChange} />
                                </FormGroup>
                                <FormGroup label="Assigned Gender" activeColor="focus:border-indigo-600">
                                    <select name="gender" value={formData.gender} onChange={handleChange}>
                                        <option value="">Select Option</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </FormGroup>
                                <FormGroup label="Patient Relation" activeColor="focus:border-purple-600">
                                    <select name="relation" value={formData.relation} onChange={handleChange}>
                                        <option value="Self">Self / Primary</option>
                                        <option value="Parent">Parent / Dependent</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </FormGroup>
                            </div>
                        </section>

                        {/* 03. LOGISTICS */}
                        <section className="bg-white border border-slate-100 shadow-lg p-8 rounded-2xl">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-8 flex items-center gap-2 tracking-widest">
                                <Calendar size={16} className="text-purple-600" /> Scheduling & Billing
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <FormGroup label="Visit Date" activeColor="focus:border-indigo-600">
                                    <input type="date" name="appointmentDate" min={minDateValue} value={formData.appointmentDate} onChange={handleChange} />
                                </FormGroup>
                                <FormGroup label="Preferred Time" activeColor="focus:border-purple-600">
                                    <input type="time" name="requestedTimeSlot" value={formData.requestedTimeSlot} onChange={handleChange} />
                                </FormGroup>
                                <FormGroup label="Payment Mode" activeColor="focus:border-indigo-600">
                                    <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} className="text-indigo-700">
                                        <option value="Offline">Offline / On-site</option>
                                        <option value="Online">Online / Pre-pay</option>
                                    </select>
                                </FormGroup>
                                <FormGroup label="Is Visited" activeColor="focus:border-indigo-600">
                                    <select name="is Visited" value={formData.isVisited} onChange={handleChange} className="text-indigo-700">
                                        <option value="false">No </option>
                                        <option value="true">Yes</option>
                                    </select>
                                </FormGroup>
                            </div>
                        </section>

                        <button
                            type="submit"
                            disabled={bookingLoading}
                            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-indigo-200 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {bookingLoading ? "Initializing Node..." : "Secure Appointment"}
                            {!bookingLoading && <ChevronRight size={20} />}
                        </button>
                    </form>

                    {/* --- SIDEBAR SUMMARY (THEME ACCENT) --- */}
                    <aside className="lg:col-span-4">
                        <div className="bg-slate-900 rounded-3xl p-8 sticky top-28 overflow-hidden">
                            {/* Visual Polish */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 blur-[60px]" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600/20 blur-[60px]" />

                            <div className="relative z-10">
                                <div className="mb-10 flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white tracking-tight italic">Visit <span className="text-indigo-400">Ledger</span></h3>
                                    <Activity size={20} className="text-purple-500" />
                                </div>

                                <div className="space-y-8">
                                    <SummaryItem label="Assigned Specialist" value={formData.selectedDocName} />
                                    <SummaryItem label="Scheduled Session" value={formData.appointmentDate ? `${formData.appointmentDate} @ ${formatTo12Hr(formData.requestedTimeSlot) || 'TBD'}` : "Unscheduled"} />
                                    <SummaryItem label="Primary Patient" value={formData.name || "Awaiting Registry"} />
                                    <SummaryItem label="Billing Node" value={formData.paymentMode} />
                                    <SummaryItem label="Visited Previously" value={formData.isVisited} />

                                </div>

                                <div className="mt-12 p-5 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="flex items-center gap-3 text-indigo-400 mb-2">
                                        <ShieldCheck size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Encrypted Data</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-tighter">
                                        All clinical data is processed via AES-256 protocols and stored in compliance with local health regulations.
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

// --- CUSTOM THEMED HELPERS ---

const FormGroup = ({ label, children, activeColor }) => {
    const child = React.Children.only(children);
    return (
        <div className="flex flex-col gap-2.5">
            <label className="text-[10px] font-black uppercase text-indigo-400/70 ml-1 tracking-widest">
                {label}
            </label>
            <div className="relative">
                {React.cloneElement(child, {
                    className: `w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold text-slate-900 outline-none transition-all focus:bg-white focus:ring-8 focus:ring-indigo-500/5 ${activeColor} placeholder:text-slate-300 ${child.props.className || ""}`
                })}
            </div>
        </div>
    );
};

const SummaryItem = ({ label, value }) => (
    <div className="group">
        <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] mb-1">/ {label}</p>
        <p className="text-[15px] font-bold text-white group-hover:text-indigo-400 transition-colors">{value}</p>
    </div>
);

export default BookAppointmentOfSpecificDoctor;