import { Router } from "express";
import * as userController from "../controller/user.controller.js";
import { requireAuth } from "@clerk/express";

const router = Router();

router.get("/",  userController.getUsers);
router.get("/profile/:id",  userController.getUserProfile);
router.put("/profile/:id", requireAuth(), userController.updateUserProfile);

export default router;