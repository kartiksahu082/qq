import mongoose from "mongoose";
import bcrypt from 'bcryptjs'; // bcrypt for password hashing
import jwt from 'jsonwebtoken'; // jsonwebtoken for generating JWT tokens

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Pre-save hook to hash password before saving
userSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    bcrypt.hash(this.password, 8, (err, hashedPassword) => {
        if (err) return next(err);
        this.password = hashedPassword;
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
        { _id: this._id, name: this.name },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );
};

// Method to generate a refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id, name: this.name },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
    );
};

// Exporting the User model correctly using default export
export default mongoose.model('User', userSchema);
