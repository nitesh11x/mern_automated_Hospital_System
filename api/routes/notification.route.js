import express from "express";
import { sendAppointmentNotification } from "../controllers/notification.controller.js";
const router = express.Router();

router.post("/notify/:appointmentId",sendAppointmentNotification );

export default router;
