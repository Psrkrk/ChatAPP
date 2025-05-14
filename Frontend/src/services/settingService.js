// import axios from "axios";

// const API_BASE_URL = "http://localhost:5000/api/v1";

// // Helper to get auth headers
// const getAuthHeaders = () => {
//   const token = localStorage.getItem("authToken");
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
// };

// // Block a user by ID
// export const blockUser = async (userId) => {
//   const url = `${API_BASE_URL}/block/${userId}`;
//   const response = await axios.put(url, {}, getAuthHeaders());
//   return response.data;
// };

// // Unblock a user by ID
// export const unblockUser = async (userId) => {
//   const url = `${API_BASE_URL}/unblock/${userId}`;
//   const response = await axios.put(url, {}, getAuthHeaders());
//   return response.data;
// };

// // Get all blocked users
// export const getBlockedUsers = async () => {
//   const url = `${API_BASE_URL}/blocked-users`;
//   const response = await axios.get(url, getAuthHeaders());
//   return response.data;
// };
