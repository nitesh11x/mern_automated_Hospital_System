import express from "express";
import { 
  createEmergencyRequest, 
  getAllEmergencies, 
  updateEmergencyStatus 
} from "../controllers/emergency.controller.js";

const router = express.Router();

router.post("/request", createEmergencyRequest);
router.get("/all", getAllEmergencies);
router.patch("/status/:id", updateEmergencyStatus);

export default router;
