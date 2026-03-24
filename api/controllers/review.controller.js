import { Review } from "../models/Review.model.js";
import { Doctor } from "../models/Doctor.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.utils.js";

export const createReview = asyncHandler(async (req, res, next) => {
  const { doctorId, rating, message, mediaUrl, avatarUrl } = req.body;
  const patientId = req.patient.id;

  if (!doctorId || !rating) {
    return next(new ErrorHandler("Doctor and rating are required", 400));
  }
  const review = await Review.create({
    patientId: patientId,
    doctorId: doctorId,
    rating,
    message,
    mediaUrl,
    avatarUrl,
  });
  const reviews = await Review.find({ doctorId });
  const avgRating =
    reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await Doctor.findByIdAndUpdate(doctorId, {
    $set: {
      rating: avgRating,
      totalReviews: reviews.length,
    },
    $push: {
      reviewId: review._id,
    },
  });
  res.status(201).json({
    success: true,
    message: "Review added successfully",
    review,
  });
});

export const getDoctorReviews = asyncHandler(async (req, res, next) => {
  const { doctorId } = req.params;

  const reviews = await Review.find({ doctor: doctorId }).populate(
    "patient",
    "firstName lastName profileUrl",
  );

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

export const getAllReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find();
  if (!reviews) return next(new ErrorHandler("Reviews not found "), 400);
  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});
