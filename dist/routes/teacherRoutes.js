import { Router } from "express";
import * as teacherController from "../controllers/teacherController.js";
const router = Router();
router.get("/", teacherController.getTeachers);
export default router;
