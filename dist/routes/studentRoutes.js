import { Router } from "express";
import * as studentController from "../controllers/studentController.js";
const router = Router();
router.get("/", studentController.getStudents);
router.post("/", studentController.createStudent);
router.put("/:id", studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);
export default router;
