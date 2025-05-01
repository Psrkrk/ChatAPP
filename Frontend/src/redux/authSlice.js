// src/redux/authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../services/authService"; // ✅ Corrected import

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

// ✅ Register user
export const register = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const userData = await authService.registerUser(formData);
      return userData;
    } catch (error) {
      return rejectWithValue(error?.message || "Registration failed");
    }
  }
);

// ✅ Login user
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const userData = await authService.loginUser(credentials);
      return userData;
    } catch (error) {
      return rejectWithValue(error?.message || "Login failed");
    }
  }
);

// ✅ Logout user
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logoutUser();
    } catch (error) {
      return rejectWithValue(error?.message || "Logout failed");
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
