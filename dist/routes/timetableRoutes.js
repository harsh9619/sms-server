import { Router } from "express";
import * as timetableController from "../controllers/timetableController.js";
const router = Router({ mergeParams: true });
router.get("/", timetableController.getTimetables);
router.post("/", timetableController.createTimetable);
router.put("/:id", timetableController.updateTimetable);
router.delete("/:id", timetableController.deleteTimetable);
export default router;
