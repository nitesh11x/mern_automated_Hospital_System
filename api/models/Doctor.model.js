import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      default: "Doctor",
    },
    phone: {
      type: String,
      required: true,
    },

    profile: {
      url: String,
      public_id: String,
    },

    specialization: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      default: 0,
    },

    consultationFees: {
      type: Number,
      default: 0,
    },

    bio: String,

    licenseNumber: String,

    location: String,

    languages: [String],

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
    workingHours: {
      morning: {
        start: { type: String, default: "10:00" },
        end: { type: String, default: "14:00" },
      },
      evening: {
        start: { type: String, default: "16:00" },
        end: { type: String, default: "19:00" },
      },
    },
    reviewId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true },
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
