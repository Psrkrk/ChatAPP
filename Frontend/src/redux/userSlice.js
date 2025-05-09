import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/userService";

const initialState = {
  users: [],
  userProfile: null,
  profileImageUrl: null,
  isLoading: false,
  isImageLoading: false,
  error: null,
};

// Thunk to get all users
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getAllUsers();
      return response.users || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to update user profile (name, email, image)
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (updateData, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfile(updateData);
      return response.user; // Matches API response structure
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// User Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all users
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload;
        state.profileImageUrl = action.payload.profileImage || null;

        // ✅ Reflect changes in the users list
        const updatedUserIndex = state.users.findIndex(
          (user) => user._id === action.payload._id
        );
        if (updatedUserIndex !== -1) {
          state.users[updatedUserIndex] = action.payload;
        }
      })
    
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
