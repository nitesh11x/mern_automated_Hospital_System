import express from "express";
import {
  createReview,
  getAllReviews,
  getDoctorReviews,
} from "../controllers/review.controller.js";
import { isPatientAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/get", getAllReviews);

router.post("/post", isPatientAuth, createReview);

export default router;
