import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  MapPin,
  Phone,
  Calendar as CalendarIcon,
  Clock,
  CreditCard,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  Stethoscope,
  Activity,
  MessageSquare,
  Video as VideoIcon
} from "lucide-react";
import { getAppointmentById } from "../../redux/slices/appointment.slice";
import ChatWindow from "../telemedicine/ChatWindow";
import VideoRoom from "../telemedicine/VideoRoom";

const AppointmentDetail = ({ appointmentId, onClose }) => {
  const dispatch = useDispatch();
  const [showChat, setShowChat] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const { currentAppointment, loading } = useSelector((state) => state.appointment);

  useEffect(() => {
    if (appointmentId) {
      dispatch(getAppointmentById(appointmentId));
    }
  }, [dispatch, appointmentId]);

  if (loading || !currentAppointment || currentAppointment._id !== appointmentId) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white p-8 rounded-sm flex flex-col items-center shadow-2xl">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Loading Dossier...</p>
        </div>
      </div>
    );
  }

  const appt = currentAppointment;
  const patient = appt.patientId;
  const doctor = appt.doctorId;

  const getStatusColor = (status) => {
    const colors = {
      Approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
      Pending: "bg-amber-100 text-amber-800 border-amber-200",
      Completed: "bg-blue-100 text-blue-800 border-blue-200",
      Cancelled: "bg-rose-100 text-rose-800 border-rose-200",
    };
    return colors[status] || "bg-slate-100 text-slate-800 border-slate-200";
  };

  const isEligibleForTelemedicine = () => {
    if (appt.status !== "Completed") return false;
    const completedDate = new Date(appt.completedAt || appt.updatedAt).getTime();
    const now = Date.now();
    const diffDays = (now - completedDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 5;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-40 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-sm shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200"
        >
          {/* Header */}
          <div className="bg-linear-to-r from-indigo-900 to-purple-900 p-6 flex justify-between items-start text-white sticky top-0 z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-black uppercase tracking-tight">Appointment Dossier</h2>
                <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-full border ${appt.status === "Approved" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                    appt.status === "Completed" ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
                      appt.status === "Pending" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
                        "bg-rose-500/20 text-rose-300 border-rose-500/30"
                  }`}>
                  {appt.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-indigo-200">
                <span className="flex items-center gap-1 font-mono bg-indigo-950/50 px-2 py-1 rounded">
                  Ref: {appt.appointmentId}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarIcon size={12} /> {new Date(appt.appointmentDate).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {appt.approvedTimeSlot || appt.requestedTimeSlot}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content Scrollable */}
          <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 flex-1">

            {/* Patient Card */}
            <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform z-0"></div>
              <div className="relative z-10">
                <h3 className="text-xs font-black text-purple-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <User size={14} /> Subject Profile
                </h3>

                {patient ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-indigo-500 rounded-sm text-white flex items-center justify-center text-xl font-black shadow-inner">
                        {patient.firstName?.charAt(0) || appt.name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-800 capitalize">{patient.firstName} {patient.lastName}</h4>
                        <p className="text-xs text-slate-500 block">System ID: {patient.patientId}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Age/Gender</p>
                        <p className="text-sm font-semibold text-slate-700 capitalize">{patient.age} Yrs • {patient.gender}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Blood Group</p>
                        <p className="text-sm font-semibold text-rose-600">{patient.bloodGroup || "Unknown"}</p>
                      </div>
                      <div className="col-span-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Phone size={14} className="text-purple-400" /> {patient.phone}
                      </div>
                      <div className="col-span-2 flex items-start gap-2 text-sm font-semibold text-slate-700">
                        <MapPin size={14} className="text-purple-400 mt-1 shrink-0" />
                        <span className="truncate">{patient.address}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400">
                    <AlertCircle className="mx-auto mb-2 opacity-50" size={24} />
                    <p className="text-sm font-bold">Unregistered Patient</p>
                    <p className="text-xs">Guest booking ({appt.name})</p>
                  </div>
                )}
              </div>
            </div>

            {/* Doctor Card */}
            <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform z-0"></div>
              <div className="relative z-10">
                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Stethoscope size={14} /> Assigned Specialist
                </h3>

                {doctor ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={doctor.profileImage?.url || "https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133352010-stock-illustration-default-placeholder-man-and-woman.jpg"}
                        alt="Doctor"
                        className="w-14 h-14 rounded-sm object-cover shadow-sm border border-slate-100"
                      />
                      <div>
                        <h4 className="text-lg font-black text-slate-800 capitalize">Dr. {doctor.firstName} {doctor.lastName}</h4>
                        <p className="text-xs font-bold text-blue-600">{doctor.specialization}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Experience</p>
                        <p className="text-sm font-semibold text-slate-700">{doctor.experience}+ Years</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Consultation Fee</p>
                        <p className="text-sm font-semibold text-emerald-600">₹{doctor.consultationFees}</p>
                      </div>
                      <div className="col-span-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Phone size={14} className="text-blue-400" /> {doctor.phone}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400">
                    <p className="text-sm font-bold">Unassigned</p>
                  </div>
                )}
              </div>
            </div>

            {/* Details Row */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">

              {/* Consultation Flow */}
              <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-5">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity size={12} /> Appointment Context
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-xs font-semibold text-slate-500">Visit Type</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${appt.isVisited ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {appt.isVisited ? "Follow-up" : "First Visit"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-xs font-semibold text-slate-500">Booking By</span>
                    <span className="text-xs font-bold text-slate-700">{appt.relation}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-xs font-semibold text-slate-500">Source Email</span>
                    <span className="text-xs font-bold text-slate-700 truncate max-w-37.5">{appt.email}</span>
                  </div>
                </div>
              </div>

              {/* Financial & Status */}
              <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-5">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <CreditCard size={12} /> Billing & Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-xs font-semibold text-slate-500">Payment Mode</span>
                    <span className="text-xs font-bold text-slate-700">{appt.paymentMode}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-xs font-semibold text-slate-500">Payment Status</span>
                    <span className={`text-xs font-black uppercase ${appt.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-500'}`}>
                      {appt.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-xs font-semibold text-slate-500">Admin Approval</span>
                    <span className="text-xs font-bold text-slate-700">
                      {appt.approvedAt ? new Date(appt.approvedAt).toLocaleDateString() : "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* QR / Documentation */}
              <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-5 flex flex-col items-center justify-center">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 self-start flex items-center gap-2">
                  <FileText size={12} /> Authentication
                </h3>
                {appt.qrCode ? (
                  <div className="text-center group border border-slate-100 p-2 rounded-sm hover:shadow-md transition-shadow bg-slate-50">
                    <img src={appt.qrCode} alt="QR Code" className="w-24 h-24 object-contain mix-blend-multiply" />
                    <p className="text-[9px] font-bold text-slate-400 mt-2">VERIFIED PASS</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300">
                    <div className="w-16 h-16 border-2 border-dashed border-slate-200 rounded-sm flex items-center justify-center mb-2">
                      <CheckCircle size={20} className="text-slate-200" />
                    </div>
                    <p className="text-xs font-bold">No QR Generated</p>
                  </div>
                )}
              </div>

              {/* Telemedicine Trigger */}
              {isEligibleForTelemedicine() && (
                <div className="md:col-span-2 bg-linear-to-r from-purple-50 to-indigo-50 rounded-sm border border-indigo-200 shadow-sm p-5 mt-2 flex flex-col md:flex-row items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-indigo-800 uppercase tracking-widest flex items-center gap-2 mb-1">
                      <Activity size={16} /> 5-Day Telemedicine Follow-up Active
                    </h3>
                    <p className="text-xs font-semibold text-indigo-600/80">Available free of charge since the appointment was marked completed.</p>
                  </div>
                  <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <button
                      onClick={() => setShowChat(true)}
                      className="flexItems-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-sm text-xs font-black shadow-md transition-all uppercase tracking-wider"
                    >
                      <MessageSquare size={14} /> Open Chat
                    </button>
                    <button
                      onClick={() => setShowVideo(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-xs font-black shadow-md transition-all uppercase tracking-wider"
                    >
                      <VideoIcon size={14} /> Video Call
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </motion.div>
      </div>

      {/* Conditionally render floating UI above the modal z-index */}
      {showChat && (
        <ChatWindow
          appointment={appt}
          // Defaulting to "User" since we don't have direct access to auth context locally here, 
          // but we can infer from the patient data natively matched
          currentUser={{
            _id: patient?._id || "ADMIN_VIEW",
            name: patient?.firstName || appt.name || "System",
            role: patient ? "patient" : "admin"
          }}
          onClose={() => setShowChat(false)}
        />
      )}

      {showVideo && (
        <VideoRoom
          appointment={appt}
          currentUser={{
            _id: patient?._id || "ADMIN_VIEW",
            name: patient?.firstName || appt.name || "System"
          }}
          onClose={() => setShowVideo(false)}
        />
      )}
    </>
  );
};

export default AppointmentDetail;
