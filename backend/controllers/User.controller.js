import asyncHandler from "../asyncHandler.js";  // Correct import
import ApiError from "../model/ApiError.js";  // Fixed typo in "model"
import User from "../model/user.model.js";  // Fixed typo in "model"
import uploadFile from '../model/cloudnary.js';  // Ensure the path is correct

import bcrypt from 'bcryptjs';  // bcrypt for hashing passwords

// Function to match password
const matchPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Function to generate refresh and access tokens
const refreshAndAccessTokenGenerator = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.accessToken;  // Correct token name
    const refreshToken = user.refreshToken;

    user.refreshToken = refreshToken;  // Set refresh token
    await user.save({ validateBeforeSave: true });

    return { refreshToken, accessToken };
  } catch (err) {
    console.log(err);
    throw new ApiError(500, `Error generating tokens: ${err.message}`);
  }
};

// Signin function
const signinuser = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name) {
    throw new ApiError(403, 'Fields are empty');
  }

  const user = await User.findOne({
    $or: [{ username: name }, { email }]
  });

  if (!user) {
    throw new ApiError(403, 'User not found');
  }

  const correctPass = await matchPassword(password, user.password);

  if (!correctPass) {
    throw new ApiError(403, 'Incorrect password');
  }

  const { refreshToken, accessToken } = await refreshAndAccessTokenGenerator(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',  // Only secure cookies in production
  };

  return res.status(200)
    .cookie('accessToken', accessToken, options)  // Store access token in cookie
    .cookie('refreshToken', refreshToken, options)  // Store refresh token in cookie
    .json({
      success: true,
      message: "User logged in",
      accessToken,
      refreshToken
    });
});

// Register function
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Ensure all fields are provided and are not undefined or null
  if (!name || !email || !password) {
    throw new ApiError(400, "All fields (name, email, password) are required.");
  }

  // Ensure fields are strings and trim them
  const trimmedName = typeof name === 'string' ? name.trim() : '';
  const trimmedEmail = typeof email === 'string' ? email.trim() : '';
  const trimmedPassword = typeof password === 'string' ? password.trim() : '';

  // Validate if fields are still non-empty after trimming
  if (!trimmedName || !trimmedEmail || !trimmedPassword) {
    throw new ApiError(400, "All fields (name, email, password) must not be empty.");
  }

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(trimmedEmail)) {
    throw new ApiError(400, "Invalid email format.");
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ name: trimmedName }, { email: trimmedEmail }]
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  // Check for file uploads (avatar and cover image)
  const avatarLocal = req.files?.avatar[0]?.path;
  const coverPageLocal = req.files?.coverimg[0]?.path;

  if (!avatarLocal) {
    throw new ApiError(400, 'Avatar image is required.');
  }

  // Upload avatar to Cloudinary
  const avatarOnCloudinary = await uploadFile(avatarLocal);

  if (!avatarOnCloudinary) {
    throw new ApiError(403, 'Avatar upload failed');
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

  // Create new user
  const user = await User.create({
    name: trimmedName,
    email: trimmedEmail,
    password: hashedPassword,
    avatar: avatarOnCloudinary,
  });

  // Return created user (without password)
  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, 'User creation failed');
  }

  return res.status(201).json({
    success: true,
    createdUser
  });
});


// Logout function
const logout = asyncHandler(async (req, res) => {
  // Remove the accessToken from the user
  await User.findByIdAndUpdate(req.user._id, {
    $set: { accessToken: undefined }
  }, { new: true });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',  // Only secure cookies in production
  };

  res.status(200)
    .clearCookie('accessToken')  // Clear access token cookie
    .clearCookie('refreshToken')  // Clear refresh token cookie
    .json({
      success: true,
      message: "User logged out"
    });
});

export { registerUser, signinuser, logout };
