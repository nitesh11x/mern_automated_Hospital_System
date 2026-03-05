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
  getPatientId,
} from "../controllers/patient.controller.js";
import {
  isAdminAuth,
  isDoctorAuth,
  isPatientAuth,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerPatient);
router.post("/login", loginPatientWithPassword);
router.post("/logout", isPatientAuth, logoutPatient);

router.get("/me", isPatientAuth, patientProfile);
router.get("/all", isAdminAuth, getAllPatient);
router.get("/getPatientId", getPatientId);
router.get("/:patientId", isPatientAuth, getPatientById);

router.put("/:id", updatePatientById);
router.put("/status/:id", isAdminAuth, updatePatientStatusById);

router.delete("/:patientId", isAdminAuth, deletePatientById);
export default router;
