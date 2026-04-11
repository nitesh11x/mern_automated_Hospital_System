import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";

export const getPatientPrescriptionsThunk = createAsyncThunk(
  "prescription/patient/me",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/prescription/patient/me");
      return data?.prescriptions || data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch prescriptions",
      );
    }
  },
);

export const getPatientPrescriptionByIdThunk = createAsyncThunk(
  "prescription/appointmentId",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/prescription/${appointmentId}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch prescriptions",
      );
    }
  },
);
export const createPrescriptionThunk = createAsyncThunk(
  "prescription/create",
  async (prescriptionData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/prescription/create", prescriptionData);
      return data?.prescription || data;
    } catch (error) {
      console.error(
        "Prescription creation error:",
        error.response?.data || error.message,
      );
      return rejectWithValue(
        error?.response?.data?.message || "Failed to create prescription",
      );
    }
  },
);
const initialState = {
  prescriptions: [],
  prescription: null,
  loading: false,
  error: null,
  success: false,
};

const prescriptionSlice = createSlice({
  name: "prescription",
  initialState,
  reducers: {
    resetPrescriptionState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // get patient prescriptions
      .addCase(getPatientPrescriptionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatientPrescriptionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = action.payload;
      })
      .addCase(getPatientPrescriptionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get patient prescription by id
      .addCase(getPatientPrescriptionByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatientPrescriptionByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.prescription = action.payload;
      })
      .addCase(getPatientPrescriptionByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // create prescription
      .addCase(createPrescriptionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPrescriptionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload) {
          state.prescriptions = [action.payload, ...state.prescriptions];
        }
      })
      .addCase(createPrescriptionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetPrescriptionState } = prescriptionSlice.actions;

export default prescriptionSlice.reducer;
