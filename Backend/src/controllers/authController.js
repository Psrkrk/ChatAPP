import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import path from "path";

// Register API (Supports profile image upload)
export const Register = async (req, res) => {
  try {
    const { email, password, fullname, userRole = "user" } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : ""; // Store image path

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
