import { Router } from "express";
import { signupUser, signinUser, getMeUser, logoutUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

//User authtication routes
router.route("/signup").post(signupUser);
router.route("/signin").post(signinUser);
// router.route("/verify").post(verifyUser);

//User protect routes
router.route("/logout").post(verifyToken, logoutUser);

//Secured (Protected) Route
router.route("/me").get(verifyToken, getMeUser);
// router.route("/accept-message").patch(protect, acceptMessage);

export default router;