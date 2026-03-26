import express from "express";
import {
  createReview,
  getAllReviews,
  getDoctorReviews,
  deleteReview
} from "../controllers/review.controller.js";
import { isPatientAuth, isAdminAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/get", getAllReviews);

router.post("/post", isPatientAuth, createReview);

router.delete("/delete/:id", isAdminAuth, deleteReview);

export default router;
