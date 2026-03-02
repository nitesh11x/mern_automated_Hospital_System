import express from 'express';
import { createReview, getDoctorReviews } from '../controllers/review.controller.js';
import { isPatientAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', isPatientAuth, createReview);
router.get('/doctor/:doctorId', getDoctorReviews);

export default router;