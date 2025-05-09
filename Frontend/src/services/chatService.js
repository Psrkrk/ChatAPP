// chatService.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1"; // Adjust your base URL if needed

// Send a message function
export const sendMessage = async (messageData, receiverId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(
      `${BASE_URL}/message/send/${receiverId}`,
      messageData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Make sure the response has the correct data structure (e.g., single message or array)
  } catch (error) {
    throw error; // Handle any error and propagate
  }
};

// Fetch received messages function
export const receivedMessages = async (receiverId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(
      `${BASE_URL}/message/get/${receiverId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Ensure the server returns an array of messages
  } catch (error) {
    throw error;
  }
};

export default {
  sendMessage,
  receivedMessages,
};
