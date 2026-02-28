import { Prescription } from "../models/Prescription.model.js";
import { Appointment } from "../models/Appointment.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.utils.js";


// ===============================
// 🔹 CREATE PRESCRIPTION (Doctor)
// ===============================
export const createPrescription = asyncHandler(async (req, res, next) => {
    const { appointmentId, diagnosis, medicines, advice } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
        return next(new ErrorHandler("Appointment not found", 404));

    if (appointment.status !== "approved")
        return next(new ErrorHandler("Appointment not approved", 400));

    const prescription = await Prescription.create({
        appointmentId,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        diagnosis,
        medicines,
        advice
    });

    appointment.prescriptionId = prescription._id;
    appointment.status = "completed";
    appointment.completedAt = new Date();

    await appointment.save();

    res.status(201).json({
        success: true,
        message: "Prescription created and appointment completed",
        prescription
    });
});


// ===============================
// 🔹 GET PRESCRIPTION BY ID
// ===============================
export const getPrescriptionById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const prescription = await Prescription.findById(id)
        .populate("patientId")
        .populate("doctorId");

    if (!prescription)
        return next(new ErrorHandler("Prescription not found", 404));

    res.status(200).json({
        success: true,
        prescription
    });
});