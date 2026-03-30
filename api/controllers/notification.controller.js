import nodemailer from "nodemailer";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.utils.js";
import { Appointment } from "../models/Appointment.model.js";
import cron from "node-cron";

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

const sendProcessingMail = async (email, name) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: `"NewCare Hospital" <${process.env.EMAIL}>`,
    to: email,
    subject: "Reviewing Your Request - NewCare",
    html: `
      <div style="font-family: Arial; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:10px;">
        <div style="background:#1a73e8; padding:20px; text-align:center;">
          <h2 style="color:white;">Reviewing Appointment</h2>
        </div>

        <div style="padding:30px;">
          <p>Hi ${name},</p>

          <p>Your appointment request is under review.</p>
          <p>We will send a confirmation shortly.</p>

          <p style="margin-top:20px;">Thanks for choosing NewCare ❤️</p>
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};
export const sendProcessingMailNotification = asyncHandler(
  async (req, res, next) => {
    const { email, name } = req.body;

    if (!email) {
      return next(new ErrorHandler("Email is required", 400));
    }

    await sendProcessingMail(email, name);

    res.status(200).json({
      success: true,
      message: "Processing mail sent",
    });
  },
);


const getTimes = (freq) => {
  if (freq == 1) return ["09:00"];
  if (freq == 2) return ["09:00", "21:00"];
  if (freq == 3) return ["09:00", "14:00", "21:00"];
};

export const scheduleSimpleReminder = (email, name, medicine) => {
  const freq = Number(medicine.frequencyOfDose);
  const times = getTimes(freq);

  times.forEach((time) => {
    const [hour, minute] = time.split(":");

    cron.schedule(`${minute} ${hour} * * *`, async () => {
      console.log("⏰ Sending reminder at", time);

      await sendTakeMedicineMail(email, name, medicine, time);
    });
  });
};