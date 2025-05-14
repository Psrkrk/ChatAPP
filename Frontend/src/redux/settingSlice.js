import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  blockUser,
  unblockUser,
  getBlockedUsers,
} from "../services/settingService";

// Thunks
export const fetchBlockedUsers = createAsyncThunk(
  "settings/fetchBlockedUsers",
  async (_, thunkAPI) => {
    try {
      const response = await getBlockedUsers();
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const blockUserById = createAsyncThunk(
  "settings/blockUserById",
  async (userId, thunkAPI) => {
    try {
      const response = await blockUser(userId);
      return { userId, message: response.message };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const unblockUserById = createAsyncThunk(
  "settings/unblockUserById",
  async (userId, thunkAPI) => {
    try {
      const response = await unblockUser(userId);
      return { userId, message: response.message };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Slice
const settingSlice = createSlice({
  name: "settings",
  initialState: {
    blockedUsers: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch Blocked Users
      .addCase(fetchBlockedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlockedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.blockedUsers = action.payload.blockedUsers || [];
      })
      .addCase(fetchBlockedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Block User
      .addCase(blockUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(blockUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.blockedUsers.push(action.payload.userId);
      })
      .addCase(blockUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Unblock User
      .addCase(unblockUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unblockUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.blockedUsers = state.blockedUsers.filter(
          (id) => id !== action.payload.userId
        );
      })
      .addCase(unblockUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = settingSlice.actions;

export default settingSlice.reducer;
