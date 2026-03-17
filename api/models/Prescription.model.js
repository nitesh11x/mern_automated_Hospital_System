import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
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

    diagnosis: String,

    medicines: [
      {
        name: String,
        dosage: String,
        duration: String,
      },
    ],

    advice: String,
  },
  { timestamps: true },
);

export const Prescription = mongoose.model("Prescription", prescriptionSchema);
