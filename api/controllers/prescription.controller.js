import { Prescription } from "../models/Prescription.model.js";
import { Appointment } from "../models/Appointment.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.utils.js";
import cron from "node-cron";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const DEBUG_MODE = process.env.DEBUG_MODE === "true";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

const sendTakeMedicineMail = async (email, name, medicine, time) => {
  if (!email) {
    throw new Error("Patient email not found");
  }

  console.log(`📧 Attempting to send email to: ${email}`);

  return await transporter.sendMail({
    from: `"NewCare Hospital" <${EMAIL}>`,
    to: email,
    subject: "Medicine Reminder 💊",
    html: `
            <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:10px; overflow:hidden;">
                <div style="background:#28a745; padding:20px; text-align:center;">
                    <h2 style="color:white; margin:0;">Medicine Reminder</h2>
                </div>

                <div style="padding:30px;">
                    <p>Hello <b>${name || "Patient"}</b>,</p>
                    <p>This is your reminder to take your medicine.</p>

                    <table style="width:100%; margin-top:20px; border-collapse:collapse;">
                           <tr>
                            <td style="padding:10px; border:1px solid #eee;"><b>Medicine</b></td>
                            <td style="padding:10px; border:1px solid #eee;">${medicine.name}</td>
                           </tr>
                           <tr>
                            <td style="padding:10px; border:1px solid #eee;"><b>Dosage</b></td>
                            <td style="padding:10px; border:1px solid #eee;">${medicine.dosage}</td>
                           </tr>
                           <tr>
                            <td style="padding:10px; border:1px solid #eee;"><b>Time</b></td>
                            <td style="padding:10px; border:1px solid #eee;">${time}</td>
                           </tr>
                     </table>

                    <p style="margin-top:20px;">Please take it on time for better recovery.</p>
                    <p style="margin-top:20px;">Get well soon ❤️</p>
                </div>
            </div>
        `,
  });
};

// Get the scheduled time slots based on frequency
const getTimeSlots = (freq) => {
  const frequency = Number(freq);

  if (frequency === 1) return ["09:00"];
  if (frequency === 2) return ["09:00", "21:00"];
  if (frequency === 3) return ["09:00", "14:00", "21:00"];

  return ["09:00"];
};

// Check if reminder has already been sent for this time slot today
const hasReminderBeenSentToday = (medicine, timeSlot, currentDate) => {
  if (!medicine.remindersSent) {
    return false;
  }

  const today = new Date(currentDate);
  today.setHours(0, 0, 0, 0);

  const alreadySent = medicine.remindersSent.some((reminder) => {
    const reminderDate = new Date(reminder.date);
    reminderDate.setHours(0, 0, 0, 0);

    return (
      reminderDate.getTime() === today.getTime() &&
      reminder.timeSlot === timeSlot
    );
  });

  return alreadySent;
};

// Mark reminder as sent
const markReminderSent = async (prescriptionId, medicineId, timeSlot) => {
  try {
    const result = await Prescription.updateOne(
      {
        _id: prescriptionId,
        "medicines._id": medicineId,
      },
      {
        $push: {
          "medicines.$.remindersSent": {
            date: new Date(),
            timeSlot: timeSlot,
          },
        },
      },
    );

    return result.modifiedCount > 0;
  } catch (error) {
    console.error(`❌ Failed to mark reminder as sent:`, error.message);
    return false;
  }
};

// Check if reminder is still within duration
const isWithinDuration = (medicine, prescriptionDate) => {
  const duration = Number(medicine.duration) || 1;
  const endDate = new Date(prescriptionDate);
  endDate.setDate(endDate.getDate() + duration);
  endDate.setHours(23, 59, 59, 999);

  const now = new Date();
  return now <= endDate;
};

// Main scheduler function
export const startMedicineScheduler = () => {
  console.log("🟢 Medicine Scheduler Started");

  cron.schedule("*/1 * * * *", async () => {
    try {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const prescriptions = await Prescription.find()
        .populate("patientId", "name email")
        .lean();

      let remindersSent = 0;

      for (const prescription of prescriptions) {
        const email = prescription.patientId?.email;
        const name = prescription.patientId?.name || "Patient";

        if (!email) continue;

        for (const medicine of prescription.medicines) {
          const freq = Number(medicine.frequencyOfDose);
          const timeSlots = getTimeSlots(freq);

          if (!isWithinDuration(medicine, prescription.createdAt)) continue;

          for (const timeSlot of timeSlots) {
            const [slotHour, slotMinute] = timeSlot.split(":").map(Number);
            const alreadySentToday = hasReminderBeenSentToday(
              medicine,
              timeSlot,
              now,
            );

            if (alreadySentToday) continue;

            let shouldSend = false;
            if (DEBUG_MODE) {
              shouldSend = true;
            } else {
              if (currentHour === slotHour && currentMinute === 0) {
                shouldSend = true;
              }
            }

            if (shouldSend) {
              try {
                await sendTakeMedicineMail(email, name, medicine, timeSlot);
                await markReminderSent(
                  prescription._id,
                  medicine._id,
                  timeSlot,
                );
                remindersSent++;
              } catch (error) {
                console.error(`❌ Failed to send reminder:`, error.message);
              }
            }
          }
        }
      }

      if (remindersSent > 0) {
        console.log(`\n✅ Sent ${remindersSent} new medicine reminders`);
      }
    } catch (error) {
      console.error("❌ Medicine scheduler error:", error);
    }
  });
};

