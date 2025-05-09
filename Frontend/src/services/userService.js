import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:5000/api/v1";
const getAuthToken = () => localStorage.getItem("authToken");

const userService = {
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

  updateProfile: async ({ fullname, email, profileImage }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");

      // Prepare form data
      const formData = new FormData();
      if (fullname) formData.append("fullname", fullname);
      if (email) formData.append("email", email);
      if (profileImage) formData.append("profileImage", profileImage); // this must match backend `upload.single("profileImage")`

      const response = await fetch(`${API_BASE_URL}/user/update-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // ❌ Do not set Content-Type manually for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errRes = await response.json();
        throw new Error(errRes.error || "Failed to update profile");
      }

      const result = await response.json();
      toast.success("Profile updated successfully");
      return result;
    } catch (error) {
      toast.error(error.message || "Error updating profile");
      throw error;
    }
  },
};

export default userService;

