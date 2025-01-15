import { Router } from "express";
import { registerUser, signinuser, logout } from "../controllers/User.controller.js";
import upload from "../middleware/multer.middleware.js";
import { verifyJwt } from "../middleware/logout.user.js";

const router = Router();

// Register User Route
router.route("/register").post(
  // upload.fields([
  //   { name: "avatar", maxCount: 2 }, // Correct structure
  // ]),
  registerUser
);

// Login Route
router.route("/login").post(signinuser);

router.post('/test', (req, res) => {
  res.send('Test route works!');
});

router.post('/test', (req, res) => res.send('Test route works!'));
// Logout Route
router.route("/logout").post(verifyJwt, logout); // Added leading '/'
export default router;
