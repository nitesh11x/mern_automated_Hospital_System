import { Message } from "../models/Message.model.js";
import { Appointment } from "../models/Appointment.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.utils.js";

// Fetch chat history for a specific appointment
export const getAppointmentMessages = asyncHandler(async (req, res, next) => {
  const { appointmentId } = req.params;

  // Validate appointment exists
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) return next(new ErrorHandler("Appointment not found", 404));

  // Check 5 day window logic just to be safe
  if (appointment.status === "Completed") {
    const completedDate = new Date(appointment.completedAt || appointment.updatedAt).getTime();
    const now = Date.now();
    const diffDays = (now - completedDate) / (1000 * 60 * 60 * 24);
    if (diffDays > 5) {
      return next(new ErrorHandler("Telemedicine window (5 days) has expired for this appointment.", 403));
    }
  }

  const messages = await Message.find({ appointmentId }).sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    messages,
  });
});

// Save a new message via REST (fallback or standard usage alongside socket)
export const saveMessage = asyncHandler(async (req, res, next) => {
  const { appointmentId, content, senderId, senderName, senderType } = req.body;

  if (!appointmentId || !content || !senderId || !senderName || !senderType) {
    return next(new ErrorHandler("All fields are required to save message", 400));
  }

  const message = await Message.create({
    appointmentId,
    content,
    senderId,
    senderName,
    senderType
  });

  res.status(201).json({
    success: true,
    message,
  });
});
