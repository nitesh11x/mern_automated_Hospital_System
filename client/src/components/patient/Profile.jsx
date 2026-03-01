import React, { useState } from "react";
import { motion } from "framer-motion";
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
    Download
} from "lucide-react";

const Profile = () => {
    // Dummy Patient State
    const [patient, setPatient] = useState({
        firstName: "Alex",
        lastName: "Doe",
        email: "alex.doe@example.com",
        phone: "+1 (555) 123-4567",
        dob: "1992-08-24",
        gender: "Male",
        patientId: "PT-88293",
        bloodGroup: "O+",
        address: "123 Healthcare Way, New York, NY",
        emergencyContact: "Jane Doe (+1 555-999-0000)"
    });

    return (
        <div className="min-h-screen bg-[#F8FAFC] mt-16 pb-20">
            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* --- PROFILE HEADER CARD --- */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-sm p-8 md:p-12 shadow-xl shadow-indigo-100/50 border border-gray-100 mb-8 relative overflow-hidden"
                >
                    {/* Sharp accent line */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-indigo-600 to-purple-600" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-44 md:h-44 bg-indigo-50 rounded-sm border-2 border-indigo-100 shadow-inner flex items-center justify-center text-indigo-600 overflow-hidden">
                                <User size={72} strokeWidth={1.5} />
                            </div>
                            <button className="absolute -bottom-3 -right-3 p-3 bg-purple-600 text-white rounded-sm shadow-lg hover:bg-purple-700 transition-colors border-2 border-white">
                                <Camera size={18} />
                            </button>
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                                <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase">
                                    {patient.firstName} {patient.lastName}
                                </h1>
                                <span className="w-fit mx-auto md:mx-0 px-3 py-1 border border-indigo-200 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm bg-indigo-50">
                                    Verified Patient
                                </span>
                            </div>
                            <p className="text-gray-400 font-bold mb-8 flex items-center justify-center md:justify-start gap-2 text-sm uppercase tracking-widest">
                                <Fingerprint size={16} className="text-purple-500" /> ID: {patient.patientId}
                            </p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <button className="bg-indigo-600 text-white px-8 py-3 rounded-sm font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                                    <Edit3 size={16} /> Edit Profile
                                </button>
                                <button className="bg-white border border-gray-200 text-gray-700 px-8 py-3 rounded-sm font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all">
                                    Security
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- INFORMATION GRID --- */}
                <div className="grid md:grid-cols-3 gap-8">

                    {/* Left Column: Personal Details */}
                    <div className="md:col-span-2 space-y-8">
                        <section className="bg-white rounded-sm p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-1.5 h-6 bg-indigo-600" />
                                <h3 className="text-xs font-black text-indigo-900 uppercase tracking-[0.3em]">
                                    Personal Information
                                </h3>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-y-10 gap-x-12">
                                <InfoItem label="First Name" value={patient.firstName} icon={<User />} />
                                <InfoItem label="Last Name" value={patient.lastName} icon={<User />} />
                                <InfoItem label="Email Address" value={patient.email} icon={<Mail />} />
                                <InfoItem label="Phone Number" value={patient.phone} icon={<Phone />} />
                                <InfoItem label="Date of Birth" value={patient.dob} icon={<Calendar />} />
                                <InfoItem label="Gender" value={patient.gender} icon={<User />} />
                            </div>
                        </section>

                        <section className="bg-white rounded-sm p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-1.5 h-6 bg-purple-600" />
                                <h3 className="text-xs font-black text-indigo-900 uppercase tracking-[0.3em]">
                                    Contact & Location
                                </h3>
                            </div>
                            <div className="space-y-8">
                                <InfoItem label="Home Address" value={patient.address} icon={<MapPin />} fullWidth />
                                <InfoItem label="Emergency Contact" value={patient.emergencyContact} icon={<ShieldCheck />} fullWidth />
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Health Quick Look */}
                    <aside className="space-y-8">
                        <div className="bg-linear-to-br from-indigo-700 to-purple-800 rounded-sm p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <HeartPulse size={80} />
                            </div>

                            <h3 className="text-[10px] font-black mb-8 flex items-center gap-2 uppercase tracking-[0.3em] text-indigo-100">
                                Medical Brief
                            </h3>
                            <div className="space-y-8 relative z-10">
                                <div>
                                    <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-2">Blood Group</p>
                                    <p className="text-5xl font-black tracking-tighter">{patient.bloodGroup}</p>
                                </div>
                                <div className="h-px bg-white/20 w-full" />
                                <div>
                                    <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-3">Known Allergies</p>
                                    <div className="flex flex-wrap gap-2">
                                        {["Peanuts", "Penicillin"].map(item => (
                                            <span key={item} className="px-3 py-1 bg-white/10 border border-white/20 rounded-sm text-[10px] font-black uppercase tracking-tighter">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-100">
                            <h4 className="font-black text-indigo-900 mb-4 text-[10px] uppercase tracking-widest">Reports</h4>
                            <p className="text-gray-500 text-xs mb-8 leading-relaxed font-medium">
                                Export your clinical records and identity details in a secure, encrypted PDF format.
                            </p>
                            <button className="w-full py-4 bg-gray-50 border border-gray-200 rounded-sm text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center justify-center gap-3">
                                <Download size={14} /> Generate Report
                            </button>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
};

// --- HELPER COMPONENT ---
const InfoItem = ({ label, value, icon, fullWidth = false }) => (
    <div className={`${fullWidth ? "w-full" : ""}`}>
        <p className="text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1">
            {label}
        </p>
        <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-sm group hover:border-indigo-200 transition-colors">
            <div className="text-indigo-300 group-hover:text-indigo-600 transition-colors shrink-0">
                {React.cloneElement(icon, { size: 18 })}
            </div>
            <p className="text-gray-900 font-bold text-sm truncate">{value}</p>
        </div>
    </div>
);

export default Profile;