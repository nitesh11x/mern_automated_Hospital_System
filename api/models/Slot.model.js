import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
    slotId: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    left: {
        type: Number,
        default: 4
    }
}, { _id: false });