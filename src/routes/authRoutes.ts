import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/", authController.login);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.me);

export default router;
