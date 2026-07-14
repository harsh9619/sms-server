import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";
const router = Router({ mergeParams: true });
router.get("/", authenticate, userController.getUsers);
router.post("/", authenticate, userController.createUser);
router.put("/:id", authenticate, userController.updateUser);
router.delete("/:id", authenticate, userController.deleteUser);
export default router;