// Create prescription - FIXED VERSION for cookie-based auth
export const createPrescription = asyncHandler(async (req, res, next) => {
  try {
    const { appointmentId, diagnosis, medicines, advice } = req.body;

    // Check if doctor exists in request (from cookie-based auth middleware)
    if (!req.doctor) {
      console.error(
        "Doctor not found in request. Auth middleware may not be running.",
      );
      return next(
        new ErrorHandler(
          "Authentication required. Please login as doctor.",
          401,
        ),
      );
    }

    // Get doctor ID from the decoded token
    const docId = req.doctor.id;

    if (!docId) {
      console.error("Doctor ID not found in request:", req.doctor);
      return next(
        new ErrorHandler(
          "Doctor ID not found. Please check authentication.",
          401,
        ),
      );
    }

    console.log("Creating prescription with:", {
      appointmentId,
      diagnosis,
      medicines,
      advice,
      docId,
    });

    if (!appointmentId) {
      return next(new ErrorHandler("Appointment ID is required", 400));
    }

    if (!Array.isArray(medicines) || medicines.length === 0) {
      return next(new ErrorHandler("Medicines are required", 400));
    }

    // Validate each medicine has required fields
    for (let i = 0; i < medicines.length; i++) {
      const med = medicines[i];
      if (!med.name || !med.dosage || !med.duration) {
        return next(
          new ErrorHandler(
            `Medicine ${i + 1}: Name, dosage, and duration are required`,
            400,
          ),
        );
      }
    }

    const appointment = await Appointment.findById(appointmentId).populate(
      "patientId",
      "name email",
    );

    if (!appointment) {
      return next(new ErrorHandler("Appointment not found", 404));
    }

    if (!appointment.patientId) {
      return next(
        new ErrorHandler("Patient not found for this appointment", 404),
      );
    }

    if (
      appointment.status !== "Completed" &&
      appointment.status !== "Approved"
    ) {
      return next(
        new ErrorHandler(
          "Appointment must be approved or completed to create prescription",
          400,
        ),
      );
    }

    // Initialize medicines with empty remindersSent array
    const medicinesWithTracking = medicines.map((med) => ({
      name: med.name,
      dosage: med.dosage,
      duration: med.duration,
      frequencyOfDose: med.frequencyOfDose || "2",
      remindersSent: [],
    }));

    // Create prescription
    const prescription = await Prescription.create({
      appointmentId,
      patientId: appointment.patientId._id,
      doctorId: docId,
      diagnosis,
      medicines: medicinesWithTracking,
      advice,
    });

    // Update appointment
    appointment.prescriptionId = prescription._id;
    appointment.status = "Completed";
    appointment.completedAt = new Date();
    await appointment.save();

    console.log(`\n✅ Prescription created successfully!`);
    console.log(`👤 Patient: ${appointment.patientId.email}`);
    console.log(`💊 Medicines: ${medicines.map((m) => m.name).join(", ")}`);

    res.status(201).json({
      success: true,
      message:
        "Prescription created successfully. Medicine reminders will be sent as scheduled.",
      prescription,
    });
  } catch (error) {
    console.error("Error in createPrescription:", error);
    return next(
      new ErrorHandler(error.message || "Failed to create prescription", 500),
    );
  }
});

export const getReminderStatus = asyncHandler(async (req, res, next) => {
  const { prescriptionId } = req.params;

  const prescription = await Prescription.findById(prescriptionId).populate(
    "patientId",
    "name email",
  );

  if (!prescription) {
    return next(new ErrorHandler("Prescription not found", 404));
  }

  const status = prescription.medicines.map((medicine) => ({
    name: medicine.name,
    dosage: medicine.dosage,
    frequency: medicine.frequencyOfDose,
    duration: medicine.duration,
    remindersSent: medicine.remindersSent
      ? medicine.remindersSent.map((r) => ({
          timeSlot: r.timeSlot,
          date: r.date,
        }))
      : [],
  }));

  res.status(200).json({
    success: true,
    patient: prescription.patientId,
    medicines: status,
  });
});

export const getPrescriptionById = asyncHandler(async (req, res, next) => {
  const { appointmentId } = req.params;
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }

  const prescriptionId = appointment.prescriptionId;

  if (!prescriptionId) {
    return next(
      new ErrorHandler("Prescription not found for this appointment", 404),
    );
  }

  const prescription = await Prescription.findById(prescriptionId);

  if (!prescription) {
    return next(new ErrorHandler("Prescription not found", 404));
  }

  res.status(200).json({
    success: true,
    prescription,
    prescriptionId,
  });
});

export const getPatientPrescriptions = asyncHandler(async (req, res, next) => {
  const patientId = req.patient?.id;

  if (!patientId) {
    return next(new ErrorHandler("Patient not authenticated", 401));
  }

  const prescriptions = await Prescription.find({ patientId })
    .populate("doctorId", "firstName lastName profile")
    .populate("appointmentId", "appointmentDate")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: prescriptions.length,
    prescriptions,
  });
});

export const getDoctorPrescriptions = asyncHandler(async (req, res, next) => {
  const doctorId = req.doctor?.id;

  if (!doctorId) {
    return next(new ErrorHandler("Doctor not authenticated", 401));
  }

  const prescriptions = await Prescription.find({ doctorId })
    .populate("patientId", "name email profile")
    .populate("appointmentId", "appointmentDate")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: prescriptions.length,
    prescriptions,
  });
});
