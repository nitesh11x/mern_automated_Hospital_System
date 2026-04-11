import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";

// Thunk to fetch all emergencies (Admin only)
export const getAllEmergenciesThunk = createAsyncThunk(
  "emergency/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/emergency/all");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch emergencies");
    }
  }
);

// Thunk to create an emergency request (Patient/Guest)
export const createEmergencyRequestThunk = createAsyncThunk(
  "emergency/create",
  async (emergencyData, { rejectWithValue }) => {
    try {
      const response = await api.post("/emergency/request", emergencyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "SOS request failed");
    }
  }
);

// Thunk to update emergency status (Admin only)
export const updateEmergencyStatusThunk = createAsyncThunk(
  "emergency/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/emergency/status/${id}`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Status update failed");
    }
  }
);

const initialState = {
  emergencies: [],
  loading: false,
  error: null,
  success: false,
};

const emergencySlice = createSlice({
  name: "emergency",
  initialState,
  reducers: {
    resetEmergencyState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    // Used for real-time socket alerts
    addNewEmergency: (state, action) => {
      state.emergencies = [action.payload, ...state.emergencies];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(getAllEmergenciesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEmergenciesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.emergencies = action.payload.data;
      })
      .addCase(getAllEmergenciesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Request
      .addCase(createEmergencyRequestThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEmergencyRequestThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // The socket listener will normally add it to the list if on admin dash,
        // but for the patient side, we just want success.
      })
      .addCase(createEmergencyRequestThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Status
      .addCase(updateEmergencyStatusThunk.fulfilled, (state, action) => {
        const index = state.emergencies.findIndex(e => e._id === action.payload.data._id);
        if (index !== -1) {
          state.emergencies[index] = action.payload.data;
        }
      })
      .addCase(updateEmergencyStatusThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetEmergencyState, addNewEmergency } = emergencySlice.actions;
export default emergencySlice.reducer;
