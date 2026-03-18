import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";

export const notifyPatientAppointmentThunk = createAsyncThunk(
  "notification/notify",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/notification/notify/${appointmentId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Notify failed");
    }
  },
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    loading: false,
    success: false,
    message: null,
    error: null,
  },
  reducers: {
    resetNotificationState: (state) => {
      state.loading = false;
      state.success = false;
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(notifyPatientAppointmentThunk.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(notifyPatientAppointmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(notifyPatientAppointmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetNotificationState } = notificationSlice.actions;

export default notificationSlice.reducer;
