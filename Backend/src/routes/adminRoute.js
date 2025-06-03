import express from 'express';
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js"; // ✅ include .js extension

const router = express.Router();

router.get('/admin/data', adminAuthMiddleware, (req, res) => {
  res.json({ message: 'Welcome, Admin!', admin: req.user });
});

export default router;
