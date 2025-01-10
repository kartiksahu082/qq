import mongoose from "mongoose";
import bcrypt from 'bcryptjs';  // bcrypt for password hashing
import jwt from 'jsonwebtoken'; // jsonwebtoken for generating JWT tokens

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,  // Ensure unique username
    trim: true
  },
  avatar: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,  // Ensure unique email
    trim: true,
    lowercase: true // Enforce lowercase email
  },
  password: {
    type: String,
    required: true,
    minlength: 6  // Ensure password length is at least 6 characters
  }
}, { timestamps: true });

// Pre-save hook to hash password before saving
userSchema.pre('save', function (next) {
  // If the password is not modified, skip hashing
  if (!this.isModified('password')) {
    return next();
  }

  // Hash the password before saving it
  bcrypt.hash(this.password, 10, (err, hashedPassword) => {
    if (err) return next(err);
    this.password = hashedPassword; // Store the hashed password
    next();
  });
});

// Method to match entered password with stored password
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate an access token
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { _id: this._id, name: this.name, username: this.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
  );
};

// Method to generate a refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id, name: this.name, username: this.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
  );
};

// Exporting the User model correctly using default export
export default mongoose.model('User', userSchema);
