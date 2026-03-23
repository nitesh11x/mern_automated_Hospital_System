import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    message: String,
    mediaUrl: String,
    avatarUrl: String,
    // message: String,
  },
  { timestamps: true },
);

export const Review = mongoose.model("Review", reviewSchema);
