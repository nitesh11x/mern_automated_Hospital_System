import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";

// --- Async Thunks ---

// Fetch all appointments for the logged-in patient
export const fetchPatientAppointments = createAsyncThunk(
    "appointments/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/appointments/my-appointments");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Book a new appointment
export const bookAppointment = createAsyncThunk(
    "appointments/book",
    async (appointmentData, { rejectWithValue }) => {
        try {
            const response = await api.post("/appointments/book", appointmentData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    appointments: [],
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
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Appointments
            .addCase(fetchPatientAppointments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPatientAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments = action.payload;
            })
            .addCase(fetchPatientAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch appointments";
            })

            // Book Appointment
            .addCase(bookAppointment.pending, (state) => {
                state.loading = true;
            })
            .addCase(bookAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.bookingSuccess = true;
                state.appointments.push(action.payload);
            })
            .addCase(bookAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Booking failed";
            });
    },
});

export const { resetBookingState, clearAppointmentError } = appointmentSlice.actions;

export default appointmentSlice.reducer;