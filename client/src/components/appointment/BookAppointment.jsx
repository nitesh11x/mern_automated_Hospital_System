import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  X,
  Bot,
  Brain,
  Sparkles,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { getAllDoctorsThunk } from "../../redux/slices/doctor.slice";
import {
  bookAppointment,
  resetBookingState,
  getAvailableSlotsThunk,
  getPreviousAppointmentByEmailThunk,
} from "../../redux/slices/appointment.slice";
import { notifyProcessingAppointmentThunk } from "../../redux/slices/notification.slice";
import { analyzeSymptomsThunk, resetAiState } from "../../redux/slices/ai.slice";

const BookAppointment = () => {
  const dispatch = useDispatch();

  const { doctors = [], loading: doctorsLoading } = useSelector(
    (state) => state.doctor || {}
  );

  const {
    loading: bookingLoading,
    bookingSuccess,
    error,
    availableSlots,
    slotsLoading,
  } = useSelector((state) => state.appointment || {});

  const { patientFromId } = useSelector((state) => state.patient || {});

  const {
    loading: aiLoading,
    error: aiError,
    triageExplanation,
    recommendedSpecialization,
    recommendedDoctors: aiDoctors = [],
  } = useSelector((state) => state.ai || {});

  const [assignmentMode, setAssignmentMode] = useState("standard");
  const [symptoms, setSymptoms] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [docSearch, setDocSearch] = useState("");
  const [showPreviousAppointments, setShowPreviousAppointments] = useState(false);
  const [selectedPreviousAppointment, setSelectedPreviousAppointment] =
    useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [fetchingPrevious, setFetchingPrevious] = useState(false);

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
    previousAppointmentId: null,
  });

  const minDateValue = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  const filteredDoctors = useMemo(() => {
    const search = docSearch.toLowerCase().trim();

    if (!search) return doctors;

    return doctors.filter((doc) => {
      const fullName = `${doc.firstName || ""} ${doc.lastName || ""}`.toLowerCase();
      const spec = (doc.specialization || "").toLowerCase();
      return fullName.includes(search) || spec.includes(search);
    });
  }, [doctors, docSearch]);

  useEffect(() => {
    if (patientFromId && patientFromId.email) {
      setFormData((prev) => ({
        ...prev,
        name: `${patientFromId.firstName || ""} ${patientFromId.lastName || ""}`.trim(),
        email: patientFromId.email || "",
        gender: patientFromId.gender || "",
      }));
    }
  }, [patientFromId]);

  useEffect(() => {
    if (!doctors?.length && !doctorsLoading) {
      dispatch(getAllDoctorsThunk());
    }
  }, [dispatch, doctors?.length, doctorsLoading]);

  useEffect(() => {
    if (formData.doctorId && formData.appointmentDate) {
      dispatch(
        getAvailableSlotsThunk({
          doctorId: formData.doctorId,
          date: formData.appointmentDate,
        })
      );
      setSelectedSlot(null);
    }
  }, [dispatch, formData.doctorId, formData.appointmentDate]);

  const fetchPreviousAppointmentsByEmail = useCallback(
    async (email) => {
      if (!email) {
        toast.error("Please enter email first");
        return;
      }

      setFetchingPrevious(true);

      try {
        const result = await dispatch(
          getPreviousAppointmentByEmailThunk({ email })
        ).unwrap();

        const appointments = Array.isArray(result)
          ? result
          : result?.prevAppointments || [];

        setPreviousAppointments(appointments);
        setShowPreviousAppointments(true);

        if (!appointments.length) {
          toast("No previous appointments found", { icon: "📋" });
        }
      } catch (err) {
        toast.error(err || "Failed to fetch previous appointments");
        setPreviousAppointments([]);
        setShowPreviousAppointments(true);
      } finally {
        setFetchingPrevious(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (bookingSuccess) {
      toast.success("Appointment booked successfully!");

      dispatch(
        notifyProcessingAppointmentThunk({
          email: formData.email,
          name: formData.name,
        })
      );

      setFormData({
        doctorId: "",
        selectedDocName: "Assign Specialist",
        name: patientFromId
          ? `${patientFromId.firstName || ""} ${patientFromId.lastName || ""}`.trim()
          : "",
        email: patientFromId?.email || "",
        gender: patientFromId?.gender || "",
        relation: "Self",
        appointmentDate: "",
        requestedTimeSlot: "",
        paymentMode: "Offline",
        isVisited: false,
        previousAppointmentId: null,
      });

      setSelectedSlot(null);
      setSelectedDoctor(null);
      setSelectedPreviousAppointment(null);
      setPreviousAppointments([]);
      setShowPreviousAppointments(false);
      dispatch(resetBookingState());
    }

    if (error) {
      toast.error(error);
      dispatch(resetBookingState());
    }
  }, [bookingSuccess, error, dispatch, formData.email, formData.name, patientFromId]);

  useEffect(() => {
    if (aiError) {
      toast.error(aiError, { duration: 5000 });
      dispatch(resetAiState());
    }
  }, [aiError, dispatch]);

  const handleModeChange = (mode) => {
    setAssignmentMode(mode);

    if (mode === "standard") {
      dispatch(resetAiState());
      setSymptoms("");
    }
  };

  const handleSelectDoctor = (doc) => {
    setSelectedDoctor(doc);
    setFormData((prev) => ({
      ...prev,
      doctorId: doc._id,
      selectedDocName: `Dr. ${doc.firstName || ""} ${doc.lastName || ""} (${doc.specialization || "Specialist"})`,
    }));
    setIsOpen(false);
    setSelectedSlot(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "isVisited") {
      const visited = value === "true";

      setFormData((prev) => ({
        ...prev,
        isVisited: visited,
        previousAppointmentId: visited ? prev.previousAppointmentId : null,
      }));

      if (visited) {
        if (!formData.email) {
          toast.error("Please enter email first to see previous appointments");
          setFormData((prev) => ({ ...prev, isVisited: false }));
          return;
        }

        fetchPreviousAppointmentsByEmail(formData.email);
      } else {
        setShowPreviousAppointments(false);
        setSelectedPreviousAppointment(null);
        setPreviousAppointments([]);
      }

      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectPreviousAppointment = (appointment) => {
    setSelectedPreviousAppointment(appointment);

    const doctorId = appointment.doctorId?._id || appointment.doctorId;
    const doctor = doctors.find((d) => d._id === doctorId);

    if (doctor) {
      setSelectedDoctor(doctor);
      setFormData((prev) => ({
        ...prev,
        doctorId: doctor._id,
        selectedDocName: `Dr. ${doctor.firstName || ""} ${doctor.lastName || ""} (${doctor.specialization || "Specialist"})`,
        previousAppointmentId: appointment._id,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        previousAppointmentId: appointment._id,
      }));
    }

    setShowPreviousAppointments(false);
    toast.success(
      `Previous appointment selected: ${new Date(
        appointment.appointmentDate
      ).toLocaleDateString()}`
    );
  };

  const handleSelectTimeSlot = (blockKey, slot) => {
    if (slot.isBooked) {
      toast.error("This time slot is already booked. Please select another slot.");
      return;
    }

    setSelectedSlot({ ...slot, block: blockKey });
    setFormData((prev) => ({
      ...prev,
      requestedTimeSlot: slot.time,
    }));
  };

  const handleAnalyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast.error("Please enter your symptoms to analyze");
      return;
    }

    try {
      await dispatch(analyzeSymptomsThunk(symptoms)).unwrap();
    } catch {
      // Error is already handled by aiError + toast effect
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.doctorId) return toast.error("Please assign a specialist");
    if (!formData.appointmentDate) return toast.error("Please select appointment date");
    if (!selectedSlot) return toast.error("Please select a time slot");
    if (!formData.name) return toast.error("Please enter patient name");
    if (!formData.email) return toast.error("Please enter patient email");
    if (!formData.gender) return toast.error("Please select gender");

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
      previousAppointmentId: formData.previousAppointmentId,
    };

    dispatch(bookAppointment(submissionData));
  };

  const displayedDoctors = assignmentMode === "ai" ? aiDoctors : filteredDoctors;

  return (
    <div className="min-h-screen bg-[#FDFDFF] pt-24 pb-20 px-4 md:px-8 selection:bg-indigo-100">
      <div className="max-w-6xl mx-auto">
        <header className="mb-14 border-l-4 border-indigo-600 pl-6">
          <div className="flex items-center gap-3 mb-2">
            <Zap size={16} className="text-indigo-600 fill-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Intake Protocol / 2026.4
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic">
            Book <span className="text-indigo-600">Consultation</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">
            <section className="bg-white border border-slate-200 rounded-sm shadow-sm p-8">
              <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <Stethoscope size={14} className="text-indigo-600" /> 01. Specialist Assignment
                </span>

                <div className="flex bg-slate-100 p-1 rounded-sm">
                  <button
                    type="button"
                    onClick={() => handleModeChange("standard")}
                    className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-sm transition-all ${
                      assignmentMode === "standard"
                        ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange("ai")}
                    className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-sm flex items-center gap-1 transition-all ${
                      assignmentMode === "ai"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <Sparkles size={10} /> Smart Triage
                  </button>
                </div>
              </h3>

              {assignmentMode === "standard" ? (
                <div className="relative z-50">
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between px-6 py-4 bg-slate-50 border rounded-sm text-sm font-bold transition-all ${
                      isOpen ? "border-indigo-600 bg-white shadow-sm" : "border-slate-200"
                    }`}
                  >
                    <span className="truncate">{formData.selectedDocName}</span>
                    <ChevronDown
                      size={18}
                      className={`text-indigo-600 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
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
                            <Search
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                              size={14}
                            />
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
                          {doctorsLoading ? (
                            <div className="p-4 text-center">
                              <RefreshCw
                                size={20}
                                className="animate-spin mx-auto text-indigo-600"
                              />
                              <p className="text-[10px] font-bold text-slate-400 mt-2">
                                Loading doctors...
                              </p>
                            </div>
                          ) : displayedDoctors.length > 0 ? (
                            displayedDoctors.map((doc) => (
                              <button
                                key={doc._id}
                                type="button"
                                onClick={() => handleSelectDoctor(doc)}
                                className="w-full flex items-center justify-between p-4 hover:bg-indigo-600 hover:text-white transition-all text-left"
                              >
                                <div>
                                  <p className="text-xs font-black uppercase">
                                    Dr. {doc.firstName || ""} {doc.lastName || ""}
                                  </p>
                                  <p className="text-[9px] font-bold uppercase opacity-60">
                                    {doc.specialization || "Specialist"}
                                  </p>
                                  <p className="text-[8px] font-bold opacity-40 mt-1">
                                    ₹{doc.consultationFees || 0} | {doc.experience || 0}+ yrs
                                  </p>
                                </div>
                                {formData.doctorId === doc._id && <Check size={16} />}
                              </button>
                            ))
                          ) : (
                            <div className="p-4 text-center text-[10px] font-bold text-slate-400">
                              No doctors found
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    className="w-full bg-slate-50 border border-slate-200 rounded-sm p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                    rows="3"
                    placeholder="Describe what you are experiencing... (e.g. 'I have had a severe migraine for 2 days and my vision is blurry')"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={handleAnalyzeSymptoms}
                    disabled={aiLoading}
                    className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-black text-[10px] uppercase tracking-widest py-3.5 rounded-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {aiLoading ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <Brain size={14} />
                    )}
                    {aiLoading ? "Inference Engine Processing..." : "Analyze Symptoms"}
                  </button>

                  {triageExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 border-l-4 border-indigo-500 bg-indigo-50/50 p-5 rounded-r-lg"
                    >
                      <p className="text-[11px] font-black text-indigo-800 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <Bot size={14} /> Triage Assessment: {recommendedSpecialization}
                      </p>
                      <p className="text-sm font-medium text-slate-700 leading-relaxed">
                        {triageExplanation}
                      </p>

                      <div className="mt-5 pt-5 border-t border-indigo-200/50">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">
                          Recommended Specialists
                        </p>

                        <div className="space-y-2">
                          {aiDoctors.length > 0 ? (
                            aiDoctors.map((doc) => (
                              <button
                                key={doc._id}
                                type="button"
                                onClick={() => handleSelectDoctor(doc)}
                                className={`w-full text-left px-4 py-3 rounded-sm flex items-center justify-between border transition-all ${
                                  formData.doctorId === doc._id
                                    ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
                                    : "border-indigo-200 bg-white hover:bg-indigo-50 hover:border-indigo-300"
                                }`}
                              >
                                <div>
                                  <p className="text-xs font-black uppercase tracking-tight">
                                    Dr. {doc.firstName || ""} {doc.lastName || ""}
                                  </p>
                                  <p
                                    className={`text-[9px] font-bold mt-0.5 ${
                                      formData.doctorId === doc._id
                                        ? "text-indigo-200"
                                        : "text-slate-500"
                                    }`}
                                  >
                                    {doc.experience || 0}+ Years Experience · ₹
                                    {doc.consultationFees || 0}
                                  </p>
                                </div>
                                {formData.doctorId === doc._id && (
                                  <div className="bg-white/20 p-1 rounded-full">
                                    <Check size={14} className="text-white" />
                                  </div>
                                )}
                              </button>
                            ))
                          ) : (
                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-sm text-center">
                              <p className="text-xs text-rose-600 font-bold">
                                No specialists available for this condition currently.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </section>

            <section className="bg-white border border-slate-200 rounded-sm shadow-sm p-8">
              <h3 className="text-[10px] font-black uppercase text-slate-400 mb-8 flex items-center gap-2">
                <User size={14} className="text-indigo-600" /> 02. Patient Dossier
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                <FormGroup label="Full Name">
                  <input
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup label="Secure Email">
                  <input
                    name="email"
                    type="email"
                    placeholder="EMAIL@NETWORK.COM"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup label="Gender">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">SELECT GENDER</option>
                    <option value="Male">MALE</option>
                    <option value="Female">FEMALE</option>
                    <option value="Other">OTHER</option>
                  </select>
                </FormGroup>

                <FormGroup label="Relation">
                  <select
                    name="relation"
                    value={formData.relation}
                    onChange={handleChange}
                  >
                    <option value="Self">SELF / PRIMARY</option>
                    <option value="Parent">PARENT</option>
                    <option value="Spouse">SPOUSE</option>
                    <option value="Other">OTHER</option>
                  </select>
                </FormGroup>
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-sm shadow-sm p-8">
              <h3 className="text-[10px] font-black uppercase text-slate-400 mb-8 flex items-center gap-2">
                <Calendar size={14} className="text-indigo-600" /> 03. Scheduling & Case Type
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <FormGroup label="Visit Date">
                  <input
                    type="date"
                    name="appointmentDate"
                    min={minDateValue}
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup label="Follow-up Case?">
                  <select
                    name="isVisited"
                    value={String(formData.isVisited)}
                    onChange={handleChange}
                  >
                    <option value="false">NO (NEW CASE)</option>
                    <option value="true">YES (FOLLOW-UP)</option>
                  </select>
                </FormGroup>

                <FormGroup label="Payment">
                  <select
                    name="paymentMode"
                    value={formData.paymentMode}
                    onChange={handleChange}
                  >
                    <option value="Offline">OFFLINE</option>
                    <option value="Online">ONLINE</option>
                  </select>
                </FormGroup>
              </div>
            </section>

            <AnimatePresence>
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
                        <h3 className="text-lg font-black uppercase">
                          Previous Appointments
                        </h3>
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
                      {fetchingPrevious ? (
                        <div className="text-center py-8">
                          <RefreshCw
                            size={24}
                            className="animate-spin mx-auto text-indigo-600"
                          />
                          <p className="text-sm text-slate-500 mt-2">
                            Loading previous appointments...
                          </p>
                        </div>
                      ) : previousAppointments.length > 0 ? (
                        <div className="space-y-4">
                          {previousAppointments.map((appointment) => (
                            <button
                              key={appointment._id}
                              type="button"
                              onClick={() => handleSelectPreviousAppointment(appointment)}
                              className="w-full text-left p-4 border border-slate-200 rounded-sm hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-black uppercase">
                                    Appointment ID: {appointment._id}
                                  </p>
                                  <p className="text-[10px] font-bold uppercase text-slate-500">
                                    Doctor: Dr. {appointment.doctorId?.firstName || ""}{" "}
                                    {appointment.doctorId?.lastName || ""}
                                  </p>
                                </div>

                                <div className="text-right">
                                  <p className="text-xs font-black">
                                    {new Date(
                                      appointment.appointmentDate
                                    ).toLocaleDateString()}
                                  </p>
                                  <p className="text-[10px] font-bold text-slate-500">
                                    {appointment.requestedTimeSlot}
                                  </p>
                                </div>
                              </div>

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
                          <History size={40} className="mx-auto mb-3 text-slate-300" />
                          <p className="text-sm font-bold">
                            No previous appointments found.
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {formData.doctorId && formData.appointmentDate ? (
              <section className="bg-white border border-slate-200 rounded-sm shadow-sm p-8">
                <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 flex items-center gap-2">
                  <Clock size={14} className="text-indigo-600" /> 04. Select Time Slot
                </h3>

                <div className="space-y-8">
                  {slotsLoading ? (
                    <div className="text-center py-8 text-slate-500">
                      <RefreshCw
                        size={24}
                        className="animate-spin mx-auto mb-2 text-indigo-400"
                      />
                      <p className="text-sm font-bold">Loading available slots...</p>
                    </div>
                  ) : availableSlots && Object.keys(availableSlots).length > 0 ? (
                    Object.entries(availableSlots).map(([blockKey, block]) => {
                      const availableCount =
                        block.slots?.filter((s) => !s.isBooked).length || 0;

                      return (
                        <div
                          key={blockKey}
                          className="border-b border-slate-100 pb-6 last:border-0"
                        >
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
                                {availableCount} / {block.slots?.length || 0} slots available
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {block.slots?.map((slot) => {
                              const isSelected = selectedSlot?.slotId === slot.slotId;
                              const isBooked = slot.isBooked;

                              return (
                                <button
                                  key={slot.slotId}
                                  type="button"
                                  onClick={() => handleSelectTimeSlot(blockKey, slot)}
                                  disabled={isBooked}
                                  className={`relative py-3 px-2 rounded-sm text-center transition-all duration-200 ${
                                    isSelected
                                      ? "bg-indigo-600 text-white shadow-lg scale-105 ring-2 ring-indigo-300"
                                      : isBooked
                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                      : "bg-indigo-50 hover:bg-indigo-100 hover:scale-105 border-2 border-indigo-200 cursor-pointer"
                                  }`}
                                >
                                  <div className="text-xs font-black uppercase tracking-wider">
                                    {slot.slotId}
                                  </div>
                                  <div className="text-[10px] font-bold mt-1">
                                    {slot.time}
                                  </div>

                                  {isBooked && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-full h-0.5 bg-gray-400 rotate-45" />
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
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Clock size={48} className="mx-auto mb-3 text-slate-300" />
                      <p className="text-sm font-bold">No slots available for this date.</p>
                      <p className="text-xs mt-1">Please try a different date</p>
                    </div>
                  )}
                </div>

                {selectedSlot && (
                  <div className="mt-8 p-4 bg-indigo-50 border-2 border-indigo-200 rounded-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase text-indigo-600 mb-1">
                          Selected Time Slot
                        </p>
                        <p className="text-lg font-black text-indigo-800">
                          {selectedSlot.slotId} - {selectedSlot.time}
                        </p>
                      </div>
                      <Clock size={24} className="text-indigo-400" />
                    </div>
                  </div>
                )}
              </section>
            ) : (
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
              className="w-full bg-slate-900 text-white py-6 rounded-sm font-black text-[11px] uppercase tracking-[0.4em] hover:bg-indigo-600 transition-all shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
              {bookingLoading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  PROCESSING...
                </>
              ) : (
                <>
                  Finalize Appointment
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          <aside className="lg:col-span-4">
            <div className="bg-slate-900 rounded-sm p-8 sticky top-28 border border-slate-800 shadow-2xl">
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">
                    Visit Ledger
                  </h3>
                  <Activity size={14} className="text-indigo-400" />
                </div>

                <div className="space-y-6">
                  <SummaryItem label="Expert" value={formData.selectedDocName} />
                  <SummaryItem
                    label="Timeline"
                    value={
                      formData.appointmentDate
                        ? `${new Date(formData.appointmentDate).toLocaleDateString()} @ ${
                            selectedSlot?.time || "TBD"
                          }`
                        : "NOT SCHEDULED"
                    }
                  />
                  <SummaryItem label="Patient" value={formData.name || "UNREGISTERED"} />

                  {selectedSlot && (
                    <SummaryItem
                      label="Slot"
                      value={`${selectedSlot.slotId} - ${selectedSlot.time}`}
                    />
                  )}

                  <div>
                    <p className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2">
                      / Case Type
                    </p>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border text-[9px] font-black uppercase ${
                        formData.isVisited
                          ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-400"
                          : "bg-slate-800 border-slate-700 text-slate-400"
                      }`}
                    >
                      {formData.isVisited ? (
                        <>
                          <RefreshCw size={10} /> Follow-up Visit
                        </>
                      ) : (
                        "First-time Case"
                      )}
                    </div>
                  </div>

                  {selectedPreviousAppointment && (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <p className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2">
                        / Previous Visit
                      </p>
                      <div className="text-[9px] text-slate-400 space-y-1">
                        <p>ID: {selectedPreviousAppointment._id}</p>
                        <p>
                          Date:{" "}
                          {new Date(
                            selectedPreviousAppointment.appointmentDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700 rounded-sm">
                  <div className="flex items-center gap-2 text-indigo-400 mb-2">
                    <ShieldCheck size={14} />
                    <span className="text-[8px] font-black uppercase tracking-widest">
                      Secure HIPAA Node
                    </span>
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

const FormGroup = ({ label, children }) => {
  const child = React.Children.only(children);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
        {label}
      </label>
      {React.cloneElement(child, {
        className: `w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-[12px] font-black text-slate-900 uppercase tracking-tight outline-none transition-all focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 ${
          child.props.className || ""
        }`,
      })}
    </div>
  );
};

const SummaryItem = ({ label, value }) => (
  <div>
    <p className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em] mb-1">
      / {label}
    </p>
    <p className="text-sm font-black text-white uppercase tracking-wider truncate">
      {value || "—"}
    </p>
  </div>
);

export default BookAppointment;