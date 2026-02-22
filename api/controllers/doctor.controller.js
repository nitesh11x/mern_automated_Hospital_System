
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.utils.js";
import { Doctor } from "../models/Doctor.model.js";
import { Patient } from "../models/Patient.model.js";
import cloudinary from "cloudinary";


export const registerDoctor = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    specialization,
    experience,
    fees,
    bio
  } = req.body;

  if (!firstName || !lastName || !email || !password || !phone) {
    return next(new ErrorHandler("All required fields must be provided", 400));
  }

  const isExist = await Patient.findOne({ email });
  if (isExist) {
    return next(new ErrorHandler("Doctor already registered", 400));
  }

  let profileData = {};

  if (req.files?.profile) {
    const result = await cloudinary.v2.uploader.upload(
      req.files.profile.tempFilePath,
      { folder: "hospital_System/doctor/profile" }
    );

    profileData = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  // Create Patient (user)
  const patient = await Patient.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    role: "Doctor"
  });

  // Create Doctor Profile
  const doctor = await Doctor.create({
    user: patient._id,
    specialization,
    experience,
    fees,
    bio,
    profile: profileData
  });

  res.status(201).json({
    success: true,
    message: "Doctor registered successfully",
    doctor
  });
});


export const loginDoctor = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Email and password required", 400));
  }

  const doctorUser = await Patient.findOne({ email, role: "Doctor" }).select("+password");

  if (!doctorUser) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  const isMatch = await doctorUser.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }

  const token = jwt.sign(
    { id: doctorUser._id, role: "Doctor" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.cookie("doctorToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: process.env.MAX_AGE
  });

  const doctorProfile = await Doctor.findOne({ user: doctorUser._id })
    .populate("user", "-password");

  res.status(200).json({
    success: true,
    message: "Login successful",
    doctor: doctorProfile,
    doctorToken: token
  });
});


export const logoutDoctor = asyncHandler(async (req, res) => {
  res.cookie("doctorToken", "", {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});


export const doctorProfile = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findOne({ user: req.doctor.id })
    .populate("user", "-password");

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  res.status(200).json({
    success: true,
    doctor
  });
});


export const getDoctorById = asyncHandler(async (req, res, next) => {
  const doctorId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return next(new ErrorHandler("Invalid Doctor ID", 400));
  }

  const doctor = await Doctor.findById(doctorId)
    .populate("user", "-password");

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  res.status(200).json({
    success: true,
    doctor
  });
});


export const getAllDoctor = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find()
    .populate("user", "-password")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    doctors
  });
});


export const updateDoctorById = asyncHandler(async (req, res, next) => {
  const doctorId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return next(new ErrorHandler("Invalid Doctor ID", 400));
  }

  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    req.body,
    { new: true, runValidators: true }
  );

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Doctor updated successfully",
    doctor
  });
});


export const deleteDoctorById = asyncHandler(async (req, res, next) => {
  const doctorId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return next(new ErrorHandler("Invalid Doctor ID", 400));
  }

  const doctor = await Doctor.findByIdAndDelete(doctorId);

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Doctor deleted successfully"
  });
});