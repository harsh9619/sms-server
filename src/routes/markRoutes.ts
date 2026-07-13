import { Router } from "express";
import * as markController from "../controllers/markController.js";

const router = Router();

router.get("/", markController.getMarks);
router.post("/", markController.createOrUpdateMark);
router.put("/:id", markController.updateMark);
router.delete("/:id", markController.deleteMark);

export default router;
