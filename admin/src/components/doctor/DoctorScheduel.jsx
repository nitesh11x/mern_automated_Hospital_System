import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAvailableSlotsThunk } from "../../redux/slices/appointment.slice";
import { getDoctorByIdThunk } from "../../redux/slices/doctor.slice";
import { Calendar, Clock, RefreshCw, ArrowLeft, Ban } from "lucide-react";

/**
 * Admin Panel - Doctor Schedule Viewer
 * Allows Admins to visibly track all slots (available and booked) for a dedicated doctor.
 */
const DoctorScheduel = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { singleDoctor, loading: docLoading } = useSelector((state) => state.doctor);
    const { availableSlots, slotsLoading } = useSelector((state) => state.appointment);

    // Initialize with Today's Date safely
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });

    // On mount, load doctor details and initial slots
    useEffect(() => {
        if (id) {
            dispatch(getDoctorByIdThunk(id));
            dispatch(getAvailableSlotsThunk({ doctorId: id, date: selectedDate }));
        }
    }, [dispatch, id, selectedDate]);

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8 selection:bg-indigo-100">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Header Sequence */}
                <div className="flex items-center gap-4 bg-white p-6 rounded-sm shadow-sm border border-slate-200">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-sm transition-colors border border-slate-200"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                            <Calendar className="text-indigo-600" /> Operational Matrix
                        </h1>
                        <p className="text-xs font-bold text-slate-400 mt-1">
                            {docLoading ? "Locating personnel..." : singleDoctor ? `Dr. ${singleDoctor.firstName} ${singleDoctor.lastName} (${singleDoctor.specialization})` : "Tracking Data..."}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    
                    {/* Control Panel (Left) */}
                    <div className="lg:col-span-1 space-y-6">
                        <section className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 sticky top-6">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 border-b border-slate-100 pb-2">Target Date</h3>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Select Target</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 shadow-inner transition-all"
                                />
                            </div>
                            <div className="mt-6 p-4 bg-indigo-50/50 rounded-sm border border-indigo-100">
                                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide mb-1">Status Legend</p>
                                <div className="space-y-2 mt-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-indigo-50 border border-indigo-200 rounded-sm"></div>
                                        <span className="text-[10px] font-bold text-slate-600 uppercase">Available</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-slate-100 border border-slate-300 rounded-sm flex items-center justify-center">
                                            <div className="w-3 h-px bg-slate-400 rotate-45"></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-600 uppercase">Occupied</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Matrix View (Right) */}
                    <div className="lg:col-span-3">
                        <section className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 min-h-125">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <Clock size={14} className="text-indigo-600" /> Chrono Slots Viewer
                            </h3>

                            <div className="space-y-8">
                                {slotsLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-indigo-400">
                                        <RefreshCw size={32} className="animate-spin mb-4" />
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Indexing Chrono-Matrix...</p>
                                    </div>
                                ) : availableSlots && Object.keys(availableSlots).length > 0 ? (
                                    Object.entries(availableSlots).map(([blockKey, block]) => {
                                        const availableCount = block.slots?.filter((s) => !s.isBooked).length || 0;
                                        const bookedCount = block.slots?.length - availableCount;

                                        return (
                                            <div key={blockKey} className="border border-slate-100 bg-slate-50/30 rounded-sm p-6 relative overflow-hidden">
                                                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                                                    <div>
                                                        <h4 className="text-lg font-black uppercase tracking-tight text-indigo-700">
                                                            Phase {blockKey}
                                                        </h4>
                                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                                            {block.name}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <div className="bg-indigo-50 border border-indigo-100 px-3 py-1 rounded shadow-sm">
                                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">
                                                                {availableCount} Available
                                                            </span>
                                                        </div>
                                                        <div className="bg-slate-100 border border-slate-200 px-3 py-1 rounded shadow-sm">
                                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                                                                {bookedCount} Booked
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                                    {block.slots?.map((slot) => {
                                                        const isBooked = slot.isBooked;

                                                        return (
                                                            <div
                                                                key={slot.slotId}
                                                                className={`relative p-3 rounded-sm text-center transition-all duration-200 ${
                                                                    isBooked
                                                                        ? "bg-slate-100 text-slate-400 border border-slate-200 shadow-inner"
                                                                        : "bg-white hover:bg-indigo-50 hover:-translate-y-0.5 border border-indigo-100 shadow-sm"
                                                                }`}
                                                            >
                                                                <div className="text-xs font-black uppercase tracking-wider text-slate-700">
                                                                    {slot.slotId}
                                                                </div>
                                                                <div className={`text-[10px] font-bold mt-1 ${isBooked ? 'text-slate-400' : 'text-indigo-600'}`}>
                                                                    {slot.time}
                                                                </div>
                                                                
                                                                {isBooked && (
                                                                    <>
                                                                        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                                                                            <div className="w-full h-0.5 bg-slate-800 rotate-45"></div>
                                                                            <div className="w-full h-0.5 bg-slate-800 -rotate-45 absolute"></div>
                                                                        </div>
                                                                        <div className="absolute top-1 right-1 text-slate-400">
                                                                            <Ban size={10} />
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-20 text-slate-400">
                                        <Clock size={48} className="mx-auto mb-4 text-slate-200" />
                                        <p className="text-sm font-black uppercase tracking-widest text-slate-500">
                                            No Operations Scheduled
                                        </p>
                                        <p className="text-xs font-medium mt-2">Activate a different date or verify personnel availability.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DoctorScheduel;
