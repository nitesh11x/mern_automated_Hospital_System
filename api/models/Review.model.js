import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient"
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor"
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String
    },
    { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);

