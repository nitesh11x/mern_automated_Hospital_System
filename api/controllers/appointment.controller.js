import mongoose from "mongoose";
import { Appointment } from "../models/Appointment.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.utils.js";
import QRCode from "qrcode";

export const bookAppointment = asyncHandler(async (req, res, next) => {
  const {
    doctorId,
    name,
    email,
    gender,
    relation,
    appointmentDate,
    requestedTimeSlot,
    paymentMode,
  } = req.body;

  const patientId = req.patient?.id;

  if (!patientId) {
    return next(new ErrorHandler("Unauthorized", 401));
  }

  if (
    !doctorId ||
    !name ||
    !email ||
    !gender ||
    !appointmentDate ||
    !requestedTimeSlot ||
    !paymentMode
  ) {
    return next(new ErrorHandler("All required fields must be provided", 400));
  }

  // 🔹 Validate doctorId format
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return next(new ErrorHandler("Invalid Doctor ID", 400));
  }

  // 🔹 Check previous appointment with same doctor
  const previousAppointment = await Appointment.findOne({
    patientId,
    doctorId,
  }).sort({ createdAt: -1 });

  try {
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      name,
      email,
      gender,
      relation,
      appointmentDate,
      requestedTimeSlot,
      paymentMode,
      isVisit: !!previousAppointment,
      previousAppointmentId: previousAppointment?.appointmentId || null,
    });

    res.status(201).json({
      success: true,
      message: "Appointment request sent. Waiting for approval.",
      appointment,
    });
  } catch (error) {
    return next(error);
  }
});

export const bookAppointmentOfSpecificDoctor = asyncHandler(
  async (req, res, next) => {
    const { doctorId } = req.params;
    const {
      name,
      email,
      gender,
      relation,
      appointmentDate,
      requestedTimeSlot,
      paymentMode,
    } = req.body;

    const patientId = req.patient?.id;

    if (!patientId) {
      return next(new ErrorHandler("Unauthorized", 401));
    }

    if (
      !name ||
      !email ||
      !gender ||
      !appointmentDate ||
      !requestedTimeSlot ||
      !paymentMode
    ) {
      return next(
        new ErrorHandler("All required fields must be provided", 400),
      );
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return next(new ErrorHandler("Invalid Doctor ID", 400));
    }

    const previousAppointment = await Appointment.findOne({
      patientId,
      doctorId,
    }).sort({ createdAt: -1 });

    try {
      const appointment = await Appointment.create({
        patientId,
        doctorId,
        name,
        email,
        gender,
        relation,
        appointmentDate,
        requestedTimeSlot,
        paymentMode,
        isVisit: !!previousAppointment,
        previousAppointmentId: previousAppointment?.appointmentId || null,
      });

      res.status(201).json({
        success: true,
        message: "Appointment request sent. Waiting for approval.",
        appointment,
      });
    } catch (error) {
      return next(error);
    }
  },
);

export const approveAppointment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { approvedTimeSlot } = req.body;

  const appointment = await Appointment.findById(id);
  if (!appointment) return next(new ErrorHandler("Appointment not found", 404));

  if (appointment.status !== "pending")
    return next(
      new ErrorHandler("Only pending appointments can be approved", 400),
    );

  appointment.status = "approved";
  appointment.approvedTimeSlot = approvedTimeSlot;
  appointment.approvedAt = new Date();

  await appointment.save();

  res.status(200).json({
    success: true,
    message: "Appointment approved successfully",
    appointment,
  });
});

export const cancelAppointmentById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id);
  if (!appointment) return next(new ErrorHandler("Appointment not found", 404));

  appointment.status = "cancelled";
  await appointment.save();

  res.status(200).json({
    success: true,
    message: "Appointment cancelled successfully",
  });
});

export const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find().sort({ createdAt: -1 });
  if (!appointments) next(new ErrorHandler("not found", 500));

  res.status(200).json({
    success: true,
    count: appointments.length,
    appointments,
  });
});

export const getAppointmentById = asyncHandler(async (req, res, next) => {
  const { appointmentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(appointmentId))
    return next(new ErrorHandler("Invalid ID", 400));

  const appointment = await Appointment.findById(appointmentId);
  // .populate("patientId")
  // .populate("doctorId")
  // .populate("prescriptionId");

  if (!appointment) return next(new ErrorHandler("Appointment not found", 404));

  res.status(200).json({ success: true, appointment });
});

export const getPatientAppointments = asyncHandler(async (req, res) => {
  const patientId = req.patient.id;

  const appointments = await Appointment.find({ patientId })
    // .populate("prescriptionId")
    .sort({ appointmentDate: -1 });

  res.status(200).json({
    success: true,
    count: appointments.length,
    appointments,
  });
});

export const getDoctorAppointments = asyncHandler(async (req, res) => {
  const doctorId = req.doctor.id;

  const appointments = await Appointment.find({ doctorId })
    .populate("patientId")
    .populate("prescriptionId")
    .sort({ appointmentDate: -1 });

  res.status(200).json({
    success: true,
    count: appointments.length,
    appointments,
  });
});

export const updateAppointmentStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body; // e.g., 'completed', 'cancelled', 'approved'

  const appointment = await Appointment.findById(id);
  if (!appointment) return next(new ErrorHandler("Appointment not found", 404));

  appointment.status = status;
  if (status === "completed") {
    appointment.completedAt = new Date();
  }

  await appointment.save();

  res.status(200).json({
    success: true,
    message: `Appointment status updated to ${status}`,
    appointment,
  });
});

export const updateAppointmentPaymentStatus = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const { paymentStatus } = req.body; // Use 'paymentStatus' to match your schema/frontend

    if (!paymentStatus) {
      return next(new ErrorHandler("Payment status is required", 400));
    }
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { paymentStatus: paymentStatus },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found", 404));
    }
    res.status(200).json({
      success: true,
      message: `Payment status updated to ${paymentStatus}`,
      appointment,
    });
  },
);

export const reScheduelAppointmentById = asyncHandler(
  async (req, res, next) => {
    const { appointmentId } = req.params;
    const { approvedTimeSlot, appointmentDate } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return next(new ErrorHandler("Appointment not found", 404));
    }

    appointment.approvedTimeSlot = approvedTimeSlot;
    appointment.appointmentDate = appointmentDate;

    await appointment.save();

    res.status(200).json({
      success: true,
      appointment,
      message: "Appointment rescheduled successfully",
    });
  },
);

export const deleteAppointmentById = asyncHandler(async (req, res, next) => {
  const { appointmentId } = req.params;
  const appointment = await Appointment.findByIdAndDelete(appointmentId);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Appointment deleted successfully",
  });
});

export const generateAppointmentQR = asyncHandler(async (req, res, next) => {
  const { appointmentId } = req.params;

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }

  const qrData = JSON.stringify({
    id: appointment.appointmentId,
    patient: appointment.name,
    date: appointment.appointmentDate,
    status: appointment.status,
    slot: appointment.approvedTimeSlot,
    isVisited: appointment.previousAppointmentId,
    payment: appointment.paymentStatus,
  });

  const qr = await QRCode.toDataURL(qrData);

  // Save QR code in database
  appointment.qrCode = qr;
  await appointment.save();

  res.status(200).json({
    success: true,
    qr,
  });
});

export const getPreviousAppointment = asyncHandler(async (req, res, next) => {
  // const { appointmentId } = req.params;
  const { email } = req.body;

  const prevAppointments = await Appointment.findOne({ email }).sort({ createdAt: -1 })
  if (!prevAppointments) return next(new ErrorHandler("not visited", 500));

    res.status(200).json({
    success: true,
    prevAppointments,
  });
});
