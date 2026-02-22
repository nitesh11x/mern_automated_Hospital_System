import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.utils.js";
import { Admin } from "../models/Admin.model.js";
import cloudinary from "cloudinary";


export const registerAdmin = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, phone } = req.body;

  if (!firstName || !lastName || !email || !password || !phone) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const isExist = await Admin.findOne({ email });
  if (isExist) {
    return next(new ErrorHandler("Admin already exists", 400));
  }

  let profileData = {};

  if (req.files?.profile) {
    const result = await cloudinary.v2.uploader.upload(
      req.files.profile.tempFilePath,
      { folder: "hospital_System/admin/profile" }
    );

    profileData = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  const admin = await Admin.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    profile: profileData
  });

  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    admin
  });
});

export const loginAdmin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Email and password required", 400));
  }
  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin) {
    return next(new ErrorHandler("Admin not found", 404));
  }
  if (admin.status === "Suspended") {
    return next(new ErrorHandler("Admin account suspended", 403));
  }
  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }
  const token = jwt.sign(
    { id: admin._id, role: "Admin" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  res.cookie("adminToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: process.env.MAX_AGE
  });

  const safeAdmin = await Admin.findById(admin._id).select("-password");

  res.status(200).json({
    success: true,
    message: "Login successful",
    admin: safeAdmin,
    adminToken: token
  });
});

export const updateAdminById = asyncHandler(async (req, res, next) => {
  const adminId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    return next(new ErrorHandler("Invalid Admin ID", 400));
  }

  const admin = await Admin.findByIdAndUpdate(
    adminId,
    req.body,
    {
      returnDocument: "after",
      runValidators: true
    }
  ).select("-password");

  if (!admin) {
    return next(new ErrorHandler("Admin not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Admin updated successfully",
    admin
  });
});

export const deleteAdminById = asyncHandler(async (req, res, next) => {
  const adminId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    return next(new ErrorHandler("Invalid Admin ID", 400));
  }

  const admin = await Admin.findByIdAndDelete(adminId);

  if (!admin) {
    return next(new ErrorHandler("Admin not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Admin deleted successfully"
  });
});

export const getAllAdmin = asyncHandler(async (req, res, next) => {
  const { status } = req.query;
  let filter = {};
  if (status) {
    filter.status = status;
  }
  const admins = await Admin.find(filter)
    .select("-password")
    .sort({ createdAt: -1 });
  if (!admins || admins.length === 0) {
    return next(new ErrorHandler("No admins found", 404));
  }
  res.status(200).json({
    success: true,
    count: admins.length,
    admins
  });
});