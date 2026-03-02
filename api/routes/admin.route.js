

import express from "express";
import {
    registerAdmin,
    loginAdmin,
    updateAdminById,
    deleteAdminById,
    getAllAdmin,
    getAdminProfile,
    logoutAdmin,
    getDashboardStats
} from "../controllers/admin.controller.js";

import { isAdminAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", isAdminAuth, registerAdmin);
router.post("/login", loginAdmin);

router.get("/all", isAdminAuth, getAllAdmin);
router.get("/stats", isAdminAuth, getDashboardStats);
router.get("/me", isAdminAuth, getAdminProfile);
router.post("/logout", isAdminAuth, logoutAdmin);

router.put("/:id", isAdminAuth, updateAdminById);
router.delete("/:id", isAdminAuth, deleteAdminById);

export default router;