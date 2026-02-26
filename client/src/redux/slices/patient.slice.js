import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";

export const patientRegisterThunk = createAsyncThunk(
    "patient/register",
    async (
        {
            patientId,
            firstName,
            lastName,
            email,
            password,
            phone,
            dob,
            gender,
            profile,
        },
        { rejectWithValue }
    ) => {
        try {
            const formData = new FormData();

            formData.append("patientId", patientId);
            formData.append("firstName", firstName);
            formData.append("lastName", lastName);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("phone", phone);
            formData.append("dob", dob);
            formData.append("gender", gender);

            if (profile) {
                formData.append("profile", profile);
            }

            const response = await api.post("patient/register", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Registration failed"
            );
        }
    }
);

export const patientLoginThunk = createAsyncThunk(
    "patient/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await api.post("patient/login", {
                email,
                password,
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Login failed"
            );
        }
    }
);

export const patientLogoutThunk = createAsyncThunk(
    "patient/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post("patient/logout");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Logout failed"
            );
        }
    }
);
export const getAllPatientThunk = createAsyncThunk(
    "patient/all",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("patient/all");
            console.log(response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "fetch patient failed"
            );
        }
    }
);

const patientSlice = createSlice({
    name: "patient",
    initialState: {
        patient: null,
        patients: [],
        loading: false,
        error: null,
        isPatientAuthenticated: false,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetPatientState: (state) => {
            state.patient = null;
            state.loading = false;
            state.error = null;
            state.isPatientAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder

            /* REGISTER */
            .addCase(patientRegisterThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(patientRegisterThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.patient = action.payload.patient;
                state.error = null;
            })
            .addCase(patientRegisterThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* LOGIN */
            .addCase(patientLoginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(patientLoginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.patient = action.payload.patient;
                state.isPatientAuthenticated = true;
                state.error = null;
                // console.log(action.payload)
            })
            .addCase(patientLoginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* LOGOUT */
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

            // get all patient 
            .addCase(getAllPatientThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPatientThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.patients = action.payload.patients;
                console.log(action.payload)
            })
            .addCase(getAllPatientThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { clearError, resetPatientState } = patientSlice.actions;
export default patientSlice.reducer;