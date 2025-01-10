import { Router } from "express";
import { registerUser ,signinuser,logout} from "../controllers/User.controller.js";
import upload from "../middleware/multer.middleware.js";
import { verifyJwt } from "../middleware/logout.user.js";

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

router.route("/login").post(signinuser)

router.route("logout").post(verifyJwt,logout)


export default router;
