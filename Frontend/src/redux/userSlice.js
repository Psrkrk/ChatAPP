import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:5000/api/v1";

const getAuthToken = () => localStorage.getItem("authToken");

const initialState = {
  users: [],
  userProfile: null,
  isLoading: false,
  error: null,
};

// Fetch all users
export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");
      const response = await fetch(`${API_BASE_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      if (!data.success) throw new Error("Failed to fetch users: API error");
      return data.users;
    } catch (error) {
      toast.error(error.message || "Error fetching users");
      return rejectWithValue(error.message);
    }
  }
);

// Fetch specific user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");
      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      if (!data.success) throw new Error("Failed to fetch profile: API error");
      return data;
    } catch (error) {
      toast.error(error.message || "Error fetching profile");
      return rejectWithValue(error.message);
    }
  }
);

// Update user profile
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");
      const response = await fetch(`${API_BASE_URL}/user/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      const updatedData = await response.json();
      if (!updatedData.success) throw new Error("Failed to update profile: API error");
      return { userId, ...updatedData }; // Return userId with updated data
    } catch (error) {
      toast.error(error.message || "Error updating profile");
      return rejectWithValue(error.message);
    }
  }
);

// Update profile image
export const updateProfileImage = createAsyncThunk(
  "user/updateProfileImage",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");
      const response = await fetch(`${API_BASE_URL}/update-profile-image`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to update profile image");
      const updatedData = await response.json();
      if (!updatedData.success) throw new Error("Failed to update profile image: API error");
      return { userId, ...updatedData }; // Return userId with updated data
    } catch (error) {
      toast.error(error.message || "Error updating profile image");
      return rejectWithValue(error.message);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload || [];
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        const { userId, ...updatedData } = action.payload;
        state.users = state.users.map((user) =>
          user._id === userId ? { ...user, ...updatedData } : user
        );
        if (state.userProfile?._id === userId) {
          state.userProfile = { ...state.userProfile, ...updatedData };
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateProfileImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.isLoading = false;
        const { userId, profileImage } = action.payload;
        state.users = state.users.map((user) =>
          user._id === userId ? { ...user, profileImage } : user
        );
        if (state.userProfile?._id === userId) {
          state.userProfile = { ...state.userProfile, profileImage };
        }
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;