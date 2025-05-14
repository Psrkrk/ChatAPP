// src/services/chatService.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1";

// Get auth token helper
const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

// Send message
export const sendMessageAPI = async (receiverId, messageData) => {
  const response = await axios.post(
    `${BASE_URL}/message/send/${receiverId}`,
    messageData,
    getAuthHeader()
  );
  return response.data;
};

// Get received messages
export const getMessagesAPI = async (receiverId) => {
  const response = await axios.get(
    `${BASE_URL}/message/get/${receiverId}`,
    getAuthHeader()
  );
  return response.data;
};
