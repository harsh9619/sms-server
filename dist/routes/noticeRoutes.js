import { Router } from "express";
import * as noticeController from "../controllers/noticeController.js";
const router = Router();
router.get("/", noticeController.getNotices);
router.post("/", noticeController.createNotice);
router.put("/:id", noticeController.updateNotice);
router.delete("/:id", noticeController.deleteNotice);
export default router;
