import asyncHandler from "../asyncHandler.js";
import ApiError from "../modle/ApiError.js";
import User from "../modle/user.modle.js";
import uploadFile from '../modle/cloudnary.js'

const registerUser = asyncHandler(async (req, res) => {
  console.log("1111111:", req.body);

  const { name, email, password } = req.body;

  // Check for empty fields
  if ([email, name, password].some((item) => item?.trim() === "")) {
    throw new ApiError(403, "this field are empty");
  }

  // Check if user already exists
  const existinguser = await User.findOne({
    $or: [{ name }, { email }],
  });

  if (existinguser) {
    throw new ApiError(402, "user existed");
  }

  // Upload avatar and cover image
  const avatarlocal = req.files?.avatar[0]?.path;
  const coverpagelocal = req.files?.coverimg[0]?.path;

  if (!avatarlocal) {
    throw new ApiError(402, 'avatar image not found');
  }

  const avataroncloudinary = await uploadFile(avatarlocal);

  if (!avataroncloudinary) {
    throw new ApiError(403, 'avatar upload failed');
  }

  // Create the user
  const user = await User.create({
    name,
    email,
    password, // Assuming password should be hashed before storing
    avatar: avataroncloudinary,
  });

  // Fetch created user
  const createdUser = await User.findById(user._id).select("password");

  if (!createdUser) {
    throw new ApiError(501, 'user not found');
  }

  return res.status(201).json({
    createdUser
  });
});

export { registerUser };
