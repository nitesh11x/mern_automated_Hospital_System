import { Review } from "../models/Review.model.js";
import { Doctor } from "../models/Doctor.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.utils.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const createReview = asyncHandler(async (req, res, next) => {
  const { doctorId, rating, message } = req.body;
  const patientId = req.patient.id;

  if (!doctorId || !rating) {
    return next(new ErrorHandler("Doctor and rating are required", 400));
  }

  let mediaUrl = "";
  let mediaType = "";

  if (req.files && req.files.media) {
    const file = req.files.media;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "video/mp4"];

    if (!allowedTypes.includes(file.mimetype)) {
      return next(
        new ErrorHandler("Only JPG, PNG images and MP4 videos allowed", 400),
      );
    }

    const isVideo = file.mimetype.startsWith("video");

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "hospital_System/reviews",
      resource_type: isVideo ? "video" : "image",
    });

    mediaUrl = result.secure_url;
    mediaType = isVideo ? "video" : "image";

    fs.unlinkSync(file.tempFilePath);
  }

  const review = await Review.create({
    patientId,
    doctorId,
    rating,
    message,
    mediaUrl,
    mediaType,
  });

  const reviews = await Review.find({ doctorId });

  const avgRating =
    reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

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
  const reviews = await Review.find().populate("patientId doctorId");
  if (!reviews) return next(new ErrorHandler("Reviews not found "), 400);
  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

export const deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findByIdAndDelete(id);
  if (!review) return next(new ErrorHandler("Review not found", 404));

  // Optionally remove review from doctor array if necessary:
  await Doctor.findByIdAndUpdate(review.doctorId, {
    $pull: { reviewId: id },
  });

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});
