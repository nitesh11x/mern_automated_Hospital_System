import { configureStore } from '@reduxjs/toolkit'
import patientReducer from "../slices/patient.slice";
import otpReducer from "../slices/otp.slice";
import adminReducer from '../slices/admin.slice'
import doctorReducer from '../slices/doctor.slice'
import appointmentReducer from '../slices/appointment.slice'
import reviewReducer from '../slices/review.slice'
import prescriptionReducer from '../slices/prescription.slice'
export const store = configureStore({
    reducer: {
        patient: patientReducer,
        otp: otpReducer,
        admin: adminReducer,
        appointment: appointmentReducer,
        doctor: doctorReducer,
        review: reviewReducer,
        prescription: prescriptionReducer
    },

});