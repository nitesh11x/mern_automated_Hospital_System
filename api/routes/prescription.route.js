import express from 'express';
import {
    createPrescription,
    getPrescriptionById,
    getPatientPrescriptions,
    getDoctorPrescriptions,
    getReminderStatus
} from '../controllers/prescription.controller.js';
import { isDoctorAuth, isPatientAuth } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/create', isDoctorAuth, createPrescription);

router.get('/doctor/my-prescriptions', isDoctorAuth, getDoctorPrescriptions);
router.get('/reminder-status/:prescriptionId', isDoctorAuth, getReminderStatus);
router.get('/patient/me', isPatientAuth, getPatientPrescriptions);
router.get('/:appointmentId', isDoctorAuth, getPrescriptionById);

export default router;