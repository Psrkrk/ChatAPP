import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import chatService from "../services/chatService"; // Correct import for chatService

// Initial state for the chat slice
const initialState = {
  users: [],
  messages: [],
  loading: false,
  error: null,
};

// Send a message
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ messageData, receiverId }, { rejectWithValue }) => {
    try {
      const response = await chatService.sendMessage(messageData, receiverId); // Use chatService here
      return response; // Return the response if successful
    } catch (error) {
      return rejectWithValue(error.message || "Failed to send message");
    }
  }
);

// Fetch received messages
export const receivedMessages = createAsyncThunk(
  "chat/receivedMessages",
  async (receiverId, { rejectWithValue }) => {
    try {
      const response = await chatService.receivedMessages(receiverId); // Use receivedMessages here
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch messages");
    }
  }
);

// Create the chat slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    resetChatState: (state) => {
      state.users = [];
      state.messages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Sending a message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.messages = action.payload; // Replace messages with the returned ones
        } else {
          state.messages.push(action.payload); // If sending a single message, append it
        }
        toast.success("Message sent successfully");
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to send message");
      });

    // Fetching received messages
    builder
      .addCase(receivedMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(receivedMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload; // Replace the messages with the new ones
      })
      .addCase(receivedMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to fetch messages");
      });
  },
});

export const { resetChatState } = chatSlice.actions;

export default chatSlice.reducer;
