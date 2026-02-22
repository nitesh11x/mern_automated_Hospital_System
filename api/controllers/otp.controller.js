import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.utils.js";
import { generateOtp } from "../utils/generateOtp.util.js";
import { sendMail } from "../utils/sendOtp.util.js";
import { Otp } from "../models/Otp.model.js";

export const sendOtp = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorHandler("Email is required", 400));
    }

    const otp = generateOtp();

    // delete old OTP
    await Otp.deleteMany({ email });

    await Otp.create({
        email,
        otp, // store plain OTP
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    await sendMail(email, otp);

    res.status(200).json({
        success: true,
        message: "OTP sent successfully",
    });
});

export const verifyOtp = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(new ErrorHandler("Email and OTP required", 400));
    }

    const existingOtp = await Otp.findOne({ email });

    if (!existingOtp) {
        return next(new ErrorHandler("OTP not found", 400));
    }

    if (existingOtp.expiresAt < Date.now()) {
        await Otp.deleteOne({ email });
        return next(new ErrorHandler("OTP expired", 400));
    }

    if (existingOtp.otp !== otp) {
        existingOtp.attempts += 1;
        await existingOtp.save();

        if (existingOtp.attempts >= 5) {
            await Otp.deleteOne({ email });
            return next(new ErrorHandler("Too many attempts. Try again.", 400));
        }

        return next(new ErrorHandler("Invalid OTP", 400));
    }

    await Otp.deleteOne({ email });

    const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.status(200).json({
        success: true,
        message: "Successfully verified",
        token,
    });
});