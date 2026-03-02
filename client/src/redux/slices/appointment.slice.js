import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";

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
    "appointment/patient/me",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/appointment/patient/me");
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
        },
    },
    extraReducers: (builder) => {
        builder
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
                state.appointments = action.payload;
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
            });
    },
});

export const { resetBookingState, clearAppointmentError } =
    appointmentSlice.actions;

export default appointmentSlice.reducer;