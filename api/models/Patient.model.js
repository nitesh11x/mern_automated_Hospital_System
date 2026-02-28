import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const patientSchema = new mongoose.Schema(
    {
        patientId: {
            type: String,
            unique: true
        },

        profileUrl: {
            url: String,
            public_id: String
        },
        role: {
            type: String,
            default: "Patient"
        },
        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false
        },

        phone: {
            type: String,
            required: true,
            match: [/^\d{10}$/, "Phone must be 10 digits"]
        },

        dob: {
            type: Date,
            required: true
        },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true
        },

        about: {
            type: String,
            default: ""
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        isBlocked: {
            type: Boolean,
            default: false
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);
patientSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
});

patientSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const Patient = mongoose.model("Patient", patientSchema);
