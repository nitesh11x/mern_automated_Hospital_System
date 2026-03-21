import nodemailer from "nodemailer";

export const sendMail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    // Add TLS settings to prevent certificate blocking in production
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `"NewCare Support" <${process.env.EMAIL}>`,
    to: to,
    subject: "Email Verification - New Care",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #1a73e8; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">New Care Verification</h2>
        </div>
        <div style="padding: 30px; text-align: center;">
          <p style="font-size: 16px; color: #555;">Hello,</p>
          <p style="font-size: 16px; color: #555;">Your verification code is:</p>
          <div style="margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a73e8; background: #f1f3f4; padding: 15px 30px; border-radius: 8px;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 14px; color: #888;">This code is valid for 5 minutes. If you did not request this, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};
