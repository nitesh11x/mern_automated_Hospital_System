import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Check,
  ChevronDown,
  Clock,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User,
  Users,
} from "lucide-react";

import { getAllDoctorsThunk } from "../../redux/slices/doctor.slice";
import {
  bookAppointmentByAdminThunk,
  resetBookingState,
  getAvailableSlotsThunk,
} from "../../redux/slices/appointment.slice";

const BookAppointmentByAdmin = () => {
  const dispatch = useDispatch();

  const { doctors = [], loading: doctorsLoading } = useSelector(
    (state) => state.doctor || {}
  );

  const {
    loading: bookingLoading = false,
    success,
    bookingSuccess,
    error,
    availableSlots = {},
    slotsLoading = false,
  } = useSelector((state) => state.appointment || {});

  const isSuccess = success ?? bookingSuccess ?? false;

  const { patientFromId } = useSelector((state) => state.patient || {});

  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const [docSearch, setDocSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [formData, setFormData] = useState({
    doctorId: "",
    selectedDocName: "Assign Specialist",
    patientId: "",
    name: "",
    email: "",
    phone: "",
    gender: "",
    relation: "Self",
    appointmentDate: "",
    requestedTimeSlot: "",
    paymentMode: "Offline",
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
      const spec = (doc.specialization || doc.department || "").toLowerCase();
      return fullName.includes(search) || spec.includes(search);
    });
  }, [doctors, docSearch]);

  useEffect(() => {
    if (!doctors?.length && !doctorsLoading) {
      dispatch(getAllDoctorsThunk());
    }
  }, [dispatch, doctors?.length, doctorsLoading]);

  useEffect(() => {
    if (patientFromId) {
      setFormData((prev) => ({
        ...prev,
        patientId: patientFromId._id || "",
        name: `${patientFromId.firstName || ""} ${patientFromId.lastName || ""}`.trim(),
        email: patientFromId.email || "",
        phone: patientFromId.phone || "",
        gender: patientFromId.gender || "",
      }));
    }
  }, [patientFromId]);

  useEffect(() => {
    if (formData.doctorId && formData.appointmentDate) {
      dispatch(
        getAvailableSlotsThunk({
          doctorId: formData.doctorId,
          date: formData.appointmentDate,
        })
      );
      setSelectedSlot(null);
      setFormData((prev) => ({
        ...prev,
        requestedTimeSlot: "",
      }));
    }
  }, [dispatch, formData.doctorId, formData.appointmentDate]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Appointment booked successfully!");

      setFormData({
        doctorId: "",
        selectedDocName: "Assign Specialist",
        patientId: patientFromId?._id || "",
        name: patientFromId
          ? `${patientFromId.firstName || ""} ${patientFromId.lastName || ""}`.trim()
          : "",
        email: patientFromId?.email || "",
        phone: patientFromId?.phone || "",
        gender: patientFromId?.gender || "",
        relation: "Self",
        appointmentDate: "",
        requestedTimeSlot: "",
        paymentMode: "Offline",
      });

      setSelectedDoctor(null);
      setSelectedSlot(null);
      dispatch(resetBookingState());
    }

    if (error) {
      toast.error(error);
      dispatch(resetBookingState());
    }
  }, [isSuccess, error, dispatch, patientFromId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectDoctor = (doc) => {
    setSelectedDoctor(doc);
    setFormData((prev) => ({
      ...prev,
      doctorId: doc._id,
      selectedDocName: `Dr. ${doc.firstName || ""} ${doc.lastName || ""} (${
        doc.specialization || doc.department || "Specialist"
      })`,
    }));
    setIsDoctorOpen(false);
    setSelectedSlot(null);
  };

  const handleSelectTimeSlot = (blockKey, slot) => {
    if (slot.isBooked) {
      toast.error("This time slot is already booked. Please choose another one.");
      return;
    }

    setSelectedSlot({ ...slot, block: blockKey });
    setFormData((prev) => ({
      ...prev,
      requestedTimeSlot: slot.time,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.doctorId) return toast.error("Please select a doctor");
    if (!formData.name.trim()) return toast.error("Please enter patient name");
    if (!formData.email.trim()) return toast.error("Please enter patient email");
    if (!formData.gender) return toast.error("Please select gender");
    if (!formData.appointmentDate) return toast.error("Please select appointment date");
    if (!selectedSlot) return toast.error("Please select a time slot");

    const payload = {
      doctorId: formData.doctorId,
      patientId: formData.patientId || undefined,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      gender: formData.gender,
      relation: formData.relation,
      appointmentDate: formData.appointmentDate,
      requestedTimeSlot: selectedSlot.time,
      slotId: selectedSlot.slotId,
      paymentMode: formData.paymentMode,
    };

    dispatch(bookAppointmentByAdminThunk(payload));
  };

  return (
    <div className="min-h-screen bg-[#f8f7ff] px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 border-l-4 border-indigo-600 pl-5">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles size={14} className="text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Admin Booking
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 md:text-4xl">
            Book Appointment By <span className="text-indigo-600">Admin</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Select a doctor, enter patient details, choose a date and time slot, then book the appointment.
            If the patient does not exist, your backend can create it automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <form onSubmit={handleSubmit} className="space-y-8 lg:col-span-8">
            <section className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <SectionTitle icon={<Stethoscope size={14} />} title="Specialist Assignment" />

              <div className="relative z-30">
                <button
                  type="button"
                  onClick={() => setIsDoctorOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-bold text-slate-800 transition-all hover:bg-white"
                >
                  <span className="truncate">{formData.selectedDocName}</span>
                  <ChevronDown
                    size={18}
                    className={`text-indigo-600 transition-transform ${
                      isDoctorOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDoctorOpen && (
                  <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-sm border border-slate-200 bg-white shadow-2xl">
                    <div className="border-b bg-slate-50 p-4">
                      <div className="relative">
                        <Search
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="text"
                          placeholder="Search by name or specialty"
                          value={docSearch}
                          onChange={(e) => setDocSearch(e.target.value)}
                          className="w-full rounded-sm border border-slate-200 bg-white py-3 pl-10 pr-4 text-[11px] font-bold uppercase outline-none focus:border-indigo-600"
                        />
                      </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                      {doctorsLoading ? (
                        <div className="p-5 text-center">
                          <RefreshCw className="mx-auto animate-spin text-indigo-600" size={20} />
                          <p className="mt-2 text-[10px] font-bold uppercase text-slate-400">
                            Loading doctors
                          </p>
                        </div>
                      ) : filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doc) => (
                          <button
                            key={doc._id}
                            type="button"
                            onClick={() => handleSelectDoctor(doc)}
                            className="flex w-full items-center justify-between px-4 py-3 text-left transition-all hover:bg-indigo-600 hover:text-white"
                          >
                            <div>
                              <p className="text-xs font-black uppercase">
                                Dr. {doc.firstName || ""} {doc.lastName || ""}
                              </p>
                              <p className="text-[9px] font-bold uppercase opacity-60">
                                {doc.specialization || doc.department || "Specialist"}
                              </p>
                            </div>
                            {formData.doctorId === doc._id && <Check size={16} />}
                          </button>
                        ))
                      ) : (
                        <div className="p-5 text-center text-[10px] font-bold uppercase text-slate-400">
                          No doctors found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <SectionTitle icon={<User size={14} />} title="Patient Details" />

              <div className="grid gap-6 md:grid-cols-2">
                <FormGroup label="Full Name">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="name"
                    required
                  />
                </FormGroup>

                <FormGroup label="Email">
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="abc@example.com"
                    required
                  />
                </FormGroup>

                <FormGroup label="Phone">
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                  />
                </FormGroup>

                <FormGroup label="Gender">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </FormGroup>

                <FormGroup label="Relation">
                  <select
                    name="relation"
                    value={formData.relation}
                    onChange={handleChange}
                  >
                    <option value="Self">Self</option>
                    <option value="Parent">Parent</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Other">Other</option>
                  </select>
                </FormGroup>
              </div>
            </section>

            <section className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <SectionTitle icon={<Calendar size={14} />} title="Date & Payment" />

              <div className="grid gap-6 md:grid-cols-2">
                <FormGroup label="Appointment Date">
                  <input
                    type="date"
                    name="appointmentDate"
                    min={minDateValue}
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup label="Payment Mode">
                  <select
                    name="paymentMode"
                    value={formData.paymentMode}
                    onChange={handleChange}
                  >
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                  </select>
                </FormGroup>
              </div>
            </section>

            <section className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <SectionTitle icon={<Clock size={14} />} title="Available Time Slots" />

              {!formData.doctorId || !formData.appointmentDate ? (
                <div className="rounded-sm border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
                  <Clock size={36} className="mx-auto text-slate-300" />
                  <p className="mt-3 text-sm font-bold text-slate-500">
                    Please select a doctor and appointment date first
                  </p>
                </div>
              ) : slotsLoading ? (
                <div className="py-10 text-center">
                  <RefreshCw size={22} className="mx-auto animate-spin text-indigo-600" />
                  <p className="mt-2 text-sm font-bold text-slate-500">
                    Loading slots...
                  </p>
                </div>
              ) : Object.keys(availableSlots || {}).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(availableSlots).map(([blockKey, block]) => {
                    const availableCount =
                      block?.slots?.filter((s) => !s.isBooked)?.length || 0;

                    return (
                      <div
                        key={blockKey}
                        className="border-b border-slate-100 pb-6 last:border-b-0 last:pb-0"
                      >
                        <div className="mb-4 flex items-center justify-between gap-4">
                          <div>
                            <h4 className="text-sm font-black uppercase tracking-wider text-indigo-600">
                              Block {blockKey}
                            </h4>
                            <p className="text-[10px] font-bold uppercase text-slate-400">
                              {block?.name || "Time Block"}
                            </p>
                          </div>
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase text-indigo-600">
                            {availableCount}/{block?.slots?.length || 0} available
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                          {block?.slots?.map((slot) => {
                            const isSelected = selectedSlot?.slotId === slot.slotId;
                            const isBooked = slot.isBooked;

                            return (
                              <button
                                key={slot.slotId}
                                type="button"
                                onClick={() => handleSelectTimeSlot(blockKey, slot)}
                                disabled={isBooked}
                                className={`relative rounded-sm border px-3 py-3 text-center transition-all ${
                                  isSelected
                                    ? "border-indigo-600 bg-indigo-600 text-white shadow-lg"
                                    : isBooked
                                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                                    : "border-indigo-200 bg-indigo-50 hover:scale-[1.02] hover:bg-indigo-100"
                                }`}
                              >
                                <div className="text-xs font-black uppercase tracking-wider">
                                  {slot.slotId}
                                </div>
                                <div className="mt-1 text-[10px] font-bold">
                                  {slot.time}
                                </div>
                                {isSelected && (
                                  <div className="absolute -right-2 -top-2 rounded-full bg-green-500 p-1 text-white">
                                    <Check size={12} />
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
              ) : (
                <div className="rounded-sm border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
                  <Clock size={36} className="mx-auto text-slate-300" />
                  <p className="mt-3 text-sm font-bold text-slate-500">
                    No slots available for this date
                  </p>
                </div>
              )}
            </section>

            <button
              type="submit"
              disabled={bookingLoading || !selectedSlot}
              className="flex w-full items-center justify-center gap-3 rounded-sm bg-slate-900 px-6 py-4 text-[11px] font-black uppercase tracking-[0.35em] text-white transition-all hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {bookingLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  Book Appointment
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-sm border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl">
              <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em]">
                  Booking Summary
                </h3>
                <ShieldCheck size={14} className="text-indigo-400" />
              </div>

              <div className="space-y-5">
                <SummaryItem label="Doctor" value={formData.selectedDocName} />
                <SummaryItem label="Patient" value={formData.name || "—"} />
                <SummaryItem label="Email" value={formData.email || "—"} />
                <SummaryItem
                  label="Date"
                  value={
                    formData.appointmentDate
                      ? new Date(formData.appointmentDate).toLocaleDateString()
                      : "—"
                  }
                />
                <SummaryItem label="Time" value={selectedSlot?.time || "—"} />
                <SummaryItem label="Payment" value={formData.paymentMode} />
                <SummaryItem label="Relation" value={formData.relation} />
              </div>

              <div className="mt-6 rounded-sm border border-slate-700 bg-slate-800/60 p-4">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
                  System Note
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  This form sends only the payload required by your admin booking API.
                  The backend can create the patient automatically when needed.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ icon, title }) => (
  <div className="mb-6 flex items-center justify-between gap-4">
    <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
      {icon}
      {title}
    </h3>
  </div>
);

const FormGroup = ({ label, children }) => {
  const child = React.Children.only(children);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-400">
        {label}
      </label>
      {React.cloneElement(child, {
        className: `w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
          child.props.className || ""
        }`,
      })}
    </div>
  );
};

const SummaryItem = ({ label, value }) => (
  <div>
    <p className="mb-1 text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
      {label}
    </p>
    <p className="truncate text-sm font-black uppercase tracking-wide text-white">
      {value || "—"}
    </p>
  </div>
);

export default BookAppointmentByAdmin;