import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

export const registerUser = async ({ fullname, email, password, profileImage }) => {
  try {
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profileImage", profileImage);

    const response = await axios.post(`${API_URL}/register`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const logoutUser = async () => {
  try {
    return Promise.resolve("Logged out");
  } catch (error) {
    throw error.response?.data || { message: "Logout failed" };
  }
};

// Default export (optional, if still needed)
const authService = { registerUser, loginUser, logoutUser };
export default authService;