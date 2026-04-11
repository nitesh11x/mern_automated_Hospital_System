import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";
import { toast } from "react-hot-toast";

export const fetchAllContactMessagesThunk = createAsyncThunk(
  "contact/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/contact/all");
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch messages");
    }
  }
);

export const deleteContactMessageThunk = createAsyncThunk(
  "contact/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/contact/delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete message");
    }
  }
);

export const updateContactStatusThunk = createAsyncThunk(
  "contact/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/contact/status/${id}`, { status });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update status");
    }
  }
);

export const replyToInquiryThunk = createAsyncThunk(
  "contact/reply",
  async ({ id, replyMessage }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/contact/reply/${id}`, { replyMessage });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send reply");
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllContactMessagesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllContactMessagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchAllContactMessagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteContactMessageThunk.fulfilled, (state, action) => {
        state.messages = state.messages.filter((m) => m._id !== action.payload);
      })
      .addCase(updateContactStatusThunk.fulfilled, (state, action) => {
        const index = state.messages.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      })
      .addCase(replyToInquiryThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(replyToInquiryThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.messages.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      })
      .addCase(replyToInquiryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default contactSlice.reducer;
