import mongoose from "mongoose";
import { Appointment } from "../models/Appointment.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.utils.js";
import QRCode from "qrcode";
import { Doctor } from "../models/Doctor.model.js";
import { Patient } from "../models/Patient.model.js";

export const bookAppointment = asyncHandler(async (req, res, next) => {
  const {
    doctorId,
    name,
    email,
    gender,
    relation,
    appointmentDate,
    requestedTimeSlot,
    slotId,
    paymentMode,
    previousAppointmentId,
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

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return next(new ErrorHandler("Invalid Doctor ID", 400));
  }

  try {
    let previousAppointment = null;

    if (
      previousAppointmentId &&
      mongoose.Types.ObjectId.isValid(previousAppointmentId)
    ) {
      previousAppointment = await Appointment.findOne({
        _id: previousAppointmentId,
        patientId,
      });
    }

    if (!previousAppointment) {
      previousAppointment = await Appointment.findOne({
        patientId,
        doctorId,
      }).sort({ createdAt: -1 });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      name,
      email,
      gender,
      relation,
      appointmentDate,
      requestedTimeSlot,
      slotId: slotId || requestedTimeSlot,
      paymentMode,
      isVisit: !!previousAppointment,
      previousAppointmentId: previousAppointment?._id || null,
    });

    await Patient.findByIdAndUpdate(patientId, {
      $addToSet: {
        appointmentIds: appointment._id,
        doctorIds: doctorId,
      },
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
      slotId,
      paymentMode,
      previousAppointmentId, // ✅ added
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
      return next(
        new ErrorHandler("All required fields must be provided", 400)
      );
    }

    // 🆔 Validate doctorId
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return next(new ErrorHandler("Invalid Doctor ID", 400));
    }

    try {
      let previousAppointment = null;

      if (
        previousAppointmentId &&
        mongoose.Types.ObjectId.isValid(previousAppointmentId)
      ) {
        previousAppointment = await Appointment.findOne({
          _id: previousAppointmentId,
          patientId,
        });
      }

      if (!previousAppointment) {
        previousAppointment = await Appointment.findOne({
          patientId,
          doctorId,
        }).sort({ createdAt: -1 });
      }

      const appointment = await Appointment.create({
        patientId,
        doctorId,
        name,
        email,
        gender,
        relation,
        appointmentDate,
        requestedTimeSlot,
        slotId: slotId || requestedTimeSlot,
        paymentMode,
        isVisit: !!previousAppointment,
        previousAppointmentId: previousAppointment?._id || null, 
      });

      await Patient.findByIdAndUpdate(patientId, {
        $addToSet: {
          appointmentIds: appointment._id,
          doctorIds: doctorId,
        },
      });

      res.status(201).json({
        success: true,
        message: "Appointment request sent. Waiting for approval.",
        appointment,
      });
    } catch (error) {
      return next(error);
    }
  }
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
  const { appointmentId } = req.params;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) return next(new ErrorHandler("Appointment not found", 404));
  appointment.status = "Cancelled";
  appointment.slotId = " ";
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
  const { email } = req.query; // ✅ FIXED (use query,
  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }
  const prevAppointments = await Appointment.find({ email }).sort({
    createdAt: -1,
  });
  if (!prevAppointments.length) {
    return res.status(200).json({
      success: true,
      message: "No previous appointments found",
      prevAppointments: [],
    });
  }

  res.status(200).json({
    success: true,
    prevAppointments,
  });
});

export const getDoctorSlots = asyncHandler(async (req, res, next) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  if (!doctorId || !date) {
    return next(new ErrorHandler("Doctor ID and date are required", 400));
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const appointments = await Appointment.find({
    doctorId,
    appointmentDate: { $gte: startOfDay, $lte: endOfDay },
    status: { $ne: "Cancelled" }, // Ignore cancelled ones
  });

  const bookedSlots = appointments.map((app) => app.requestedTimeSlot);

  const generateSlots = (startStr, endStr) => {
    if (!startStr || !endStr) return [];

    const parseTime = (timeStr) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    const formatTime = (minutes) => {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      const ampm = h >= 12 ? "PM" : "AM";
      const hours12 = h % 12 || 12;
      return `${hours12}:${m.toString().padStart(2, "0")} ${ampm}`;
    };

    const start = parseTime(startStr);
    const end = parseTime(endStr);

    const interval = 6;

    const slots = [];
    let current = start;
    let index = 1;

    while (current < end) {
      const timeString = formatTime(current);
      slots.push({
        slotId: `S${index.toString().padStart(2, "0")}`,
        time: timeString,
        isBooked: bookedSlots.includes(timeString),
        left: bookedSlots.includes(timeString) ? 0 : 1,
      });
      current += interval;
      index++;
    }
    return slots;
  };

  const morningSlots = generateSlots(
    doctor.workingHours?.morning?.start || "10:00",
    doctor.workingHours?.morning?.end || "14:00",
  );
  const eveningSlots = generateSlots(
    doctor.workingHours?.evening?.start || "16:00",
    doctor.workingHours?.evening?.end || "19:00",
  );

  const formatAMPM = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hours12 = h % 12 || 12;
    return `${hours12}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  const availableSlots = {};
  if (morningSlots.length > 0) {
    availableSlots["A"] = {
      name: `Morning Block (${formatAMPM(doctor.workingHours?.morning?.start || "10:00")} - ${formatAMPM(doctor.workingHours?.morning?.end || "14:00")})`,
      slots: morningSlots.map((s, i) => ({
        ...s,
        slotId: `A${(i + 1).toString().padStart(2, "0")}`,
      })),
    };
  }
  if (eveningSlots.length > 0) {
    availableSlots["B"] = {
      name: `Evening Block (${formatAMPM(doctor.workingHours?.evening?.start || "16:00")} - ${formatAMPM(doctor.workingHours?.evening?.end || "19:00")})`,
      slots: eveningSlots.map((s, i) => ({
        ...s,
        slotId: `B${(i + 1).toString().padStart(2, "0")}`,
      })),
    };
  }

  res.status(200).json({
    success: true,
    availableSlots,
  });
});
