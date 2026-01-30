import { Router } from "express";
import { optionalVerifyToken } from "../middlewares/auth.middleware.js";
import { shareThought } from "../controllers/thought.controller.js";

const router = Router();

router.route("/share").post(optionalVerifyToken, shareThought);

export default router;