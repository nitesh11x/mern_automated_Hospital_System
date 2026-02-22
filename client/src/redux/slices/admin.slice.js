import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";
import { toast } from "react-hot-toast";

export const adminRegisterThunk = createAsyncThunk(
    "admin/register",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post("/admin/register", formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Registration failed"
            );
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
            return rejectWithValue(
                error.response?.data?.message || "Login failed"
            );
        }
    }
);


const initialState = {
    admin: null,
    loading: false,
    error: null,
    success: false,
    isAdminAuthenticated: false
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        resetAdminState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminRegisterThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminRegisterThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.admin = action.payload;
                // console.log(action.payload)
            })
            .addCase(adminRegisterThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // login admin 
            .addCase(adminLoginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminLoginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.isAdminAuthenticated = true;
                state.success = true;
                state.admin = action.payload.admin;
            })
            .addCase(adminLoginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAdminAuthenticated = false;
            })
    },
});

export const { resetAdminState } = adminSlice.actions;
export default adminSlice.reducer;