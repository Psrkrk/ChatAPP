// src/services/userService.js

// Base API URL from env or fallback to localhost
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1").replace(/\/+$/, '');

// Helper: Get auth token from localStorage
const getAuthToken = () => localStorage.getItem("authToken");

// Helper: Centralized error handler
const handleAPIError = async (response) => {
  let errorMessage = "Something went wrong";
  try {
    const data = await response.json();
    errorMessage = data.error || data.message || errorMessage;
  } catch (_) {
    console.error("API Error (non-JSON response):", response);
  }
  throw new Error(errorMessage);
};

const userService = {
  // ✅ Fetch all users (GET /user)
  getAllUsers: async () => {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication token missing");

    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) await handleAPIError(response);
    return await response.json();
  },

  // ✅ Update user profile (PUT /user/update-profile)
  updateProfile: async ({ fullname, profileImage }) => {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication token missing");

    const formData = new FormData();
    if (fullname) formData.append("fullname", fullname);
    if (profileImage) formData.append("profileImage", profileImage);

    const response = await fetch(`${API_BASE_URL}/user/update-profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set 'Content-Type' when using FormData
      },
      body: formData,
    });

    if (!response.ok) await handleAPIError(response);
    return await response.json();
  },
};

export default userService;
