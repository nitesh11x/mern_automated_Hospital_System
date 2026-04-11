import express from "express";
import { analyzeSymptoms, generateDietSuggestion } from "../controllers/ai.controller.js";
import { isPatientAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/triage", analyzeSymptoms);
router.post("/diet-suggestion", generateDietSuggestion);

export default router;
