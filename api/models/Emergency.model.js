import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null, // Null allowed for guest requests
    },
    patientName: {
      type: String,
      default: "Guest",
    },
    phone: {
      type: String,
      required: true,
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    address: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Dispatched", "Resolved"],
      default: "Pending",
    },
    severity: {
      type: String,
      enum: ["Medium", "High", "Critical"],
      default: "High",
    },
  },
  { timestamps: true }
);

export const Emergency = mongoose.model("Emergency", emergencySchema);
