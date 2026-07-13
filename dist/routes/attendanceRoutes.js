import { Router } from "express";
import * as attendanceController from "../controllers/attendanceController.js";
const router = Router({ mergeParams: true });
router.get("/", attendanceController.getAttendance);
export default router;
