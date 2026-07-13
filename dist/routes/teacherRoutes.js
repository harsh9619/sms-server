import { Router } from "express";
import * as teacherController from "../controllers/teacherController.js";
const router = Router({ mergeParams: true });
router.get("/", teacherController.getTeachers);
export default router;
