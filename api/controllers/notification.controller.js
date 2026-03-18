import nodemailer from "nodemailer";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.utils.js";
import { Appointment } from "../models/Appointment.model.js";

const sendAppointmentMail = async (appointment) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const { email, name, appointmentDate, approvedTimeSlot, qrCode, status } =
    appointment;

  if (!qrCode) {
    throw new Error("QR Code not generated");
  }

  const mailOptions = {
    from: `"NewCare Hospital" <${process.env.EMAIL}>`,
    to: email,
    subject: "Appointment Confirmed - NewCare",

    html: `
      <div style="font-family: Arial; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:10px;">
        
        <div style="background:#1a73e8; padding:20px; text-align:center;">
          <h2 style="color:white;">Appointment Confirmed</h2>
        </div>

        <div style="padding:30px;">
          <p>Hello <b>${name}</b>,</p>

          <p>Your appointment has been <b>${status}</b>.</p>

          <table style="width:100%; margin-top:20px; border-collapse:collapse;">
            <tr>
              <td style="padding:10px; border:1px solid #eee;"><b>Date</b></td>
              <td style="padding:10px; border:1px solid #eee;">${appointmentDate}</td>
            </tr>
            <tr>
              <td style="padding:10px; border:1px solid #eee;"><b>Time</b></td>
              <td style="padding:10px; border:1px solid #eee;">${approvedTimeSlot}</td>
            </tr>
          </table>

          <p style="margin-top:20px;">
            Please show this QR code at hospital reception:
          </p>

          <div style="text-align:center; margin-top:20px;">
            <img src="cid:qrimage" width="200"/>
          </div>

          <p style="margin-top:20px;">Thank you for choosing NewCare.</p>
        </div>
      </div>
    `,

    attachments: [
      {
        filename: "appointment-qr.png",
        path: qrCode,
        cid: "qrimage",
      },
    ],
  };

  return await transporter.sendMail(mailOptions);
};

export const sendAppointmentNotification = asyncHandler(
  async (req, res, next) => {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return next(new ErrorHandler("Appointment not found", 404));
    }

    // if (appointment.status !== "Approved") {
    //   return next(
    //     new ErrorHandler("Appointment must be approved first", 400),
    //   );
    // }

    if (!appointment.qrCode) {
      return next(
        new ErrorHandler("QR not generated. Generate QR first.", 400),
      );
    }

    await sendAppointmentMail(appointment);
    res.status(200).json({
      success: true,
      message: "Appointment confirmation email sent with QR",
    });
  },
);
