import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const messageControlService = {
  // Delete a single message by ID
  deleteMessage: async (messageId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/message/delete/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  // Delete multiple messages by IDs
  deleteMessages: async (messageIds) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/message/delete`, {
        data: { messageIds },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting messages:', error);
      throw error;
    }
  },

  // Delete a conversation by userId and receiverId
  deleteConversation: async ({ userId, receiverId }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/conversation/delete`, {
        data: { userId, receiverId },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },
};

export default messageControlService;