import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";

/* ================= SEND OTP ================= */

export const sendOtpThunk = createAsyncThunk(
  "otp/sendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("/otp/send-otp", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP",
      );
    }
  },
);

/* ================= VERIFY OTP ================= */

export const verifyOtpThunk = createAsyncThunk(
  "otp/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post("/otp/verify-otp", { email, otp });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Invalid OTP");
    }
  },
);

/* ================= CHANGE OTP FLAG ================= */

export const changeOtpFlagThunk = createAsyncThunk(
  "otp/changeFlag",
  async (isBypass, { rejectWithValue }) => {
    try {
      const response = await api.post("/otp/change-flag", { isBypass });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change OTP flag",
      );
    }
  },
);

/* ================= GET OTP FLAG ================= */

export const getOtpFlagThunk = createAsyncThunk(
  "otp/getFlag",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/otp/get-flag");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get OTP flag",
      );
    }
  },
);

const otpSlice = createSlice({
  name: "otp",
  initialState: {
    loading: false,
    error: null,
    isOtpVerified: false,
    bypassOtp: false,
  },

  reducers: {
    setOtpVerified: (state, action) => {
      state.isOtpVerified = action.payload;
    },

    resetOtpState: (state) => {
      state.loading = false;
      state.error = null;
      state.isOtpVerified = false;
    },
  },

  extraReducers: (builder) => {
    builder

      /* SEND OTP */

      .addCase(sendOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtpThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* VERIFY OTP */

      .addCase(verifyOtpThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtpThunk.fulfilled, (state) => {
        state.loading = false;
        state.isOtpVerified = true;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CHANGE FLAG */

      .addCase(changeOtpFlagThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeOtpFlagThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.bypassOtp = action.payload.data.isBypass;
      })
      .addCase(changeOtpFlagThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET FLAG */

      .addCase(getOtpFlagThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOtpFlagThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.bypassOtp = action.payload.data.isBypass;
        console.log(action.payload);
      })
      .addCase(getOtpFlagThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setOtpVerified, resetOtpState } = otpSlice.actions;

export default otpSlice.reducer;
