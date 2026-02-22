import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";


export const adminRegisterThunk = createAsyncThunk(
    "admin/register",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post("/admin/register", formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Registration failed");
        }
    }
);

export const adminLoginThunk = createAsyncThunk(
    "admin/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const res = await api.post("/admin/login", { email, password });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }
);

export const adminProfileThunk = createAsyncThunk(
    "admin/me",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/admin/me");
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Fetch failed");
        }
    }
);

const tokenFromStorage = localStorage.getItem("adminToken");
const initialState = {
    admin: null,
    profile: null,
    loading: false,
    error: null,
    success: false,
    isAdminAuthenticated: !!tokenFromStorage, // true if token exists
};

// === SLICE ===
const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        resetAdminState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
        logoutAdmin: (state) => {
            state.admin = null;
            state.profile = null;
            state.loading = false;
            state.error = null;
            state.success = false;
            state.isAdminAuthenticated = false;
            localStorage.removeItem("adminToken");
        },
    },
    extraReducers: (builder) => {
        builder
            // register
            .addCase(adminRegisterThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminRegisterThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.admin = action.payload;
            })
            .addCase(adminRegisterThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // login
            .addCase(adminLoginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminLoginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.isAdminAuthenticated = true;
                state.success = true;

                state.admin = action.payload.admin ?? action.payload;
                const token = action.payload.token;
                if (token) {
                    localStorage.setItem("adminToken", token);
                }
            })
            .addCase(adminLoginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAdminAuthenticated = false;
            })

            // profile
            .addCase(adminProfileThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminProfileThunk.fulfilled, (state, action) => {
                state.profile = action.payload.admin;
                state.isAdminAuthenticated = true;
                state.loading = false;
            })
            .addCase(adminProfileThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAdminAuthenticated = false;
            });
    },
});

export const { resetAdminState, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;