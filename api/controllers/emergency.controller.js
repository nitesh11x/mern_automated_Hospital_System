import { Emergency } from "../models/Emergency.model.js";
import { io } from "../lib/socket.js";

export const createEmergencyRequest = async (req, res) => {
  try {
    const { patientId, patientName, phone, location, address, severity } = req.body;

    if (!location || location.lat === undefined || location.lng === undefined) {
      return res.status(400).json({ success: false, message: "Location is required" });
    }

    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number is required for emergency dispatch" });
    }

    const newEmergency = await Emergency.create({
      patientId: patientId || null,
      patientName: patientName || "Guest",
      phone,
      location,
      address: address || "",
      severity: severity || "High",
    });

    // Alert the admin room in real-time
    if (io) {
      io.to("admin_room").emit("emergency_alert", {
        emergency: newEmergency,
        message: `🚨 CRITICAL: Emergency request from ${newEmergency.patientName}!`,
      });
    }

    res.status(201).json({
      success: true,
      message: "Emergency request logged successfully. Help is on the way.",
      data: newEmergency,
    });
  } catch (error) {
    console.error("Emergency Request Error:", error);
    res.status(500).json({ success: false, message: "External server error in emergency dispatch" });
  }
};

export const getAllEmergencies = async (req, res) => {
  try {
    const emergencies = await Emergency.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: emergencies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEmergencyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Emergency.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
