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

    diagnosis: {
      type: String,
      trim: true,
    },

    medicines: [
      {
        // Add explicit _id for each medicine
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true,
        },
        name: {
          type: String,
          required: true,
          trim: true,
        },
        dosage: {
          type: String,
          required: true,
          trim: true,
        },
        duration: {
          type: String,
          required: true,
        },
        frequencyOfDose: {
          type: String,
          required: true,
          enum: ["1", "2", "3"],
        },
        // Track when reminders were sent for this medicine
        remindersSent: [
          {
            date: {
              type: Date,
              default: Date.now,
            },
            timeSlot: {
              type: String,
            },
          },
        ],
      },
    ],

    advice: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

// Index for faster queries
prescriptionSchema.index({ patientId: 1, createdAt: -1 });
prescriptionSchema.index({ doctorId: 1, createdAt: -1 });
prescriptionSchema.index({ appointmentId: 1 });

export const Prescription = mongoose.model("Prescription", prescriptionSchema);