// src/services/userService.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

// Helper: Get auth token
const getAuthToken = () => localStorage.getItem("authToken");

// Helper: Centralized API error handler
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
  // ✅ Get all users (requires auth)
  getAllUsers: async () => {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication token missing");

    const response = await fetch(`${API_BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) await handleAPIError(response);
    return await response.json();
  },

  // ✅ Update user profile (name and/or profile image)
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
        // Don't set 'Content-Type' manually when sending FormData
      },
      body: formData,
    });

    if (!response.ok) await handleAPIError(response);
    return await response.json();
  },
};

export default userService;
