import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
       
    },
    { timestamps: true }
);

export const Report = mongoose.model("Report", reportSchema);

