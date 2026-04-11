import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";

export const analyzeSymptomsThunk = createAsyncThunk(
  "ai/analyzeSymptoms",
  async (symptoms, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/ai/triage", { symptoms });

      if (!data?.success) {
        return rejectWithValue(data?.message || "AI response failed");
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to contact the AI server"
      );
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  triageExplanation: "",
  recommendedSpecialization: "",
  recommendedDoctors: [],
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    resetAiState: (state) => {
      state.loading = false;
      state.error = null;
      state.triageExplanation = "";
      state.recommendedSpecialization = "";
      state.recommendedDoctors = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeSymptomsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeSymptomsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.triageExplanation =
          action.payload?.triageExplanation || "";

        state.recommendedSpecialization =
          action.payload?.recommendedSpecialization || "";

        state.recommendedDoctors =
          action.payload?.recommendedDoctors || [];
      })

      .addCase(analyzeSymptomsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.triageExplanation = "";
        state.recommendedSpecialization = "";
        state.recommendedDoctors = [];
      });
  },
});

export const { resetAiState } = aiSlice.actions;
export default aiSlice.reducer;