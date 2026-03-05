import mongoose from "mongoose";
import { Counter } from "./Counter.model.js";

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      unique: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      default: null,
    },

    // Snapshot Info
    name: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    relation: { type: String, default: "Self" },

    appointmentDate: {
      type: Date,
      required: true,
    },

    requestedTimeSlot: {
      type: String,
      required: true,
    },

    approvedTimeSlot: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Completed", "Cancelled"],
      default: "Pending",
    },

    approvedAt: Date,
    completedAt: Date,

    isVisited: {
      type: Boolean,
      default: false,
    },

    previousAppointmentId: {
      type: String,
      default: null,
    },

    paymentMode: {
      type: String,
      enum: ["Online", "Offline"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Canceld"],
      default: "Pending",
    },

    notes: {
      type: String,
      default: "",
    },
    qrCode: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

appointmentSchema.pre("save", async function (next) {
  try {
    if (!this.appointmentId) {
      const counter = await Counter.findOneAndUpdate(
        { name: "appointment" },
        { $inc: { seq: 1 } },
        { returnDocument: "after", upsert: true },
      );

      this.appointmentId = `apt-${counter.seq.toString().padStart(4, "0")}`;
    }
  } catch (error) {
    next(error);
  }
});
appointmentSchema.index(
  { doctorId: 1, appointmentDate: 1, requestedTimeSlot: 1 },
  { unique: true },
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
