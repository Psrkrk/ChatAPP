import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/userService";

// Initial state
const initialState = {
  users: [], // List of all users
  user: null, // Current logged-in user profile
  isLoading: false,
  error: null,
};

// ✅ Get all users thunk
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getAllUsers();
      return response.users || response; // Handle varying response structures
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch users");
    }
  }
);

// ✅ Update user profile thunk
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ fullname, profileImage }, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfile({ fullname, profileImage });
      return response.user || response; // Handle varying response structures
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

// ✅ Delete user thunk
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.deleteUser();
      return response; // Return response for state updates
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete user");
    }
  }
);

// ✅ Logout thunk
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      // Clear auth token from localStorage
      localStorage.removeItem("authToken");
      return null; // No API call needed for logout
    } catch (error) {
      return rejectWithValue(error.message || "Failed to logout");
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
      // 🔹 getAllUsers
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = Array.isArray(action.payload) ? action.payload : action.payload.users || [];
        // Update current user if matching
        if (state.user && Array.isArray(action.payload)) {
          const currentUser = action.payload.find(
            (user) => user._id === state.user._id
          );
          if (currentUser) {
            state.user = currentUser;
          }
        }
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Toast handled by userService
      })

      // 🔹 updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        // Update the user in the users array if it exists
        if (state.users.length > 0 && action.payload._id) {
          const userIndex = state.users.findIndex(
            (user) => user._id === action.payload._id
          );
          if (userIndex !== -1) {
            state.users[userIndex] = action.payload;
          }
        }
        // Toast handled by userService
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Toast handled by userService
      })

      // 🔹 deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.users = [];
        // Toast handled by userService
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Toast handled by userService
      })

      // 🔹 logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.users = [];
        // No toast for logout
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Toast handled by userService or show here if needed
      });
  },
});

export const { clearUserError, setUserProfile } = userSlice.actions;
export default userSlice.reducer;