import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";


// 🔥 Register Doctor
export const registerDoctorThunk = createAsyncThunk(
    "doctor/register",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post("/doctor/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Doctor registration failed"
            );
        }
    }
);


// 🔥 Get All Doctors
export const getAllDoctorsThunk = createAsyncThunk(
    "doctor/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/doctor/getAll");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch doctors"
            );
        }
    }
);


// 🔥 Delete Doctor
export const deleteDoctorThunk = createAsyncThunk(
    "doctor/delete",
    async (doctorId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/doctor/delete/${doctorId}`);
            return doctorId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete doctor"
            );
        }
    }
);


// 🧠 Initial State
const initialState = {
    doctors: [],
    loading: false,
    error: null,
    success: false,
};


// 🏗 Slice
const doctorSlice = createSlice({
    name: "doctor",
    initialState,
    reducers: {
        resetDoctorState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder

            // ✅ Register Doctor
            .addCase(registerDoctorThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerDoctorThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.doctors.push(action.payload);
            })
            .addCase(registerDoctorThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Get All Doctors
            .addCase(getAllDoctorsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllDoctorsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.doctors = action.payload;
            })
            .addCase(getAllDoctorsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Delete Doctor
            .addCase(deleteDoctorThunk.fulfilled, (state, action) => {
                state.doctors = state.doctors.filter(
                    (doctor) => doctor._id !== action.payload
                );
            });
    },
});

export const { resetDoctorState } = doctorSlice.actions;
export default doctorSlice.reducer;