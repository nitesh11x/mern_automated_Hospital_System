
import express from "express";
import { deleteDoctorById, doctorProfile, getAllDoctor, getDoctorById, loginDoctor, logoutDoctor, registerDoctor, updateDoctorById, updateDoctorProfile } from "../controllers/doctor.controller.js";
import { isAdminAuth, isDoctorAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post('/register', isAdminAuth, registerDoctor)
router.post('/login', loginDoctor)
router.post('/logout', isDoctorAuth, logoutDoctor)

router.get('/me', isDoctorAuth, doctorProfile)
router.put('/me/update', isDoctorAuth, updateDoctorProfile)
router.get('/all', getAllDoctor)
router.get('/:id', getDoctorById)

router.put('/:id', isAdminAuth, updateDoctorById)

router.delete('/delete/:id', isAdminAuth, deleteDoctorById)



export default router;