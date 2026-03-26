
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.utils.js";
import { Doctor } from "../models/Doctor.model.js";
import cloudinary from "cloudinary";
import bcrypt from "bcryptjs";

export const registerDoctor = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    specialization,
    experience,
    consultationFees,
    bio,
    licenseNumber,
    location,
    languages,
  } = req.body;

  if (!firstName || !lastName || !email || !password || !phone || !specialization) {
    return next(new ErrorHandler("All required fields must be provided", 400));
  }
  const isExist = await Doctor.findOne({ email });
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
  const hashedPassword = await bcrypt.hash(password, 10);
  const doctor = await Doctor.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone,
    specialization,
    experience,
    consultationFees,
    bio,
    licenseNumber,
    location,
    languages,
    profile: profileData,
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
  const doctor = await Doctor.findOne({ email }).select("+password");
  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }
  const isMatch = await bcrypt.compare(password, doctor.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }
  const doctorToken = jwt.sign(
    { id: doctor._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.cookie("doctorToken", doctorToken, {
    httpOnly: true,
    secure: true, // true in production (HTTPS)
    sameSite: "none", // use "lax" if not cross-origin
    maxAge: Number(process.env.MAX_AGE),
  });
  doctor.password = undefined;
  res.status(200).json({
    success: true,
    message: "Login successful",
    doctor,
    doctorToken,
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
  const doctorId = req.doctor._id
  const doctor = await Doctor.findOne({ doctorId })
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
  const doctor = await Doctor.findById(doctorId)
  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }
  res.status(200).json({
    success: true,
    doctor
  });
});

export const getAllDoctor = asyncHandler(async (req, res, next) => {
  const doctors = await Doctor.find()
  if (!doctors) return next(new ErrorHandler("doctor not found", 400))
  res.status(200).json({
    success: true,
    doctors
  });
});

export const updateDoctorProfile = asyncHandler(async (req, res, next) => {
  const doctorId = req.doctor.id; // active session ID
  const { workingHours, firstName, lastName, phone, specialization, experience, consultationFees, bio } = req.body;
  
  const updateData = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (phone) updateData.phone = phone;
  if (specialization) updateData.specialization = specialization;
  if (experience) updateData.experience = experience;
  if (consultationFees) updateData.consultationFees = consultationFees;
  if (bio) updateData.bio = bio;

  // Flatten nested workingHours properly without overwriting the entire schema blindly
  if (workingHours) {
    if (workingHours.morning) {
      if (workingHours.morning.start) updateData["workingHours.morning.start"] = workingHours.morning.start;
      if (workingHours.morning.end) updateData["workingHours.morning.end"] = workingHours.morning.end;
    }
    if (workingHours.evening) {
      if (workingHours.evening.start) updateData["workingHours.evening.start"] = workingHours.evening.start;
      if (workingHours.evening.end) updateData["workingHours.evening.end"] = workingHours.evening.end;
    }
  }

  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    doctor
  });
});

export const updateDoctorById = asyncHandler(async (req, res, next) => {
  const doctorId = req.params.id;

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

export const updateDoctor = asyncHandler(async (req, res, next) => {
  const doctorId = req.params.id;

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