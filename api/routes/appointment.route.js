import express from "express";
import {
  bookAppointment,
  bookAppointmentOfSpecificDoctor,
  getAllAppointments,
  getAppointmentById,
  getDoctorAppointments,
  getPatientAppointments,
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
router.get("/patient/me", isPatientAuth, getPatientAppointments);
router.get("/doctor/me", isDoctorAuth, getDoctorAppointments);

router.put("/status/:id", isDoctorAuth, updateAppointmentStatus);

router.get("/:appointmentId", isPatientAuth, getAppointmentById);

export default router;
