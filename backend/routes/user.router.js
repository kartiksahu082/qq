import { Router } from "express";
import { registerUser } from "../controllers/User.controller.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      avatar: {
        name: "avatar",
        maxCount: 2,
      }
    },
  ]),
  registerUser
);



export default router;
