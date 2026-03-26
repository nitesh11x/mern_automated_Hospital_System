import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";


export const registerDoctorThunk = createAsyncThunk(
    "doctor/register",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post("/doctor/register", formData);
            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Doctor registration failed"
            );
        }
    }
);

export const loginDoctorThunk = createAsyncThunk(
    "doctor/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const res = await api.post("/doctor/login", { email, password });
            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Doctor login failed"
            );
        }
    }
);

export const profileDoctorThunk = createAsyncThunk(
    "doctor/me",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/doctor/me");
            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch profile"
            );
        }
    }
);

export const getAllDoctorsThunk = createAsyncThunk(
    "doctor/all",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/doctor/all");
            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch doctors"
            );
        }
    }
);

export const deleteDoctorThunk = createAsyncThunk(
    "doctor/delete",
    async (doctorId, { rejectWithValue }) => {
    try {
      await api.delete(`/doctor/delete/${doctorId}`);
      return doctorId;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Delete failed");
    }
  },
);

export const updateDoctorProfileThunk = createAsyncThunk(
    "doctor/me/update",
    async (updateData, { rejectWithValue }) => {
        try {
            const res = await api.put("/doctor/me/update", updateData);
            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update profile"
            );
        }
    }
);

export const doctorLogoutThunk = createAsyncThunk(
    "doctor/logout",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.post("/doctor/logout");
            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Doctor logout failed"
            );
        }
    }
);

const initialState = {
    doctor: null,
    doctors: [],
    loading: false,
    error: null,
    success: false,
    isDoctorAuthenticated: false,
};

const doctorSlice = createSlice({
    name: "doctor",
    initialState,
    reducers: {
        resetDoctorState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
        logoutDoctorLocal: (state) => {
            state.doctor = null;
            state.isDoctorAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(registerDoctorThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(registerDoctorThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.doctor = action.payload.doctor;
            })
            .addCase(registerDoctorThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })

            /* ===== LOGIN ===== */
            .addCase(loginDoctorThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginDoctorThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.doctor = action.payload.doctor;
                state.isDoctorAuthenticated = true;
            })
            .addCase(loginDoctorThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isDoctorAuthenticated = false;
            })

            /* ===== PROFILE ===== */
            .addCase(profileDoctorThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(profileDoctorThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.doctor = action.payload.doctor;
                state.isDoctorAuthenticated = true;
            })
            .addCase(profileDoctorThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isDoctorAuthenticated = false;
            })

            /* ===== UPDATE PROFILE ===== */
            .addCase(updateDoctorProfileThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateDoctorProfileThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.doctor = action.payload.doctor;
                state.success = true;
            })
            .addCase(updateDoctorProfileThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })

            .addCase(getAllDoctorsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllDoctorsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.doctors = action.payload.doctors;
            })
            .addCase(getAllDoctorsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(doctorLogoutThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(doctorLogoutThunk.fulfilled, (state) => {
                state.loading = false;
                state.doctor = null;
                state.isDoctorAuthenticated = false;
                state.success = true;
            })
            .addCase(doctorLogoutThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteDoctorThunk.fulfilled, (state, action) => {
                state.doctors = state.doctors.filter(
                    (doc) => doc._id !== action.payload
                );
                console.log(action.payload)
            })
    },
})

export const { resetDoctorState, logoutDoctorLocal } =
    doctorSlice.actions;

export default doctorSlice.reducer;