import jwt from "jsonwebtoken";

const generateToken = (user, res) => {
  try {
    // Validate required parameters
    if (!res) {
      throw new Error("Response object (res) is required in generateToken");
    }
    if (!user || !user._id) {
      throw new Error("User object with _id is required");
    }
    if (!process.env.JWT_TOKEN) {
      throw new Error("JWT_TOKEN environment variable is not set");
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_TOKEN,
      { expiresIn: "1d" }
    );

    // Set cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    });

    return token;
  } catch (error) {
    console.error("Token generation failed:", error.message);
    throw error; // Re-throw the error for the calling function to handle
  }
};

export default generateToken;