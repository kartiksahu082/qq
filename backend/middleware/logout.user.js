import asyncHandler from "../asyncHandler.js";  // Ensure the path is correct
import jwt from "jsonwebtoken";
import ApiError from "../model/ApiError.js";  // Fixed typo in "model"
import User from "../model/user.model.js";  // Fixed typo in "model"

// Verify JWT middleware
export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    // Get the token from cookies or Authorization header
    const token = req.cookies.accesstoken || req.headers['authorization']?.replace('Bearer ', '');  // Fixed cookie name

    if (!token) {
      throw new ApiError(403, "Token is not found");
    }

    // Verify the JWT token using the secret from .env
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user based on the decoded token
    const user = await User.findById(decodedToken._id).select('-password -accessToken');

    if (!user) {
      throw new ApiError(403, "User not found");
    }

    // Attach the user to the request object
    req.user = user;

    // Call next middleware or route handler
    next();
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);
    
    // Throw a custom error
    throw new ApiError(403, error.message || "Token verification failed");
  }
});
