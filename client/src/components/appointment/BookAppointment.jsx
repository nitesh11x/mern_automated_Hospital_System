import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    User,
    ChevronRight,
    Check,
    ChevronDown,
    Search,
    Stethoscope,
    Activity,
    Zap,
    ShieldCheck,
    RefreshCw,
    Clock,
    History,
    X
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { getAllDoctorsThunk } from "../../redux/slices/doctor.slice";
import {
    bookAppointment,
    resetBookingState,
} from "../../redux/slices/appointment.slice";
import { notifyProcessingAppointmentThunk } from "../../redux/slices/notification.slice";

// Static Doctor Working Hours Configuration - ALL SLOTS VISIBLE
const DOCTOR_HOURS = {
    "A": {
        name: "Morning Block (9:00 AM - 1:30 PM)",
        slots: [
            { slotId: "A01", time: "9:00 AM", isBooked: false, left: 4 },
            { slotId: "A02", time: "9:30 AM", isBooked: false, left: 4 },
            { slotId: "A03", time: "10:00 AM", isBooked: false, left: 4 },
            { slotId: "A04", time: "10:30 AM", isBooked: false, left: 4 },
            { slotId: "A05", time: "11:00 AM", isBooked: false, left: 4 },
            { slotId: "A06", time: "11:30 AM", isBooked: false, left: 4 },
            { slotId: "A07", time: "12:00 PM", isBooked: false, left: 4 },
            { slotId: "A08", time: "12:30 PM", isBooked: false, left: 4 },
            { slotId: "A09", time: "1:00 PM", isBooked: false, left: 4 },
            { slotId: "A10", time: "1:30 PM", isBooked: false, left: 4 }
        ]
    },
    "B": {
        name: "Afternoon Block (2:00 PM - 6:30 PM)",
        slots: [
            { slotId: "B01", time: "2:00 PM", isBooked: false, left: 4 },
            { slotId: "B02", time: "2:30 PM", isBooked: false, left: 4 },
            { slotId: "B03", time: "3:00 PM", isBooked: false, left: 4 },
            { slotId: "B04", time: "3:30 PM", isBooked: false, left: 4 },
            { slotId: "B05", time: "4:00 PM", isBooked: false, left: 4 },
            { slotId: "B06", time: "4:30 PM", isBooked: false, left: 4 },
            { slotId: "B07", time: "5:00 PM", isBooked: false, left: 4 },
            { slotId: "B08", time: "5:30 PM", isBooked: false, left: 4 },
            { slotId: "B09", time: "6:00 PM", isBooked: false, left: 4 },
            { slotId: "B10", time: "6:30 PM", isBooked: false, left: 4 }
        ]
    },
    "C": {
        name: "Evening Block (7:00 PM - 11:30 PM)",
        slots: [
            { slotId: "C01", time: "7:00 PM", isBooked: false, left: 4 },
            { slotId: "C02", time: "7:30 PM", isBooked: false, left: 4 },
            { slotId: "C03", time: "8:00 PM", isBooked: false, left: 4 },
            { slotId: "C04", time: "8:30 PM", isBooked: false, left: 4 },
            { slotId: "C05", time: "9:00 PM", isBooked: false, left: 4 },
            { slotId: "C06", time: "9:30 PM", isBooked: false, left: 4 },
            { slotId: "C07", time: "10:00 PM", isBooked: false, left: 4 },
            { slotId: "C08", time: "10:30 PM", isBooked: false, left: 4 },
            { slotId: "C09", time: "11:00 PM", isBooked: false, left: 4 },
            { slotId: "C10", time: "11:30 PM", isBooked: false, left: 4 }
        ]
    }
};

