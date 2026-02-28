import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";

/* =========================
   REGISTER
========================= */
export const patientRegisterThunk = createAsyncThunk(
    "patient/register",
    async (formValues, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            Object.keys(formValues).forEach((key) => {
                if (formValues[key]) {
                    formData.append(key, formValues[key]);
                }
            });

            const { data } = await api.post(
                "/patient/register",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            return data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Registration failed"
            );
        }
    }
);

/* =========================
   LOGIN
========================= */
export const patientLoginThunk = createAsyncThunk(
    "patient/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/patient/login", {
                email,
                password,
            });

            return data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Login failed"
            );
        }
    }
);

/* =========================
   LOGOUT
========================= */
export const patientLogoutThunk = createAsyncThunk(
    "patient/logout",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/patient/logout");
            return data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Logout failed"
            );
        }
    }
);

/* =========================
   GET ALL PATIENTS
========================= */
export const getAllPatientThunk = createAsyncThunk(
    "patient/all",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/patient/all");
            return data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Fetch patients failed"
            );
        }
    }
);

/* =========================
   GET PROFILE
========================= */
export const profilePatientThunk = createAsyncThunk(
    "patient/me",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/patient/me");
            return data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch profile"
            );
        }
    }
);

/* =========================
   INITIAL STATE
========================= */
const initialState = {
    patient: null,
    patients: [],
    loading: false,
    error: null,
    isPatientAuthenticated: false,
};

/* =========================
   SLICE
========================= */
const patientSlice = createSlice({
    name: "patient",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetPatientState: () => initialState,
    },
    extraReducers: (builder) => {
        builder

            /* ========= REGISTER ========= */
            .addCase(patientRegisterThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(patientRegisterThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.patient =
                    action.payload?.patient || action.payload?.data || null;
                state.isPatientAuthenticated = true;
                state.error = null;
            })
            .addCase(patientRegisterThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isPatientAuthenticated = false;
            })

            /* ========= LOGIN ========= */
            .addCase(patientLoginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(patientLoginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.patient =
                    action.payload?.patient || action.payload?.data || null;
                state.isPatientAuthenticated = true;
                state.error = null;
            })
            .addCase(patientLoginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isPatientAuthenticated = false;
            })

            /* ========= LOGOUT ========= */
            .addCase(patientLogoutThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(patientLogoutThunk.fulfilled, (state) => {
                state.loading = false;
                state.patient = null;
                state.isPatientAuthenticated = false;
                state.error = null;
            })
            .addCase(patientLogoutThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ========= GET ALL ========= */
            .addCase(getAllPatientThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPatientThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.patients =
                    action.payload?.patients || action.payload || [];
                state.error = null;
            })
            .addCase(getAllPatientThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ========= PROFILE ========= */
            .addCase(profilePatientThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(profilePatientThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.patient =
                    action.payload?.patient || action.payload?.data || null;
                state.isPatientAuthenticated = true;
                state.error = null;
            })
            .addCase(profilePatientThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isPatientAuthenticated = false;
            });
    },
});

export const { clearError, resetPatientState } = patientSlice.actions;

export default patientSlice.reducer;