import express from "express";
import {
  bypassOtpFlagChanger,
  getBypassOtpFlag,
  sendOtp,
  verifyOtp,
} from "../controllers/otp.controller.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/change-flag", bypassOtpFlagChanger);

router.get("/get-flag", getBypassOtpFlag);

export default router;
