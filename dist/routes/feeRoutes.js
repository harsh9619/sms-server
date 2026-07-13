import { Router } from "express";
import * as feeController from "../controllers/feeController.js";
const router = Router({ mergeParams: true });
router.get("/", feeController.getFees);
router.post("/", feeController.createFee);
router.put("/:id", feeController.updateFee);
router.delete("/:id", feeController.deleteFee);
export default router;
