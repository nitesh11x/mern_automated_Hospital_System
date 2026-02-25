import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Plus,
    Mail,
    Fingerprint,
    Calendar,
    MoreHorizontal,
    Edit3,
    Trash2,
    FileText,
    Phone,
    Filter,
    ArrowRight,
    ShieldAlert,
    Clock, User
} from "lucide-react";

// --- DUMMY DATA ---
const DUMMY_PATIENTS = [
    {
        id: "PT-9921",
        firstName: "Amit",
        lastName: "Sharma",
        email: "amit.sharma@example.com",
        phone: "+91 98765-43210",
        lastAppointment: "2026-02-24",
        bloodGroup: "O+",
        status: "Regular",
        gender: "Male",
        age: 29
    },
    {
        id: "PT-4412",
        firstName: "Priya",
        lastName: "Verma",
        email: "priya.v@outlook.com",
        phone: "+91 99887-76655",
        lastAppointment: "2026-02-20",
        bloodGroup: "B-",
        status: "Critical",
        gender: "Female",
        age: 45
    },
    {
        id: "PT-1029",
        firstName: "Rahul",
        lastName: "Das",
        email: "rahul.das@gmail.com",
        phone: "+91 88776-55443",
        lastAppointment: "2026-02-25",
        bloodGroup: "A+",
        status: "Follow-up",
        gender: "Male",
        age: 34
    }
];

const PatientManage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    // --- FILTER LOGIC (ID, Email, or Date) ---
    const filteredPatients = useMemo(() => {
        return DUMMY_PATIENTS.filter((patient) => {
            const matchesSearch =
                patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.lastAppointment.includes(searchTerm);

            const matchesStatus = filterStatus === "All" || patient.status === filterStatus;

            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, filterStatus]);

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen pt-24">
            <div className="max-w-7xl mx-auto">

                {/* --- HEADER --- */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 mt-14">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-8 h-1 bg-primary rounded-full" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Patient Care</p>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Registry</h1>
                        <p className="text-slate-500 mt-1 font-medium">Search, filter, and manage clinical records.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl transition-all shadow-xl shadow-slate-200 font-bold text-sm hover:scale-105">
                        <Plus size={18} /> Register Patient
                    </button>
                </div>

                {/* --- MULTI-SEARCH FILTER BAR --- */}
                <div className="bg-white p-5 rounded-[2.5rem] border border-slate-200 mb-8 shadow-sm flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID, Email, or Appointment Date (YYYY-MM-DD)..."
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 px-5 py-2 rounded-2xl border border-slate-100">
                        <Filter size={18} className="text-slate-400" />
                        <select
                            className="bg-transparent text-xs font-black text-slate-700 outline-none uppercase tracking-widest cursor-pointer"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Regular">Regular</option>
                            <option value="Critical">Critical</option>
                            <option value="Follow-up">Follow-up</option>
                        </select>
                    </div>
                </div>

                {/* --- PATIENT LIST --- */}
                <div className="space-y-4">
                    {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient, i) => (
                            <PatientRow key={patient.id} patient={patient} index={i} />
                        ))
                    ) : (
                        <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold uppercase tracking-widest">No patient records found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- ROW COMPONENT ---
const PatientRow = ({ patient, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white border border-slate-100 p-5 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
        >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

                {/* 1. Primary ID & Info */}
                <div className="flex items-center gap-5 min-w-[280px]">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors">
                        <User size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 leading-tight">
                            {patient.firstName} {patient.lastName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded uppercase">{patient.id}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{patient.gender} • Age: {patient.age}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Contact Details */}
                <div className="flex flex-col gap-1.5 px-6 border-x border-slate-50 min-w-[220px]">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Mail size={14} className="text-slate-300" />
                        <span className="text-xs font-medium truncate">{patient.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                        <Phone size={14} className="text-slate-300" />
                        <span className="text-xs font-bold">{patient.phone}</span>
                    </div>
                </div>

                {/* 3. Clinical Data */}
                <div className="grid grid-cols-2 gap-6 min-w-[200px]">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Blood Group</p>
                        <div className="flex items-center gap-1.5 font-black text-red-500">
                            <ShieldAlert size={14} />
                            <span className="text-sm">{patient.bloodGroup}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Last Visit</p>
                        <div className="flex items-center gap-1.5 font-black text-slate-700">
                            <Clock size={14} className="text-primary" />
                            <span className="text-xs">{patient.lastAppointment}</span>
                        </div>
                    </div>
                </div>

                {/* 4. Actions */}
                <div className="flex items-center gap-2">
                    <ActionBtn icon={<FileText size={16} />} title="View Records" />
                    <ActionBtn icon={<Edit3 size={16} />} title="Edit" />
                    <ActionBtn icon={<Trash2 size={16} />} title="Delete" danger />
                    <div className="w-px h-6 bg-slate-100 mx-1" />
                    <button className="p-3 bg-slate-50 text-slate-900 rounded-xl hover:bg-primary hover:text-white transition-all">
                        <ArrowRight size={18} />
                    </button>
                </div>

            </div>
        </motion.div>
    );
};

const ActionBtn = ({ icon, title, danger = false }) => (
    <button
        title={title}
        className={`p-3 rounded-xl border border-slate-50 transition-all ${danger
            ? "text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100"
            : "text-slate-300 hover:text-primary hover:bg-slate-50 hover:border-slate-200"
            }`}
    >
        {icon}
    </button>
);

export default PatientManage;