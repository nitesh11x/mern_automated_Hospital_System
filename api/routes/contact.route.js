import express from "express";
import {
  submitContact,
  getAllMessages,
  deleteMessage,
  updateMessageStatus,
  replyToContact,
} from "../controllers/contact.controller.js";
import { isAdminAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/submit", submitContact);
router.get("/all", isAdminAuth, getAllMessages);
router.delete("/delete/:id", isAdminAuth, deleteMessage);
router.patch("/status/:id", isAdminAuth, updateMessageStatus);
router.post("/reply/:id", isAdminAuth, replyToContact);

export default router;
