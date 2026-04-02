import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    medicineName: {
      type: String,
      required: true,
    },
    avaliableStock: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
export const Medicine = mongoose.model("Medicine", medicineSchema);
