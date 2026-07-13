import { Router } from "express";
import * as attendanceController from "../controllers/attendanceController.js";

const router = Router();

router.get("/", attendanceController.getAttendance);

export default router;
