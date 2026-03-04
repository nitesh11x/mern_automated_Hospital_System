import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";

export const bookAppointment = createAsyncThunk(
    "appointment/book",
    async (appointmentData, { rejectWithValue }) => {
        try {
            const { data } = await api.post(
                "/appointment/book",
                appointmentData
            );

            return data?.appointment || data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Booking failed"
            );
        }
    }
);

export const getAllAppointments = createAsyncThunk(
    "appointment/all",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/appointment/all");
            return data?.appointments || data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch appointments"
            );
        }
    }
);
export const getPatientAppointments = createAsyncThunk(
    "appointment/me",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/appointment/me");
            return data?.appointments || data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch patient appointments"
            );
        }
    }
);
export const getDoctorAppointments = createAsyncThunk(
    "appointment/doctor/me",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/appointment/doctor/me");
            return data?.appointments || data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch doctor appointments"
            );
        }
    }
);
export const updateAppointmentPaymentStatus = createAsyncThunk(
    "appointment/status/payment/update",
    async ({ id, paymentStatus }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(
                `/appointment/status/payment/${id}`,
                { paymentStatus }
            );

            return data?.appointment || data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to update payment status"
            );
        }
    }
);
export const updateAppointmentStatus = createAsyncThunk(
    "appointment/status/update",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/appointment/status/${id}`, { status });
            return data?.appointment || data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to update appointment status"
            );
        }
    }
);
export const reScheduelAppointmentByIdThunk = createAsyncThunk(
    "appointment/rescheduel/appointmentId",
    async ({ appointmentId, appointmentDate, approvedTimeSlot }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(
                `/appointment/rescheduel/${appointmentId}`,
                { appointmentDate, approvedTimeSlot }
            );

            return data.appointment;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to reschedule appointment"
            );
        }
    }
);

const initialState = {
    appointments: [],
    patientAppointments: null,
    loading: false,
    error: null,
    bookingSuccess: false,
};

const appointmentSlice = createSlice({
    name: "appointments",
    initialState,
    reducers: {
        resetBookingState: (state) => {
            state.bookingSuccess = false;
            state.error = null;
        },
        clearAppointmentError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ================= Book Appointment  =================
            .addCase(bookAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.bookingSuccess = false;
            })
            .addCase(bookAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.bookingSuccess = true;
                state.appointments = [
                    ...state.appointments,
                    action.payload,
                ];
            })
            .addCase(bookAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.bookingSuccess = false;
            })
            // ================= FETCH =================
            .addCase(getAllAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments = action.payload;
            })
            .addCase(getAllAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ================= PATIENT APPOINTMENTS =================
            .addCase(getPatientAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPatientAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.patientAppointments = action.payload;
            })
            .addCase(getPatientAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ================= DOCTOR APPOINTMENTS =================
            .addCase(getDoctorAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDoctorAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments = action.payload;
            })
            .addCase(getDoctorAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ================= UPDATE STATUS =================
            .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
                const updatedAppointment = action.payload;
                state.appointments = state.appointments.map((appt) =>
                    appt._id === updatedAppointment._id ? updatedAppointment : appt
                );
            })

            // ================= UPDATE Payment Status =================
            .addCase(updateAppointmentPaymentStatus.fulfilled, (state, action) => {
                const updatedAppointment = action.payload;
                state.appointments = state.appointments.map((appt) =>
                    appt._id === updatedAppointment._id ? updatedAppointment : appt
                );
            })
            // ================= resheduel appoitment =================
            .addCase(reScheduelAppointmentByIdThunk.fulfilled, (state, action) => {
                const updated = action.payload;

                const index = state.appointments.findIndex(
                    (app) => app._id === updated._id
                );
                if (index !== -1) {
                    state.appointments[index] = updated;
                }
            })
    },
});

export const { resetBookingState, clearAppointmentError } =
    appointmentSlice.actions;

export default appointmentSlice.reducer;