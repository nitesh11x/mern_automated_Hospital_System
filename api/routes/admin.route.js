

import express from "express";
import {
    registerAdmin,
    loginAdmin,
    updateAdminById,
    deleteAdminById,
    getAllAdmin,
    getAdminProfile
} from "../controllers/admin.controller.js";

import { isAdminAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.get("/all", isAdminAuth, getAllAdmin);
router.get("/me", isAdminAuth, getAdminProfile);

router.put("/:id", isAdminAuth, updateAdminById);
router.delete("/:id", isAdminAuth, deleteAdminById);

export default router;