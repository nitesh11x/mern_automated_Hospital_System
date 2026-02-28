import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      unique: true
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    },

    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      default: null
    },

    // Snapshot Info
    name: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    relation: { type: String, default: "Self" },

    appointmentDate: {
      type: Date,
      required: true
    },

    requestedTimeSlot: {
      type: String,
      required: true
    },

    approvedTimeSlot: {
      type: String,
      default: null
    },

    status: {
      type: String,
      enum: ["pending", "approved", "completed", "cancelled"],
      default: "pending"
    },

    approvedAt: Date,
    completedAt: Date,

    isVisit: {
      type: Boolean,
      default: false
    },

    previousAppointmentId: {
      type: String,
      default: null
    },

    paymentMode: {
      type: String,
      enum: ["Online", "Offline"],
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending"
    },

    notes: String
  },
  { timestamps: true }
);
appointmentSchema.pre("save", function (next) {
  if (!this.appointmentId) {
    this.appointmentId =
      "apt-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  }
});
appointmentSchema.index(
  { doctorId: 1, appointmentDate: 1, requestedTimeSlot: 1 },
  { unique: true }
);
export const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema
);