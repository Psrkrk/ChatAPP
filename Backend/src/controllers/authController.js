import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";



dotenv.config();


// Register API (Supports profile image upload)
export const Register = async (req, res) => {
  try {
    const { email, password, fullname, userRole = "user" } = req.body;
    const profileImage = req.file ? `/upload/${req.file.filename}` : ""; // Store image path

    if (!email || !password || !fullname) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Check if user already exists
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userModel.create({
      fullname,
      password: hashedPassword,
      email,
      userRole,
      profileImage, // Save file path in DB
      
    });

    if (user) {
      return res.status(201).json({
        message: "User registered successfully!", // ✅ Success message
        fullname: user.fullname,
        email: user.email,
        userid: user._id,
        userRole: user.userRole,
        profileImage: user.profileImage ? `http://localhost:5000${user.profileImage}` : "",
        token: generateToken(user, res),
      });
    } else {
      return res.status(500).json({ message: "User registration failed." });
    }
    
  } catch (err) {
    console.error("Error in user registration:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Login API (Returns profile image)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "email not match with the database" });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // 3. Generate token and set cookie
    const token = generateToken(user, res); // This sets the cookie automatically

    // 4. Return user data and token
    return res.json({
      message: "Login successful",
      fullname: user.fullname,
      email: user.email,
      userid: user._id,
      userRole: user.userRole,
      profileImage: user.profileImage 
        ? `${req.protocol}://${req.get('host')}${user.profileImage}`
        : "",
      token: token, // The generated JWT
    });

  } catch (err) {
    console.error("Error during login:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Logout API


export const Logout = async (req, res) => {
  try {
    res.clearCookie("token", { 
      httpOnly: true, 
      secure: true, 
      sameSite: "None"
    });

    return res.status(200).json({ message: "User logged out successfully." });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


// forgot password 
// Store OTPs in-memory (consider using DB in production)
const otpStore = new Map();

// 📌 1️⃣ Send OTP to Email
export const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP with expiration (valid for 15 mins)
    otpStore.set(email, { otp, expiry: Date.now() + 15 * 60 * 1000 });

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email message
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Dear User,

Your One-Time Password (OTP) for password reset is:  ${otp}.

This OTP is valid for 15 minutes and can only be used once to reset your password. For security reasons, do not share this OTP with anyone.

If you did not request this password reset, please ignore this message or contact support immediately.

Best regards,
Pankaj Suman`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// 📌 2️⃣ Verify OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    const storedOTP = otpStore.get(email);
    if (!storedOTP || storedOTP.expiry < Date.now()) {
      return res.status(400).json({ error: "OTP expired or invalid" });
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({ error: "Incorrect OTP" });
    }

    // Generate a JWT token for security (valid for 15 minutes)
    const token = jwt.sign({ email }, process.env.JWT_TOKEN, { expiresIn: "15m" });

    otpStore.delete(email); // Remove OTP after successful verification
    res.status(200).json({ message: "OTP verified successfully", token });
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const userId = req.user.id; // Extract userId from token payload

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ error: "New password and confirm password are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "New password and confirm password should match" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
