import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";


//  Add Review
export const addReviewThunk = createAsyncThunk(
    "review/add",
    async (reviewData, { rejectWithValue }) => {
        try {
            const response = await api.post("/review/add", reviewData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add review"
            );
        }
    }
);


// Get all reviews
export const getAllReviewsThunk = createAsyncThunk(
    "review/get",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/review/get`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch reviews"
            );
        }
    }
);
export const getDoctorReviewsThunk = createAsyncThunk(
    "review/getByDoctor",
    async (doctorId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/review/doctor/${doctorId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch reviews"
            );
        }
    }
);


// 🔥 Delete Review
export const deleteReviewThunk = createAsyncThunk(
    "review/delete",
    async (reviewId, { rejectWithValue }) => {
        try {
            await api.delete(`/review/delete/${reviewId}`);
            return reviewId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete review"
            );
        }
    }
);


// 🧠 Initial State
const initialState = {
    reviews: [],
    loading: false,
    error: null,
    success: false,
};


// 🏗 Slice
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

            // ✅ Add Review
            .addCase(addReviewThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addReviewThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.reviews.push(action.payload);
            })
            .addCase(addReviewThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Get Reviews
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

            // ✅ Delete Review
            .addCase(deleteReviewThunk.fulfilled, (state, action) => {
                state.reviews = state.reviews.filter(
                    (review) => review._id !== action.payload
                );
            });
    },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;