import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // Make sure this is userModel, not messageModel

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    if (user.userRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access only' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin Auth Middleware Error:', error.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

export default adminAuthMiddleware;
