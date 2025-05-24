import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import userService from "../services/userService";

// Initial state
const initialState = {
  users: [],
  user: null, // Renamed from userProfile to match UserList.jsx expectation
  isLoading: false,
  error: null,
};

// ✅ Update user profile
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfile(formData); // response contains { success, message, user, profileImage }
      return {
        user: response.user,
        profileImage: response.profileImage,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

// ✅ Get all users
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getAllUsers();
      return response.users;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch users");
    }
  }
);

// ✅ User slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    setUserProfile: (state, action) => {
      state.user = action.payload;
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
        // Update the current user if it exists in the fetched users
        const currentUser = action.payload.find(user => user._id === state.user?._id);
        if (currentUser) {
          state.user = currentUser;
        }
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to fetch users");
      })

      // ✏️ Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
     .addCase(updateProfile.fulfilled, (state, action) => {
  state.isLoading = false;

  const updatedUser = action.payload.user;
  const updatedProfileImage = action.payload.profileImage;

  // Update current logged-in user info in state.user
  state.user = {
    ...updatedUser,
    profileImage: updatedProfileImage,
  };

  // Update the user in the users list if present
  if (Array.isArray(state.users)) {
    const index = state.users.findIndex(user => user._id === updatedUser._id);
    if (index !== -1) {
      state.users[index] = {
        ...updatedUser,
        profileImage: updatedProfileImage,
      };
    }
  }

  toast.success("Profile updated successfully");
})
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to update profile");
      });
  }
});

// Export actions and reducer
export const { clearUserError, setUserProfile } = userSlice.actions;
export default userSlice.reducer;