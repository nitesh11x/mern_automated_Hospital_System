import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Otp = mongoose.model("Otp", otpSchema);

const BypassOtpSchema = new mongoose.Schema(
  {
    isBypass: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const BypassOtp = mongoose.model("BypassOtp", BypassOtpSchema);
