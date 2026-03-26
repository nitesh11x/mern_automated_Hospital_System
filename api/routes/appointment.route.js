import express from "express";
import {
  bookAppointment,
  bookAppointmentOfSpecificDoctor,
  deleteAppointmentById,
  generateAppointmentQR,
  getAllAppointments,
  getAppointmentById,
  getDoctorAppointments,
  getPatientAppointments,
  getPreviousAppointment,
  reScheduelAppointmentById,
  updateAppointmentPaymentStatus,
  updateAppointmentStatus,
  getDoctorSlots
} from "../controllers/appointment.controller.js";

import {
  isAdminAuth,
  isDoctorAuth,
  isPatientAuth
} from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/book", isPatientAuth, bookAppointment);
router.post("/book/:doctorId", isPatientAuth, bookAppointmentOfSpecificDoctor);

router.get("/:doctorId/slots", getDoctorSlots);

router.get("/all", isAdminAuth, getAllAppointments);
router.get("/me", isPatientAuth, getPatientAppointments);
router.get("/doctor/appointments", isDoctorAuth, getDoctorAppointments);
router.get("/qr/:appointmentId", generateAppointmentQR);
router.get("/previous", isPatientAuth, getPreviousAppointment);
router.get("/:appointmentId", isPatientAuth, getAppointmentById);


router.put("/status/:id", isAdminAuth, updateAppointmentStatus);
router.put("/status/payment/:id", isAdminAuth, updateAppointmentPaymentStatus);
router.put("/rescheduel/:appointmentId", isAdminAuth, reScheduelAppointmentById);

router.delete("/delete/:appointmentId", isAdminAuth, deleteAppointmentById);

export default router;
