import { Router } from "express";
import * as salaryController from "../controllers/salaryController.js";

const router = Router();

router.get("/", salaryController.getSalaries);
router.post("/", salaryController.createSalary);
router.put("/:id", salaryController.updateSalary);
router.delete("/:id", salaryController.deleteSalary);

export default router;
