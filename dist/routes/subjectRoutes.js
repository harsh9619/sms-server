import { Router } from "express";
import * as subjectController from "../controllers/subjectController.js";
const router = Router({ mergeParams: true });
router.get("/", subjectController.getSubjects);
router.get("/masters", subjectController.getSubjectMasters);
router.get("/with-teachers", subjectController.getSubjectsWithTeachers);
router.post("/sync-class", subjectController.syncClassSubjects);
router.put("/assign-teacher", subjectController.assignSubjectTeacher);
export default router;
