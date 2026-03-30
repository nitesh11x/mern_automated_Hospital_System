import express from 'express';
import {
    createPrescription,
    getPrescriptionById,
    getPatientPrescriptions,
    getDoctorPrescriptions,
    getReminderStatus  // Add this
} from '../controllers/prescription.controller.js';

const router = express.Router();

router.post('/create', createPrescription);
router.get('/:id', getPrescriptionById);
router.get('/patient/my-prescriptions', getPatientPrescriptions);
router.get('/doctor/my-prescriptions', getDoctorPrescriptions);
router.get('/reminder-status/:prescriptionId', getReminderStatus);  // Add this route for debugging

export default router;