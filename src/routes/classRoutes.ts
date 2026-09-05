import { Router } from "express";
import * as classController from "../controllers/classController.js";

const router = Router({ mergeParams: true });

router.get("/", classController.getClasses);
router.get("/masters", classController.getClassMasters);
router.post("/", classController.createClass);
router.post("/batch", classController.createClassesBatch);
router.put("/:id", classController.updateClass);
router.delete("/:id", classController.deleteClass);

export default router;
