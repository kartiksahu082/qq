import asyncHandler from "../asyncHandler.js";
import ApiError from "../modle/ApiError.js";
import User from "../modle/user.modle.js";
import uploadFile from '../modle/cloudnary.js';

// Function to match password
const matchPassword = async (password) => {
  // Assuming password is hashed and using bcrypt for password comparison
  // You need to implement your own password matching logic here
  return true;  // Replace with actual password check logic
}

// Function to generate refresh and access tokens
const refreshAndAccessTokenGenerator = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accesstoken = user.accesstoken;
    const refreshtoken = user.refreshtoken;

    // Set refreshtoken again and save user
    user.refreshtoken = refreshtoken;
    await user.save({ validateBeforeSave: true });

    return { refreshtoken, accesstoken };
  } catch (err) {
    console.log(err);
    throw new ApiError(500, 'Error generating tokens');
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

  const correctpass = await matchPassword(password);

  if (!correctpass) {
    throw new ApiError(403, 'Incorrect password');
  }

  const { refreshtoken, accesstoken } = await refreshAndAccessTokenGenerator(user._id);

  const loginuser = await User.findById(user._id).select("-password -refreshtoken");

  const options = {
    httpOnly: true,
    secure: true
  };

  return res.status(200).cookie('refreshtoken', refreshtoken, options).json({
    refreshtoken
  }, "User logged in");
});

// Register function
const registerUser = asyncHandler(async (req, res) => {
  console.log("1111111:", req.body);

  const { name, email, password } = req.body;

  // Check for empty fields
  if ([email, name, password].some((item) => item?.trim() === "")) {
    throw new ApiError(403, "This field is empty");
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ name }, { email }]
  });

  if (existingUser) {
    throw new ApiError(402, "User already exists");
  }

  // Upload avatar and cover image
  const avatarLocal = req.files?.avatar[0]?.path;
  const coverPageLocal = req.files?.coverimg[0]?.path;

  if (!avatarLocal) {
    throw new ApiError(402, 'Avatar image not found');
  }

  const avatarOnCloudinary = await uploadFile(avatarLocal);

  if (!avatarOnCloudinary) {
    throw new ApiError(403, 'Avatar upload failed');
  }

  // Create the user
  const user = await User.create({
    name,
    email,
    password, // Assuming password should be hashed before storing
    avatar: avatarOnCloudinary,
  });

  // Fetch created user
  const createdUser = await User.findById(user._id).select("password");

  if (!createdUser) {
    throw new ApiError(501, 'User not found');
  }

  return res.status(201).json({
    createdUser
  });
});

// Logout function
const logout = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      accesstoken: undefined
    }
  }, { new: true });

  const options = {
    httpOnly: true,
    secure: true
  };

  res.status(200).clearCookie('accesstoken').clearCookie('refreshtoken').json(new ApiResponse(200, {}, "User logged out"));
});

// Export functions
export { registerUser, signinuser, logout };
