import express from "express";
import { sendAppointmentNotification, sendProcessingMailNotification } from "../controllers/notification.controller.js";
const router = express.Router();

router.post("/notify/:appointmentId",sendAppointmentNotification );
router.post("/processing/",sendProcessingMailNotification );

export default router;
