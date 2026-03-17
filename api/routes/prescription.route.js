import express from "express";
import {
    createPrescription,
    getPrescriptionById,
    getPatientPrescriptions
} from "../controllers/prescription.controller.js";
import { isDoctorAuth, isPatientAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", isDoctorAuth, createPrescription);
router.get("/patient/me", isPatientAuth, getPatientPrescriptions);
router.get("/:id", getPrescriptionById);

export default router;
