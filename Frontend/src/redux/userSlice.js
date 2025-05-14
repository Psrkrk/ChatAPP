import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import userService from "../services/userService";

const initialState = {
  users: [],
  userProfile: null,
  profileImageUrl: null,
  isLoading: false,
  error: null,
};

// 🔄 Update user profile
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ fullname, profileImage }, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfile({ fullname, profileImage });
      return response.user; // The updated user object
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

// 📦 Get all users
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getAllUsers();
      return response.users; // Assumes API returns { users: [...] }
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch users");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
      state.profileImageUrl = action.payload?.profileImage || null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔃 Get Users
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
        toast.error(action.payload || "Failed to fetch users"); // Show error toast
      })

      // ✏️ Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload;
        state.profileImageUrl = action.payload?.profileImage || null;

        // Sync the updated user with the list
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }

        // Note: Success toast already shown in `userService`, no duplicate here
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Something went wrong";
        toast.error(action.payload || "Failed to update profile"); // Show error toast
      });
  },
});

export const { clearUserError, setUserProfile } = userSlice.actions;
export default userSlice.reducer;
