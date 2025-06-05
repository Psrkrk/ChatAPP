// adminController.js
import {
  getAllUsers as userGetAllUsers,
  deleteUserAccount as userDeleteUser,
} from './userController.js';

/**
 * Checks if user is admin. Only needed if extra layer beyond middleware is required.
 */
const checkAdmin = (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ message: 'Access denied: Admins only' });
    return false;
  }
  return true;
};

/**
 * GET /admin/users
 */
export const getAllUsers = async (req, res) => {
  if (!checkAdmin(req, res)) return;
  await userGetAllUsers(req, res);
};

/**
 * DELETE /admin/user/:id
 */
export const deleteUser = async (req, res) => {
  if (!checkAdmin(req, res)) return;
  await userDeleteUser(req, res);
};
