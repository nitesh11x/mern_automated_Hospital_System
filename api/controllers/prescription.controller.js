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

if (!EMAIL || !PASSWORD) {
    console.warn(
        "⚠️ EMAIL or PASSWORD is missing in .env. Medicine reminder mail will fail until credentials are set.",
    );
}

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
    // If medicine doesn't have remindersSent array (old data), return false
    if (!medicine.remindersSent) {
        return false;
    }
    
    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);
    
    // Check if we've already sent a reminder for this medicine on this day for this time slot
    const alreadySent = medicine.remindersSent.some(reminder => {
        const reminderDate = new Date(reminder.date);
        reminderDate.setHours(0, 0, 0, 0);
        
        return reminderDate.getTime() === today.getTime() && 
               reminder.timeSlot === timeSlot;
    });
    
    return alreadySent;
};

// Mark reminder as sent
const markReminderSent = async (prescriptionId, medicineId, timeSlot) => {
    try {
        console.log(`📝 Marking reminder as sent for medicine ${medicineId}, time slot ${timeSlot}`);
        
        const result = await Prescription.updateOne(
            { 
                _id: prescriptionId,
                "medicines._id": medicineId
            },
            {
                $push: {
                    "medicines.$.remindersSent": {
                        date: new Date(),
                        timeSlot: timeSlot
                    }
                }
            }
        );
        
        if (result.modifiedCount > 0) {
            // console.log(`✅ Marked reminder as sent for time slot ${timeSlot}`);
            return true;
        } else {
            // console.log(`⚠️ Failed to mark reminder - no document modified`);
            return false;
        }
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
    const isValid = now <= endDate;
    
    if (!isValid) {
        // console.log(`   Duration expired: ${medicine.name} (ends on ${endDate.toLocaleDateString()})`);
    }
    
    return isValid;
};

// Main scheduler function
export const startMedicineScheduler = () => {
    console.log("🟢 Medicine Scheduler Started");
    // console.log(`🔧 Mode: ${DEBUG_MODE ? "DEBUG (sends every minute for testing)" : "PRODUCTION (sends at scheduled times)"}`);
    // console.log("⏰ Checking for reminders every minute...");

    cron.schedule("0 */4 * * *", async () => {
        try {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            // console.log(`\n⏰ Checking reminders at ${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}...`);

            // Get all prescriptions with populated patient data
            const prescriptions = await Prescription.find()
                .populate("patientId", "name email")
                .lean();

            // console.log(`📋 Found ${prescriptions.length} prescriptions in database`);

            let remindersSent = 0;
            let remindersSkipped = 0;

            for (const prescription of prescriptions) {
                const email = prescription.patientId?.email;
                const name = prescription.patientId?.name || "Patient";

                if (!email) {
                    // console.log(`⚠️ No email found for prescription ${prescription._id}`);
                    continue;
                }

                // Process each medicine
                for (const medicine of prescription.medicines) {
                    const freq = Number(medicine.frequencyOfDose);
                    const timeSlots = getTimeSlots(freq);
                    
                    // console.log(`💊 Checking: ${medicine.name} (freq: ${freq}, duration: ${medicine.duration} days)`);
                    
                    // Check if reminder is still within duration
                    const withinDuration = isWithinDuration(medicine, prescription.createdAt);
                    
                    if (!withinDuration) {
                        // console.log(`   ⏭️ Duration expired for ${medicine.name}`);
                        continue;
                    }
                    
                    // For each time slot, check if we should send now
                    for (const timeSlot of timeSlots) {
                        const [slotHour, slotMinute] = timeSlot.split(":").map(Number);
                        
                        // Check if reminder already sent today for this time slot
                        const alreadySentToday = hasReminderBeenSentToday(medicine, timeSlot, now);
                        
                        if (alreadySentToday) {
                            // console.log(`   ⏭️ Already sent reminder for ${medicine.name} at ${timeSlot} today`);
                            remindersSkipped++;
                            continue;
                        }
                        
                        // Determine if current time matches the time slot
                        let shouldSend = false;
                        
                        if (DEBUG_MODE) {
                            // In DEBUG mode, we can send for any time slot, but only once per day
                            shouldSend = true;
                            // console.log(`   🔍 DEBUG: Sending for ${timeSlot} (not sent today yet)`);
                        } else {
                            // In production, only send at exact time
                            if (currentHour === slotHour && currentMinute === 0) {
                                shouldSend = true;
                                // console.log(`   ⏰ Production: Time matches ${timeSlot}`);
                            }
                        }
                        
                        if (shouldSend) {
                            // console.log(`📩 Sending reminder to: ${email} for ${medicine.name} at ${timeSlot}`);
                            
                            try {
                                await sendTakeMedicineMail(email, name, medicine, timeSlot);
                                const marked = await markReminderSent(prescription._id, medicine._id, timeSlot);
                                if (marked) {
                                    remindersSent++;
                                    // console.log(`✅ Email sent successfully for ${timeSlot}`);
                                }
                            } catch (error) {
                                console.error(`❌ Failed to send reminder:`, error.message);
                            }
                        }
                    }
                }
            }

            if (remindersSent > 0) {
                // console.log(`\n✅ Sent ${remindersSent} new medicine reminders`);
            }
            if (remindersSkipped > 0) {
                // console.log(`⏭️ Skipped ${remindersSkipped} reminders (already sent today)`);
            }
            if (remindersSent === 0 && remindersSkipped === 0) {
                // console.log(`📭 No reminders to send this minute`);
            }
        } catch (error) {
            console.error("❌ Medicine scheduler error:", error);
            console.error(error.stack);
        }
    });
};

// Create prescription
export const createPrescription = asyncHandler(async (req, res, next) => {
    const { appointmentId, diagnosis, medicines, advice } = req.body;
    const docId = req.doctor.id;

    if (!appointmentId) {
        return next(new ErrorHandler("Appointment ID is required", 400));
    }

    if (!Array.isArray(medicines) || medicines.length === 0) {
        return next(new ErrorHandler("Medicines are required", 400));
    }

    const appointment = await Appointment.findById(appointmentId).populate(
        "patientId",
        "name email",
    );

    if (!appointment) {
        return next(new ErrorHandler("Appointment not found", 404));
    }

    if (appointment.status !== "Completed") {
        return next(new ErrorHandler("Appointment not approved", 400));
    }

    // Initialize medicines with empty remindersSent array
    const medicinesWithTracking = medicines.map(med => ({
        ...med,
        remindersSent: []
    }));

    const prescription = await Prescription.create({
        appointmentId,
        patientId: appointment.patientId._id,
        doctorId: docId,
        diagnosis,
        medicines: medicinesWithTracking,
        advice,
    });

    appointment.prescriptionId = prescription._id;
    appointment.status = "Completed";
    appointment.completedAt = new Date();
    await appointment.save();

    // console.log(`\n✅ Prescription created successfully!`);
    // console.log(`👤 Patient: ${appointment.patientId.email}`);
    // console.log(`💊 Medicines: ${medicines.map(m => m.name).join(", ")}`);
    // console.log(`⏰ Reminders will be sent at scheduled times\n`);

    res.status(201).json({
        success: true,
        message: "Prescription created successfully. Medicine reminders will be sent as scheduled.",
        prescription,
    });
});

// Helper function to view reminder tracking (for debugging)
export const getReminderStatus = asyncHandler(async (req, res, next) => {
    const { prescriptionId } = req.params;
    
    const prescription = await Prescription.findById(prescriptionId)
        .populate("patientId", "name email");
    
    if (!prescription) {
        return next(new ErrorHandler("Prescription not found", 404));
    }
    
    const status = prescription.medicines.map(medicine => ({
        name: medicine.name,
        dosage: medicine.dosage,
        frequency: medicine.frequencyOfDose,
        duration: medicine.duration,
        remindersSent: medicine.remindersSent ? medicine.remindersSent.map(r => ({
            timeSlot: r.timeSlot,
            date: r.date
        })) : []
    }));
    
    res.status(200).json({
        success: true,
        patient: prescription.patientId,
        medicines: status
    });
});

export const getPrescriptionById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const prescription = await Prescription.findById(id)
        .populate("patientId")
        .populate("doctorId");

    if (!prescription) {
        return next(new ErrorHandler("Prescription not found", 404));
    }

    res.status(200).json({
        success: true,
        prescription,
    });
});

export const getPatientPrescriptions = asyncHandler(async (req, res, next) => {
    const patientId = req.patient.id;

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
    const doctorId = req.doctor.id;

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