import express from 'express';
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";
import {
  getAllUsers as userGetAllUsers,
  deleteUser as userDeleteUser,
} from "../controllers/adminController.js";

const router = express.Router();

// Admin welcome route
router.get('/admin/data', adminAuthMiddleware, (req, res) => {
  res.json({ message: 'Welcome, Admin!', admin: req.user });
});

// Get all users (admin only)
router.get('/admin/users', adminAuthMiddleware, userGetAllUsers);

// Delete a user (admin only)
router.delete('/admin/user/:id', adminAuthMiddleware, userDeleteUser);

export default router;
