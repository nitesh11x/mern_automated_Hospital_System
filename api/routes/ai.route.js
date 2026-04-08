import express from "express";
import { analyzeSymptoms } from "../controllers/ai.controller.js";
import { isPatientAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/triage", analyzeSymptoms);

export default router;
