import { toast } from "react-toastify";

// Use environment variable for deployment safety
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

// Token getter (assumes token is stored in localStorage)
const getAuthToken = () => localStorage.getItem("authToken") || null;

// Centralized API error handler
const handleAPIError = async (response) => {
  let errorMessage = `API error: ${response.status} ${response.statusText}`;
  try {
    const data = await response.json();
    errorMessage = data.error || data.message || errorMessage;
  } catch (_) {
    console.error("API Error (non-JSON response):", response);
  }
  throw new Error(errorMessage);
};

const userService = {
  // Get all users (GET /user)
  getAllUsers: async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token missing");

      const response = await fetch(`${API_BASE_URL}/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) await handleAPIError(response);
      return await response.json();
    } catch (error) {
      toast.error(error.message || "Error fetching users");
      console.error("getAllUsers error:", error);
      throw error;
    }
  },

  // Update user profile (PUT /user/update-profile)
  updateProfile: async ({ fullname, profileImage }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token missing");

      const formData = new FormData();
      formData.append("fullname", fullname);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await fetch(`${API_BASE_URL}/user/update-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) await handleAPIError(response);

      const result = await response.json();

      console.log("updateProfile result:", result);

      if (result.message?.toLowerCase().includes("updated")) {
        toast.success(result.message || "Profile updated successfully");
      }

      return result;
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
      console.error("updateProfile error:", error);
      throw error;
    }
  },

  // Delete user (DELETE /user/delete)
  deleteUser: async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token missing");

      const response = await fetch(`${API_BASE_URL}/user/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) await handleAPIError(response);

      const result = await response.json();

      console.log("deleteUser result:", result);

      if (result.message?.toLowerCase().includes("deleted")) {
        toast.success(result.message || "User deleted successfully");
      }

      return result;
    } catch (error) {
      toast.error(error.message || "Failed to delete user");
      console.error("deleteUser error:", error);
      throw error;
    }
  },
};

// Export userService
export default userService;