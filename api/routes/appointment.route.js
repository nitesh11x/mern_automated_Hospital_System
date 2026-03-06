import express from "express";
import {
  bookAppointment,
  bookAppointmentOfSpecificDoctor,
  generateAppointmentQR,
  getAllAppointments,
  getAppointmentById,
  getDoctorAppointments,
  getPatientAppointments,
  reScheduelAppointmentById,
  updateAppointmentPaymentStatus,
  updateAppointmentStatus
} from "../controllers/appointment.controller.js";

import {
  isAdminAuth,
  isDoctorAuth,
  isPatientAuth
} from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/book", isPatientAuth, bookAppointment);
router.post("/book/:doctorId", isPatientAuth, bookAppointmentOfSpecificDoctor);

router.get("/all", isAdminAuth, getAllAppointments);
router.get("/me", isPatientAuth, getPatientAppointments);
router.get("/doctor/appointments", isDoctorAuth, getDoctorAppointments);
router.get("/qr/:appointmentId", generateAppointmentQR);
router.get("/:appointmentId", isPatientAuth, getAppointmentById);

router.put("/status/:id", isAdminAuth, updateAppointmentStatus);
router.put("/status/payment/:id", isAdminAuth, updateAppointmentPaymentStatus);
router.put("/rescheduel/:appointmentId", isAdminAuth, reScheduelAppointmentById);

router.delete("/:appointmentId", isAdminAuth, getAppointmentById);

export default router;
