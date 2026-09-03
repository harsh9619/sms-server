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
import authRoutes from "./authRoutes.js";
import academicYearRoutes from "./academicYearRoutes.js";
const router = Router();
// Mount general/un-scoped routes directly
router.use("/", schoolRoutes);
router.use("/auth", authRoutes);
// Create sub-router for school-scoped endpoints that merges URL params
const schoolScopedRouter = Router({ mergeParams: true });
schoolScopedRouter.use("/students", studentRoutes);
schoolScopedRouter.use("/teachers", teacherRoutes);
schoolScopedRouter.use("/classes", classRoutes);
schoolScopedRouter.use("/subjects", subjectRoutes);
schoolScopedRouter.use("/attendance", attendanceRoutes);
schoolScopedRouter.use("/users", userRoutes);
schoolScopedRouter.use("/fees", feeRoutes);
schoolScopedRouter.use("/salaries", salaryRoutes);
schoolScopedRouter.use("/timetables", timetableRoutes);
schoolScopedRouter.use("/homework", homeworkRoutes);
schoolScopedRouter.use("/notices", noticeRoutes);
schoolScopedRouter.use("/marks", markRoutes);
schoolScopedRouter.use("/academic-years", academicYearRoutes);
// Mount the school-scoped router under '/api/:schoolId'
router.use("/api/:schoolId", schoolScopedRouter);
export default router;
