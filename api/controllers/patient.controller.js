import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.utils.js";
import { Patient } from "../models/Patient.model.js";
import bcrypt from "bcryptjs";
import cloudinary from 'cloudinary'

export const registerPatient = asyncHandler(async (req, res, next) => {
  const {
    patientId,
    firstName,
    lastName,
    email,
    password,
    phone,
    dob,
    gender,
  } = req.body;

  if (!firstName || !lastName || !email || !password || !phone || !dob || !gender) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const isExist = await Patient.findOne({ email });
  if (isExist) {
    return next(new ErrorHandler("User already registered", 400));
  }

  let profileData = {};

  if (req.files?.profile) {
    const result = await cloudinary.v2.uploader.upload(
      req.files.profile.tempFilePath,
      { folder: "hospital_System/patient/profile" }
    );

    profileData = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  const patient = await Patient.create({
    patientId,
    firstName,
    lastName,
    email,
    password,
    phone,
    dob,
    gender,
    profileUrl: profileData,
  });

  // const token = jwt.sign(
  //   { id: patient._id, role: "Patient" },
  //   process.env.JWT_SECRET,
  //   { expiresIn: process.env.JWT_EXPIRES_IN }
  // );

  // res.cookie("patientToken", token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "strict",
  //   maxAge: 7 * 24 * 60 * 60 * 1000
  // });

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    patient

  });
});

export const loginPatientWithPassword = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Email and password required", 400));
  }

  const patient = await Patient.findOne({ email }).select("+password");

  if (!patient) {
    return next(new ErrorHandler("User not found", 404));
  }

  const isMatch = await patient.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }

  const token = jwt.sign(
    { id: patient._id, role: "Patient" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.cookie("patientToken", token, {
    httpOnly: true,
    secure:true,
    sameSite: "none",
    maxAge: process.env.MAX_AGE
  });

  const safePatient = await Patient.findById(patient._id).select("-password");

  return res.status(200).json({
    success: true,
    message: "Login successful",
    patient: safePatient,
    patientToken: token
  });
});

export const logoutPatient = asyncHandler(async (req, res) => {
  res.cookie("patientToken", "", {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});

export const patientProfile = asyncHandler(async (req, res, next) => {
  const patientId = req.patient.id;
  const patient = await Patient.findById(patientId).select("-password");
  if (!patient) {
    return next(new ErrorHandler("Invalid ID", 404));
  }
  res.status(200).json({
    message: "Patient found successfully",
    patient,
  });
});

export const getPatientById = asyncHandler(async (req, res, next) => {
  const patientId = req.params;
  const patient = await Patient.findById(patientId).select("-password");
  if (!patient) {
    return next(new ErrorHandler("Invalid ID", 404));
  }
  res.status(200).json({
    message: "Patient found successfully",
    patient,
  });
});

export const getAllPatient = asyncHandler(async (req, res, next) => {
  const patientId = req.params
  if (!patientId) return next(new ErrorHandler('patient id not found ', 400))
  const patient = await Patient.findById(patientId).select("-password")
  if (!patient) return next(new ErrorHandler("patient not found ", 404))
  res.status(200).json({ success: true, message: "all patients", patient })
})

export const deletePatientById = asyncHandler(async (req, res, next) => {
  const patientId = req.params
  if (!patientId) return next(new ErrorHandler('patient id not found ', 400))
  const patient = await Patient.findByIdAndDelete(patientId)
  if (!patient) return next(new ErrorHandler("patient not found ", 404))
  res.status(200).json({ success: true, message: "patient Deleted Successfully" })
})

export const updatePatientById = asyncHandler(async (req, res, next) => {

})
export const updatePatientStatusById = asyncHandler(async (req, res, next) => {

})

