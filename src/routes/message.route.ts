import { Router } from "express";
import { sendMessageAnonymously } from "../controllers/message.controller.js";

const router = Router();
router.route("/send").post(sendMessageAnonymously);

export default router;