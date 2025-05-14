import { toast } from "react-toastify";

// ⛳ Use environment variable for deployment safety
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

// ⛽ Token getter (you can adapt for cookies/session later)
const getAuthToken = () => localStorage.getItem("authToken");

const handleAPIError = async (response) => {
  let errorMessage = "Something went wrong";
  try {
    const data = await response.json();
    errorMessage = data.error || data.message || errorMessage;
  } catch (_) {
    // If not JSON, log the raw response body to debug
    console.error("API Error (non-JSON):", response);
  }
  throw new Error(errorMessage);
};

const userService = {
  getAllUsers: async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token missing");

      const response = await fetch(`${API_BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  updateProfile: async ({ fullname, profileImage }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token missing");

      const formData = new FormData();
      if (fullname) formData.append("fullname", fullname);
      if (profileImage) formData.append("profileImage", profileImage);

      const response = await fetch(`${API_BASE_URL}/user/update-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do not set Content-Type manually when using FormData
        },
        body: formData,
      });

      if (!response.ok) await handleAPIError(response);

      const result = await response.json();

      // ✅ Only show toast if name or image changed
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
};

export default userService;
