import { Router } from "express";
import * as homeworkController from "../controllers/homeworkController.js";
const router = Router({ mergeParams: true });
router.get("/", homeworkController.getHomework);
router.post("/", homeworkController.createHomework);
router.put("/:id", homeworkController.updateHomework);
router.delete("/:id", homeworkController.deleteHomework);
export default router;
