import { Router } from "express";
import * as academicYearController from "../controllers/academicYearController.js";

const router = Router({ mergeParams: true });

router.get("/", academicYearController.getAcademicYears);
router.get("/current", academicYearController.getCurrentAcademicYear);
router.post("/", academicYearController.createAcademicYear);
router.put("/:id", academicYearController.updateAcademicYear);
router.delete("/:id", academicYearController.deleteAcademicYear);

export default router;
