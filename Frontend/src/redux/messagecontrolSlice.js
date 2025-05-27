import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messageControlService from '../services/messagecontrollerService.js';

// Async Thunks

export const deleteMessage = createAsyncThunk(
  'messageControl/deleteMessage',
  async (messageId, thunkAPI) => {
    try {
      const response = await messageControlService.deleteMessage(messageId);
      return { messageId, data: response };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteConversation = createAsyncThunk(
  'messageControl/deleteConversation',
  async (conversationId, thunkAPI) => {
    try {
      const response = await messageControlService.deleteConversation(conversationId);
      return { conversationId, data: response };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice

const messageControlSlice = createSlice({
  name: 'messageControl',
  initialState: {
    loading: false,
    error: null,
    deletedMessageId: null,
    deletedConversationId: null,
  },
  reducers: {
    clearMessageControlState: (state) => {
      state.loading = false;
      state.error = null;
      state.deletedMessageId = null;
      state.deletedConversationId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Delete Message
      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedMessageId = action.payload.messageId;
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Conversation
      .addCase(deleteConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedConversationId = action.payload.conversationId;
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessageControlState } = messageControlSlice.actions;
export default messageControlSlice.reducer;
