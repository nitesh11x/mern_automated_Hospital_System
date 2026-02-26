import express from "express";
import {
  registerPatient,
  loginPatientWithPassword,
  logoutPatient,
  getPatientById,
  getAllPatient,
  patientProfile,
  deletePatientById,
  updatePatientById,
  updatePatientStatusById,
} from "../controllers/patient.controller.js";
import { isAdminAuth, isDoctorAuth, isPatientAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerPatient);
router.post("/login", loginPatientWithPassword);
router.post("/logout", logoutPatient);

router.get("/me", isPatientAuth, patientProfile);
router.get("/all", getAllPatient);
router.get("/:patientId", getPatientById);

router.put('/:id', updatePatientById)
router.put('/status/:id', updatePatientStatusById)

router.delete("/:patientId", deletePatientById);
export default router;