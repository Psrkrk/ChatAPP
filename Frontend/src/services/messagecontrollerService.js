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

  // Delete a conversation by ID
  deleteConversation: async (conversationId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/conversation/delete/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },
};

export default messageControlService;
