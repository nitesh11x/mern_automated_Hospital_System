import express from "express";
import {
  bookAppointment,
  getAllAppointments,
  getAppointmentById,
} from "../controllers/appointment.controller.js";

import {
  isAdminAuth,
  isDoctorAuth,
  isPatientAuth
} from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/book", isPatientAuth, bookAppointment);

router.get("/all", isAdminAuth, getAllAppointments);
router.get("/:appointmentId", isPatientAuth, getAppointmentById);



export default router;