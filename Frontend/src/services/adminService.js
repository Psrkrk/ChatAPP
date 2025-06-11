// src/services/adminService.js
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1/admin';

const getAdminData = async (token) => {
  const res = await axios.get(`${API_BASE}/data`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const getAllUsers = async (token) => {
  const res = await axios.get(`${API_BASE}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const deleteUser = async (userId, token) => {
  const res = await axios.delete(`${API_BASE}/delete`, {
    data: { userId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const adminService = {
  getAdminData,
  getAllUsers,
  deleteUser,
};

export default adminService;
