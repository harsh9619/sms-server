import { Router } from "express";
import schoolRoutes from "./schoolRoutes.js";
import studentRoutes from "./studentRoutes.js";
import teacherRoutes from "./teacherRoutes.js";
import classRoutes from "./classRoutes.js";
import subjectRoutes from "./subjectRoutes.js";
import attendanceRoutes from "./attendanceRoutes.js";
import userRoutes from "./userRoutes.js";
import feeRoutes from "./feeRoutes.js";
import salaryRoutes from "./salaryRoutes.js";
import timetableRoutes from "./timetableRoutes.js";
import homeworkRoutes from "./homeworkRoutes.js";
import noticeRoutes from "./noticeRoutes.js";
import markRoutes from "./markRoutes.js";

const router = Router();

// Mount routes
router.use("/", schoolRoutes);
router.use("/api/students", studentRoutes);
router.use("/api/teachers", teacherRoutes);
router.use("/api/classes", classRoutes);
router.use("/api/subjects", subjectRoutes);
router.use("/api/attendance", attendanceRoutes);
router.use("/api/users", userRoutes);
router.use("/api/fees", feeRoutes);
router.use("/api/salaries", salaryRoutes);
router.use("/api/timetables", timetableRoutes);
router.use("/api/homework", homeworkRoutes);
router.use("/api/notices", noticeRoutes);
router.use("/api/marks", markRoutes);

export default router;
