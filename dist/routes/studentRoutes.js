import { Router } from "express";
import * as studentController from "../controllers/studentController.js";
const router = Router({ mergeParams: true });
router.get("/", studentController.getStudents);
router.post("/", studentController.createStudent);
router.put("/:id", studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);
export default router;
