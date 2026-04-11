import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";

export const fetchChatHistoryThunk = createAsyncThunk(
  "chat/fetchHistory",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/chat/${appointmentId}`);
      return data.messages;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch chat history"
      );
    }
  }
);

export const sendChatMessageThunk = createAsyncThunk(
  "chat/send",
  async (messageData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/chat/send", messageData);
      return data.message;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to send message"
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessageToStore: (state, action) => {
      // Basic check to see if the temp ID or exact timestamp exists
      const exists = state.messages.find(m => String(m._id) === String(action.payload._id));
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
    clearChatStore: (state) => {
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistoryThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatHistoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload || [];
      })
      .addCase(fetchChatHistoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendChatMessageThunk.fulfilled, (state, action) => {
        const exists = state.messages.find(m => String(m._id) === String(action.payload._id));
        if(!exists) state.messages.push(action.payload);
      });
  },
});

export const { addMessageToStore, clearChatStore } = chatSlice.actions;
export default chatSlice.reducer;
