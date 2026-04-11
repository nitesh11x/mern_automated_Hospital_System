import { Contact } from "../models/Contact.model.js";
import { sendEmail } from "../utils/email.util.js";

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const newContact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully! Our team will contact you soon.",
      data: newContact,
    });
  } catch (error) {
    console.error("Error in submitContact:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not send message",
    });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Admin
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error in getAllMessages:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch messages",
    });
  }
};

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Admin
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Contact.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteMessage:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not delete message",
    });
  }
};

// @desc    Update message status
// @route   PATCH /api/contact/:id
// @access  Admin
export const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const message = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Message marked as ${status}`,
      data: message,
    });
  } catch (error) {
    console.error("Error in updateMessageStatus:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not update status",
    });
  }
};

// @desc    Reply to a contact message via email
// @route   POST /api/contact/reply/:id
// @access  Admin
export const replyToContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    if (!replyMessage) {
      return res.status(400).json({
        success: false,
        message: "Reply message is required",
      });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    // Send the email
    await sendEmail({
      to: contact.email,
      subject: `Reply to your inquiry: ${contact.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px, overflow: hidden;">
          <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">NewCare Support Response</h2>
          </div>
          <div style="padding: 20px; color: #374151;">
            <p>Hello <strong>${contact.name}</strong>,</p>
            <p>Thank you for reaching out to us. Here is our response to your inquiry regarding "<strong>${contact.subject}</strong>":</p>
            <div style="background-color: #f9fafb; padding: 15px; border-left: 4px solid #4f46e5; margin: 20px 0; font-style: italic;">
              ${replyMessage}
            </div>
            <p>If you have any further questions, please don't hesitate to reply to this email.</p>
            <p style="margin-top: 30px;">Best regards,<br/><strong>NewCare Medical Team</strong></p>
          </div>
          <div style="background-color: #f3f4f6; color: #6b7280; padding: 10px; text-align: center; font-size: 12px;">
            This is an automated response from NewCare Hospital Management System.
          </div>
        </div>
      `,
    });

    // Mark as resolved after replying
    contact.status = "Resolved";
    await contact.save();

    res.status(200).json({
      success: true,
      message: "Reply sent successfully and inquiry marked as Resolved",
      data: contact,
    });
  } catch (error) {
    console.error("Error in replyToContact:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not send reply",
    });
  }
};
