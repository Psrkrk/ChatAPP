import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const verifyToken = async (req, res, next) => {
    try {
        // Extract token from multiple sources
        const token = 
            req.header("Authorization")?.split(" ")[1] || // Bearer Token
            req.cookies?.token ||  // Cookie Token
            req.query?.token;  // Query Parameter Token

        if (!token) {
            return res.status(401).json({ 
                success: false,
                error: "Access Denied: No token provided",
                suggestion: "Include an Authorization header: 'Bearer <token>'"
            });
        }

        if (!process.env.JWT_TOKEN) {
            console.error("❌ ERROR: JWT_SECRET is missing in environment variables.");
            return res.status(500).json({ 
                success: false,
                error: "Internal Server Error: JWT configuration missing"
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);

        // Debugging in development mode
        if (process.env.NODE_ENV === "development") {
            console.log("✅ Decoded JWT:", decoded);
        }

        if (!decoded || !decoded.id) {
            return res.status(401).json({
                success: false,
                error: "Invalid token: Missing user ID"
            });
        }

        // Attach user data to request
        req.user = { _id: decoded.id, ...decoded };  // Ensure `_id` is accessible
        next();

    } catch (error) {
        console.error("❌ JWT Verification Error:", error.message);

        let errorMessage = "Unauthorized: Invalid token";
        if (error.name === "TokenExpiredError") {
            errorMessage = "Unauthorized: Token has expired";
        } else if (error.name === "JsonWebTokenError") {
            errorMessage = "Unauthorized: Malformed token";
        }

        return res.status(401).json({ 
            success: false,
            error: errorMessage,
            ...(process.env.NODE_ENV === "development" && { details: error.message })
        });
    }
};

export default verifyToken;
