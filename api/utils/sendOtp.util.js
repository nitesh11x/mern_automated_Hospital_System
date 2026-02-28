import nodemailer from "nodemailer";

export const sendMail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  return await transporter.sendMail({
    from: `"NewCare Support" <${process.env.EMAIL}>`,
    to,
    subject: "Email Verification - New Care",
    html: `<h2>Your OTP is ${otp}</h2>`,
  });
};