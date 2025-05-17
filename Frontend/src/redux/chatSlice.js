// src/redux/chatSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendMessageAPI, getMessagesAPI } from "../services/chatService";

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ receiverId, messageData }, { rejectWithValue }) => {
    try {
      return await sendMessageAPI(receiverId, messageData);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (receiverId, { rejectWithValue }) => {
    try {
      return await getMessagesAPI(receiverId);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  messages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
reducers: {
  clearMessages: (state) => {
    state.messages = [];
  },
  addOptimisticMessage: (state, action) => {
    state.messages.push(action.payload);
  },
  updateMessageStatus: (state, action) => {
    const { tempId, status, messageId } = action.payload;
    const msg = state.messages.find((m) => m.timestamp === tempId);
    if (msg) {
      msg.status = status;
      if (messageId) msg.messageId = messageId;
    }
  },
  receiveMessage: (state, action) => {
    // Prevent duplicates
    const exists = state.messages.some((m) => m.messageId === action.payload.messageId);
    if (!exists) {
      state.messages.push({ ...action.payload, status: "sent" });
    }
  },
},

  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.loading = false;
        // Don't push again; we already optimistically added
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearMessages,
  appendMessage,
  addOptimisticMessage,
  updateMessageStatus,
} = chatSlice.actions;

export default chatSlice.reducer;
