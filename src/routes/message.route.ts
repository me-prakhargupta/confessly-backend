import { Router } from "express";
import { optionalVerifyToken } from "../middlewares/auth.middleware.js";
import { sendMessage } from "../controllers/message.controller.js";

const router = Router();

router.route("/send").post(optionalVerifyToken, sendMessage);

export default router;