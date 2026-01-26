import { Router } from "express";
import { signupUser, signinUser, logoutUser, verifyUser, acceptMessage } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(signupUser);
router.route("/signin").post(signinUser);
router.route("/verify").post(verifyUser);

//Secured (Protected) Route
router.route("/logout").post(protect, logoutUser);
router.route("/accept-message").patch(protect, acceptMessage);

export default router;