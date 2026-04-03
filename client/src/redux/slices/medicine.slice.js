import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";

export const getAllMedicineThunk = createAsyncThunk(
  "medicine/all",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/medicine/all`);
      return response.data.medicine;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch medicines",
      );
    }
  },
);
export const addMedicineThunk = createAsyncThunk(
  "medicine/add",
  async ({ medicineName, avaliableStock }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/medicine/add`, {
        medicineName,
        avaliableStock,
      });
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add New medicines",
      );
    }
  },
);
const initialState = {
  medicines: [],
  loading: false,
  error: null,
};

const medicineSlice = createSlice({
  name: "medicine",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllMedicineThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMedicineThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = action.payload;
      })
      .addCase(getAllMedicineThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addMedicineThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMedicineThunk.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
      })
      .addCase(addMedicineThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default medicineSlice.reducer;
