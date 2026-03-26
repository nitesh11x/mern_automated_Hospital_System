import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";

export const addReviewThunk = createAsyncThunk(
  "review/post",
  async (reviewData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("doctorId", reviewData.doctorId);
      formData.append("rating", reviewData.rating);
      formData.append("message", reviewData.message);

      if (reviewData.media) {
        formData.append("media", reviewData.media);
      }

      const response = await api.post("/review/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      return response.data.review;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add review",
      );
    }
  },
);

export const getAllReviewsThunk = createAsyncThunk(
  "review/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/review/get");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews",
      );
    }
  },
);

export const getDoctorReviewsThunk = createAsyncThunk(
  "review/getByDoctor",
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/review/doctor/${doctorId}`);
      return response.data.reviews; // ✅ FIX
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews",
      );
    }
  },
);

export const deleteReviewThunk = createAsyncThunk(
  "review/delete",
  async (reviewId, { rejectWithValue }) => {
    try {
      await api.delete(`/review/delete/${reviewId}`);
      return reviewId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete review",
      );
    }
  },
);

const initialState = {
  reviews: [],
  loading: false,
  error: null,
  success: false,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    resetReviewState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(addReviewThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addReviewThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reviews = action.payload;
      })
      .addCase(addReviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllReviewsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllReviewsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getAllReviewsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getDoctorReviewsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDoctorReviewsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getDoctorReviewsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteReviewThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReviewThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(
          (review) => review._id !== action.payload,
        );
      })
      .addCase(deleteReviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