// Static Previous Appointments Data
const STATIC_PREVIOUS_APPOINTMENTS = [
    {
        _id: "app1",
        appointmentId: "APT-0001",
        doctorId: {
            _id: "doc1",
            firstName: "Sarah",
            lastName: "Johnson",
            specialization: "Cardiologist"
        },
        name: "John Doe",
        email: "john@example.com",
        appointmentDate: "2024-03-15",
        requestedTimeSlot: "10:30 AM",
        slotId: "A04",
        status: "Completed",
        symptoms: "Chest pain, shortness of breath"
    },
    {
        _id: "app2",
        appointmentId: "APT-0002",
        doctorId: {
            _id: "doc2",
            firstName: "Michael",
            lastName: "Chen",
            specialization: "Neurologist"
        },
        name: "John Doe",
        email: "john@example.com",
        appointmentDate: "2024-03-10",
        requestedTimeSlot: "2:00 PM",
        slotId: "B01",
        status: "Completed",
        symptoms: "Migraine, dizziness"
    },
    {
        _id: "app3",
        appointmentId: "APT-0003",
        doctorId: {
            _id: "doc3",
            firstName: "Emily",
            lastName: "Rodriguez",
            specialization: "Dermatologist"
        },
        name: "John Doe",
        email: "john@example.com",
        appointmentDate: "2024-03-05",
        requestedTimeSlot: "11:15 AM",
        slotId: "A06",
        status: "Completed",
        symptoms: "Skin rash, itching"
    }
];

// Static Doctors Data
const STATIC_DOCTORS = [
    {
        _id: "doc1",
        firstName: "Sarah",
        lastName: "Johnson",
        specialization: "Cardiologist",
        experience: 12,
        consultationFees: 1500
    },
    {
        _id: "doc2",
        firstName: "Michael",
        lastName: "Chen",
        specialization: "Neurologist",
        experience: 10,
        consultationFees: 1800
    },
    {
        _id: "doc3",
        firstName: "Emily",
        lastName: "Rodriguez",
        specialization: "Dermatologist",
        experience: 8,
        consultationFees: 1200
    },
    {
        _id: "doc4",
        firstName: "James",
        lastName: "Wilson",
        specialization: "Orthopedist",
        experience: 15,
        consultationFees: 2000
    },
    {
        _id: "doc5",
        firstName: "Lisa",
        lastName: "Brown",
        specialization: "Pediatrician",
        experience: 7,
        consultationFees: 1000
    }
];

