const jwt = require('jsonwebtoken');
import dotenv from "dotenv"
const User = require('../models/User'); // Adjust the path to your User model

const userAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'User Not Found' });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    // Optionally, you can verify the user from the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User Not Found' });
    }
    // Attaching user info to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({ message: 'User Not Found' });
  }
};

module.exports = userAuthMiddleware;