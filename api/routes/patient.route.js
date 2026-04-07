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
  updatePatientProfile,
  changePatientPassword
} from "../controllers/patient.controller.js";
import {
  isAdminAuth,
  isDoctorAuth,
  isPatientAuth,
} from "../middlewares/auth.middleware.js";
import { getPreviousAppointment } from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/register", registerPatient);
router.post("/login", loginPatientWithPassword);
router.post("/logout", isPatientAuth, logoutPatient);

router.get("/me", isPatientAuth, patientProfile);
router.put("/me/update", isPatientAuth, updatePatientProfile);
router.put("/me/password", isPatientAuth, changePatientPassword);
router.get("/all", isAdminAuth, getAllPatient);
router.get("/getPatientId", getPatientId);
router.get("/:patientId",  getPatientById);
router.get("/previous/",  getPreviousAppointment);


router.put("/:id", isAdminAuth, updatePatientById);
router.put("/status/:id", isAdminAuth, updatePatientStatusById);

router.delete("/:patientId", isAdminAuth, deletePatientById);
export default router;
