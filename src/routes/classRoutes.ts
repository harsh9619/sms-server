import { Router } from "express";
import * as classController from "../controllers/classController.js";

const router = Router({ mergeParams: true });

router.get("/", classController.getClasses);
router.post("/", classController.createClass);
router.put("/:id", classController.updateClass);
router.delete("/:id", classController.deleteClass);

export default router;