const BookAppointment = () => {
    const dispatch = useDispatch();

    // Get data from Redux with fallback
    const { doctors: reduxDoctors } = useSelector((state) => state.doctor);
    const {
        loading: bookingLoading,
        bookingSuccess,
        error,
    } = useSelector((state) => state.appointment);

    const doctors = reduxDoctors?.length > 0 ? reduxDoctors : STATIC_DOCTORS;

    const [isOpen, setIsOpen] = useState(false);
    const [docSearch, setDocSearch] = useState("");
    const [showPreviousAppointments, setShowPreviousAppointments] = useState(false);
    const [selectedPreviousAppointment, setSelectedPreviousAppointment] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

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
        isVisited: false,
    });

    const minDateValue = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date.toISOString().split("T")[0];
    }, []);

    // Filter doctors based on search
    const filteredDoctors = useMemo(() => {
        if (!doctors) return [];
        return doctors.filter((doc) =>
            `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(docSearch.toLowerCase()) ||
            doc.specialization?.toLowerCase().includes(docSearch.toLowerCase())
        );
    }, [doctors, docSearch]);

    // Filter previous appointments based on email
    const filteredPreviousAppointments = useMemo(() => {
        if (!formData.email) return [];
        return STATIC_PREVIOUS_APPOINTMENTS.filter(
            app => app.email.toLowerCase() === formData.email.toLowerCase()
        );
    }, [formData.email]);

    useEffect(() => {
        if (doctors && doctors.length === 0) {
            dispatch(getAllDoctorsThunk());
        }
    }, [dispatch, doctors]);

    useEffect(() => {
        if (bookingSuccess) {
            toast.success("Schedule Synchronized");
            dispatch(notifyProcessingAppointmentThunk({ email: formData.email, name: formData.name }));

            // Reset Form
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
            setSelectedSlot(null);
            setSelectedDoctor(null);
            setSelectedPreviousAppointment(null);
            dispatch(resetBookingState());
        }
        if (error) {
            toast.error(error);
            dispatch(resetBookingState());
        }
    }, [bookingSuccess, error, dispatch, formData.email, formData.name]);

    const handleSelectDoctor = (doc) => {
        setSelectedDoctor(doc);
        setFormData((prev) => ({
            ...prev,
            doctorId: doc._id,
            selectedDocName: `Dr. ${doc.firstName} ${doc.lastName}`,
        }));
        setIsOpen(false);
        setSelectedSlot(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const finalValue = name === "isVisited" ? value === "true" : value;
        setFormData((prev) => ({ ...prev, [name]: finalValue }));

        if (name === "isVisited") {
            if (value === "true") {
                if (formData.email) {
                    setShowPreviousAppointments(true);
                } else {
                    toast.error("Please enter email first to see previous appointments");
                    setFormData(prev => ({ ...prev, isVisited: false }));
                }
            } else {
                setShowPreviousAppointments(false);
                setSelectedPreviousAppointment(null);
            }
        }
    };

    const handleSelectPreviousAppointment = (appointment) => {
        setSelectedPreviousAppointment(appointment);
        const doctor = doctors.find(d => d._id === appointment.doctorId._id);
        if (doctor) {
            setSelectedDoctor(doctor);
            setFormData((prev) => ({
                ...prev,
                doctorId: doctor._id,
                selectedDocName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
            }));
        }
        setShowPreviousAppointments(false);
        toast.success(`Selected previous appointment from ${new Date(appointment.appointmentDate).toLocaleDateString()}`);
    };

    const handleSelectTimeSlot = (blockKey, slot) => {
        if (slot.isBooked) {
            toast.error("This time slot is already booked. Please select another slot.");
            return;
        }
        setSelectedSlot({ ...slot, block: blockKey });
        setFormData((prev) => ({
            ...prev,
            requestedTimeSlot: slot.time
        }));
        toast.success(`Selected ${slot.slotId} - ${slot.time}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.doctorId) {
            toast.error("Please assign a specialist");
            return;
        }
        if (!formData.appointmentDate) {
            toast.error("Please select appointment date");
            return;
        }
        if (!selectedSlot) {
            toast.error("Please select a time slot");
            return;
        }
        if (!formData.name) {
            toast.error("Please enter patient name");
            return;
        }
        if (!formData.email) {
            toast.error("Please enter patient email");
            return;
        }
        if (!formData.gender) {
            toast.error("Please select gender");
            return;
        }

        const submissionData = {
            doctorId: formData.doctorId,
            name: formData.name,
            email: formData.email,
            gender: formData.gender,
            relation: formData.relation,
            appointmentDate: formData.appointmentDate,
            requestedTimeSlot: selectedSlot.time,
            slotId: selectedSlot.slotId,
            paymentMode: formData.paymentMode,
            isVisited: formData.isVisited,
            previousAppointmentId: selectedPreviousAppointment?.appointmentId || null
        };

        dispatch(bookAppointment(submissionData));
    };

    return (
        <div className="min-h-screen bg-[#FDFDFF] pt-24 pb-20 px-4 md:px-8 selection:bg-indigo-100">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <header className="mb-14 border-l-4 border-indigo-600 pl-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Zap size={16} className="text-indigo-600 fill-indigo-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Intake Protocol / 2026.4</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic">
                        Book <span className="text-indigo-600">Consultation</span>
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Main Form */}
                    <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">

                        {/* 01. SPECIALIST SELECTION */}
                        <section className="bg-white border border-slate-200 rounded-sm shadow-sm p-8">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 flex items-center gap-2">
                                <Stethoscope size={14} className="text-indigo-600" /> 01. Specialist Assignment
                            </h3>

                            <div className="relative z-50">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(!isOpen)}
                                    className={`w-full flex items-center justify-between px-6 py-4 bg-slate-50 border rounded-sm text-sm font-bold transition-all ${isOpen ? 'border-indigo-600 bg-white shadow-sm' : 'border-slate-200'}`}
                                >
                                    <span>{formData.selectedDocName}</span>
                                    <ChevronDown size={18} className={`text-indigo-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-2xl rounded-sm overflow-hidden z-50"
                                        >
                                            <div className="p-4 border-b bg-slate-50/50">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                                    <input
                                                        type="text"
                                                        placeholder="FILTER BY SPECIALTY OR NAME..."
                                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-sm text-[11px] font-bold uppercase outline-none focus:border-indigo-600"
                                                        value={docSearch}
                                                        onChange={(e) => setDocSearch(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="max-h-60 overflow-y-auto">
                                                {filteredDoctors.length > 0 ? filteredDoctors.map((doc) => (
                                                    <button
                                                        key={doc._id}
                                                        type="button"
                                                        onClick={() => handleSelectDoctor(doc)}
                                                        className="w-full flex items-center justify-between p-4 hover:bg-indigo-600 hover:text-white transition-all text-left"
                                                    >
                                                        <div>
                                                            <p className="text-xs font-black uppercase">Dr. {doc.firstName} {doc.lastName}</p>
                                                            <p className="text-[9px] font-bold uppercase opacity-60">{doc.specialization}</p>
                                                        </div>
                                                        {formData.doctorId === doc._id && <Check size={16} />}
                                                    </button>
                                                )) : <div className="p-4 text-center text-[10px] font-bold text-slate-400">No Results Found</div>}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </section>

                        {/* 02. PATIENT DATA */}
                        <section className="bg-white border border-slate-200 rounded-sm shadow-sm p-8">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-8 flex items-center gap-2">
                                <User size={14} className="text-indigo-600" /> 02. Patient Dossier
                            </h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <FormGroup label="Full Name">
                                    <input name="name" placeholder="E.G. JOHN DOE" value={formData.name} onChange={handleChange} required />
                                </FormGroup>
                                <FormGroup label="Secure Email">
                                    <input name="email" type="email" placeholder="EMAIL@NETWORK.COM" value={formData.email} onChange={handleChange} required />
                                </FormGroup>
                                <FormGroup label="Gender">
                                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                                        <option value="">SELECT GENDER</option>
                                        <option value="Male">MALE</option>
                                        <option value="Female">FEMALE</option>
                                        <option value="Other">OTHER</option>
                                    </select>
                                </FormGroup>
                                <FormGroup label="Relation">
                                    <select name="relation" value={formData.relation} onChange={handleChange}>
                                        <option value="Self">SELF / PRIMARY</option>
                                        <option value="Parent">PARENT</option>
                                        <option value="Spouse">SPOUSE</option>
                                        <option value="Other">OTHER</option>
                                    </select>
                                </FormGroup>
                            </div>
                        </section>

                        {/* 03. LOGISTICS & IS VISITED */}
                        <section className="bg-white border border-slate-200 rounded-sm shadow-sm p-8">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-8 flex items-center gap-2">
                                <Calendar size={14} className="text-indigo-600" /> 03. Scheduling & Case Type
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormGroup label="Visit Date">
                                    <input type="date" name="appointmentDate" min={minDateValue} value={formData.appointmentDate} onChange={handleChange} required />
                                </FormGroup>
                                <FormGroup label="Follow-up Case?">
                                    <select name="isVisited" value={formData.isVisited} onChange={handleChange}>
                                        <option value="false">NO (NEW CASE)</option>
                                        <option value="true">YES (FOLLOW-UP)</option>
                                    </select>
                                </FormGroup>
                                <FormGroup label="Payment">
                                    <select name="paymentMode" value={formData.paymentMode} onChange={handleChange}>
                                        <option value="Offline">OFFLINE</option>
                                        <option value="Online">ONLINE</option>
                                    </select>
                                </FormGroup>
                            </div>
                        </section>

                        {/* Previous Appointments Modal */}
                        {showPreviousAppointments && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                                onClick={() => setShowPreviousAppointments(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="bg-white rounded-sm max-w-2xl w-full max-h-[80vh] overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="p-6 border-b flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <History size={20} className="text-indigo-600" />
                                            <h3 className="text-lg font-black uppercase">Previous Appointments</h3>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowPreviousAppointments(false)}
                                            className="p-2 hover:bg-slate-100 rounded-sm"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <div className="p-6 overflow-y-auto max-h-[60vh]">
                                        {filteredPreviousAppointments.length > 0 ? (
                                            <div className="space-y-4">
                                                {filteredPreviousAppointments.map((appointment) => (
                                                    <button
                                                        key={appointment._id}
                                                        type="button"
                                                        onClick={() => handleSelectPreviousAppointment(appointment)}
                                                        className="w-full text-left p-4 border border-slate-200 rounded-sm hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <p className="font-black uppercase">
                                                                    Dr. {appointment.doctorId.firstName} {appointment.doctorId.lastName}
                                                                </p>
                                                                <p className="text-[10px] font-bold uppercase text-slate-500">
                                                                    {appointment.doctorId.specialization}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xs font-black">
                                                                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                                                                </p>
                                                                <p className="text-[10px] font-bold text-slate-500">
                                                                    {appointment.requestedTimeSlot}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-slate-600 mt-2">{appointment.symptoms}</p>
                                                        <div className="mt-2 flex justify-end">
                                                            <span className="text-[9px] font-black uppercase text-indigo-600 group-hover:translate-x-1 transition-transform">
                                                                Select this appointment →
                                                            </span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-slate-500">
                                                <History size={40} className="mx-auto mb-3 opacity-30" />
                                                <p className="text-sm">No previous appointments found for this email</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* 04. TIME SLOT SELECTION - FIXED VERSION */}
                        {formData.doctorId && formData.appointmentDate && (
                            <section className="bg-white border border-slate-200 rounded-sm shadow-sm p-8">
                                <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 flex items-center gap-2">
                                    <Clock size={14} className="text-indigo-600" /> 04. Select Time Slot
                                </h3>

                                <div className="space-y-8">
                                    {Object.keys(DOCTOR_HOURS).map((blockKey) => {
                                        const block = DOCTOR_HOURS[blockKey];
                                        const availableCount = block.slots.filter(s => !s.isBooked).length;

                                        return (
                                            <div key={blockKey} className="border-b border-slate-100 pb-6 last:border-0">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <h4 className="text-base font-black uppercase tracking-tight text-indigo-600">
                                                            Block {blockKey}
                                                        </h4>
                                                        <p className="text-[10px] font-bold text-slate-500 mt-1">
                                                            {block.name}
                                                        </p>
                                                    </div>
                                                    <div className="bg-indigo-50 px-3 py-1 rounded-full">
                                                        <span className="text-[10px] font-black text-indigo-600">
                                                            {availableCount} / {block.slots.length} slots available
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                                    {block.slots.map((slot) => {
                                                        const isSelected = selectedSlot?.slotId === slot.slotId;
                                                        const isBooked = slot.isBooked;

                                                        return (
                                                            <button
                                                                key={slot.slotId}
                                                                type="button"
                                                                onClick={() => handleSelectTimeSlot(blockKey, slot)}
                                                                disabled={isBooked}
                                                                className={`
                                                                    relative py-3 px-2 rounded-lg text-center transition-all duration-200
                                                                    ${isSelected
                                                                        ? 'bg-indigo-600 text-white shadow-lg scale-105 ring-2 ring-indigo-300'
                                                                        : isBooked
                                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                            : 'bg-indigo-50 hover:bg-indigo-100 hover:scale-105 border-2 border-indigo-200 cursor-pointer'
                                                                    }
                                                                `}
                                                            >
                                                                <div className="text-xs font-black uppercase tracking-wider">
                                                                    {slot.slotId}
                                                                </div>
                                                                <div className="text-[10px] font-bold mt-1">
                                                                    {slot.time}
                                                                </div>
                                                                {isBooked && (
                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                        <div className="w-full h-0.5 bg-gray-400 rotate-45"></div>
                                                                    </div>
                                                                )}
                                                                {isSelected && (
                                                                    <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                                                                        <Check size={12} className="text-white" />
                                                                    </div>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {selectedSlot && (
                                    <div className="mt-8 p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-bold uppercase text-indigo-600 mb-1">Selected Time Slot</p>
                                                <p className="text-lg font-black text-indigo-800">
                                                    {selectedSlot.slotId} - {selectedSlot.time}
                                                </p>
                                            </div>
                                            <Clock size={24} className="text-indigo-400" />
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Show message when doctor/date not selected */}
                        {(!formData.doctorId || !formData.appointmentDate) && (
                            <section className="bg-white border border-slate-200 rounded-sm shadow-sm p-8">
                                <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 flex items-center gap-2">
                                    <Clock size={14} className="text-indigo-600" /> 04. Select Time Slot
                                </h3>
                                <div className="text-center py-8">
                                    <Clock size={48} className="mx-auto mb-3 text-slate-300" />
                                    <p className="text-sm font-bold text-slate-500">
                                        {!formData.doctorId && !formData.appointmentDate
                                            ? "Please select a doctor and appointment date first"
                                            : !formData.doctorId
                                                ? "Please select a doctor first"
                                                : "Please select an appointment date first"}
                                    </p>
                                </div>
                            </section>
                        )}

                        <button
                            type="submit"
                            disabled={bookingLoading || !selectedSlot}
                            className="w-full bg-slate-900 text-white py-6 rounded-lg font-black text-[11px] uppercase tracking-[0.4em] hover:bg-indigo-600 transition-all shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                        >
                            {bookingLoading ? "ENCRYPTING DATA..." : "Finalize Appointment"}
                            {!bookingLoading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4">
                        <div className="bg-slate-900 rounded-lg p-8 sticky top-28 border border-slate-800 shadow-2xl">
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
                                    <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Visit Ledger</h3>
                                    <Activity size={14} className="text-indigo-400" />
                                </div>

                                <div className="space-y-6">
                                    <SummaryItem label="Expert" value={formData.selectedDocName} />
                                    <SummaryItem
                                        label="Timeline"
                                        value={formData.appointmentDate ? `${new Date(formData.appointmentDate).toLocaleDateString()} @ ${selectedSlot?.time || 'TBD'}` : "NOT SCHEDULED"}
                                    />
                                    <SummaryItem label="Patient" value={formData.name || "UNREGISTERED"} />

                                    {selectedSlot && (
                                        <SummaryItem label="Slot" value={`${selectedSlot.slotId} - ${selectedSlot.time}`} />
                                    )}

                                    <div>
                                        <p className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2">/ Case Type</p>
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase ${formData.isVisited ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                                            {formData.isVisited ? <><RefreshCw size={10} /> Follow-up Visit</> : "First-time Case"}
                                        </div>
                                    </div>

                                    {selectedPreviousAppointment && (
                                        <div className="mt-4 pt-4 border-t border-slate-800">
                                            <p className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2">/ Previous Visit</p>
                                            <div className="text-[9px] text-slate-400 space-y-1">
                                                <p>Date: {new Date(selectedPreviousAppointment.appointmentDate).toLocaleDateString()}</p>
                                                <p>Doctor: Dr. {selectedPreviousAppointment.doctorId.firstName} {selectedPreviousAppointment.doctorId.lastName}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                                    <div className="flex items-center gap-2 text-indigo-400 mb-2">
                                        <ShieldCheck size={14} />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Secure HIPAA Node</span>
                                    </div>
                                    <p className="text-[8px] text-slate-500 leading-relaxed">
                                        All data is encrypted and transmitted securely
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

// Helpers
const FormGroup = ({ label, children }) => {
    const child = React.Children.only(children);
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                {label}
            </label>
            {React.cloneElement(child, {
                className: `w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-[12px] font-black text-slate-900 uppercase tracking-tight outline-none transition-all focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 ${child.props.className || ""}`
            })}
        </div>
    );
};

const SummaryItem = ({ label, value }) => (
    <div>
        <p className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em] mb-1">/ {label}</p>
        <p className="text-sm font-black text-white uppercase tracking-wider truncate">{value}</p>
    </div>
);

export default BookAppointment;