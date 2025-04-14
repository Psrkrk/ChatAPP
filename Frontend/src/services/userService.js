import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:5000/api/v1";

const getAuthToken = () => localStorage.getItem("authToken");

const userService = {
  // Fetch all users
  getAllUsers: async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");
      const response = await fetch(`${API_BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      return await response.json();
    } catch (error) {
      toast.error(error.message || "Error fetching users");
      throw error;
    }
  },

  // Fetch specific user profile
  getUserProfile: async (userId) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");
      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch profile");
      return await response.json();
    } catch (error) {
      toast.error(error.message || "Error fetching profile");
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userId, data) => {
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
      return await response.json();
    } catch (error) {
      toast.error(error.message || "Error updating profile");
      throw error;
    }
  },

  // Update profile image
  updateProfileImage: async (userId, formData) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");
      const response = await fetch(`${API_BASE_URL}/update-profile-image`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // FormData for file upload
      });
      if (!response.ok) throw new Error("Failed to update profile image");
      return await response.json();
    } catch (error) {
      toast.error(error.message || "Error updating profile image");
      throw error;
    }
  },
};

export default userService;