import express from "express";
import { getAppointmentMessages, saveMessage } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/:appointmentId", getAppointmentMessages);
router.post("/send", saveMessage);

export default router;
