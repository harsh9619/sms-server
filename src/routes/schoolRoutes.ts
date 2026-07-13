import { Router } from "express";
import * as schoolController from "../controllers/schoolController.js";

const router = Router();

router.get("/health", schoolController.getHealth);
router.get("/api/schools", schoolController.getSchools);

export default router;
