// userController.js

import asyncHandler from '../asyncHandler.js';
import ApiError from '../model/ApiError.js';
import User from '../model/user.model.js';     // Our fixed User model
import uploadFile from '../model/cloudnary.js'; // If you use Cloudinary for uploads
import bcrypt from 'bcryptjs';                 // Use bcryptjs consistently

// (A) Helper function to compare raw password with hashed password
const matchPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// (B) Function to generate and refresh tokens
const refreshAndAccessTokenGenerator = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.accessToken;  // or generate a new one if you store it differently
    const refreshToken = user.refreshToken;

    // If you store tokens on the user document, update them:
    user.refreshToken = refreshToken; 
    await user.save({ validateBeforeSave: true });

    return { refreshToken, accessToken };
  } catch (err) {
    console.log(err);
    throw new ApiError(500, `Error generating tokens: ${err.message}`);
  }
};

// (C) Sign-in function
const signinuser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(403, 'Fields are empty');
  }

  const user = await User.findOne({ email: email }); 
  if (!user) {
    throw new ApiError(403, 'User not found');
  }

  // Compare raw password with the stored hashed password
  const correctPass = await matchPassword(password, user.password);
  if (!correctPass) {
    throw new ApiError(403, 'Incorrect password');
  }

  // Example: if you store tokens in user document, or if you use user.generateToken()
  const { refreshToken, accessToken } = await refreshAndAccessTokenGenerator(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json({
      success: true,
      message: "User logged in",
      accessToken,
      refreshToken
    });
});

// (D) Register function
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    throw new ApiError(400, "All fields (name, email, password) are required.");
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  if (!trimmedName || !trimmedEmail || !trimmedPassword) {
    throw new ApiError(400, "All fields must not be empty.");
  }

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

  // If needed, handle image uploads with Cloudinary
  // const avatarLocal = req.files?.avatar[0]?.path;
  // if (!avatarLocal) {
  //   throw new ApiError(400, 'Avatar image is required.');
  // }
  // const avatarOnCloudinary = await uploadFile(avatarLocal);

  // Hash the password with bcryptjs

  // Create new user
  const user = await User.create({
    name: trimmedName,
    email: trimmedEmail,
    password: trimmedPassword  // just the raw password
    // avatar: avatarOnCloudinary,
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

// (E) Logout function
const `logout` = asyncHandler(async (req, res) => {
  // Example: if you store tokens on user doc, remove them
  await User.findByIdAndUpdate(req.user._id, {
    $set: { accessToken: undefined }
  }, { new: true });

  // Clear cookies
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  return res
    .status(200)
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json({
      success: true,
      message: "User logged out"
    });
});

export {
  registerUser,
  signinuser,
  logout
};
