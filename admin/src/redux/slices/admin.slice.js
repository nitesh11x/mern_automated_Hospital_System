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
export const adminLogoutThunk = createAsyncThunk(
    "admin/logout",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.post("/admin/logout");
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const getDashboardStatsThunk = createAsyncThunk(
    "admin/stats",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/admin/stats");
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
        }
    }
);
const initialState = {
    admin: null,
    profile: null,
    stats: null,
    loading: false,
    error: null,
    success: false,
    isAdminAuthenticated: false,
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
        // logoutAdmin: (state) => {
        //     state.admin = null;
        //     state.profile = null;
        //     state.loading = false;
        //     state.error = null;
        //     state.success = false;
        //     state.isAdminAuthenticated = false;
        // },
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
            })
            // logout admin 
            .addCase(adminLogoutThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(adminLogoutThunk.fulfilled, (state) => {
                state.loading = false;
                state.admin = null;
                state.profile = null;
                state.isAdminAuthenticated = false;
                state.success = false;
                state.error = null;
            })
            .addCase(adminLogoutThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAdminAuthenticated = false;
                state.admin = null;
            })
            // stats
            .addCase(getDashboardStatsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDashboardStatsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload?.data;
            })
            .addCase(getDashboardStatsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetAdminState, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;