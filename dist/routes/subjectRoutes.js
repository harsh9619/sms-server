import { Router } from "express";
import * as subjectController from "../controllers/subjectController.js";
const router = Router({ mergeParams: true });
router.get("/", subjectController.getSubjects);
export default router;
