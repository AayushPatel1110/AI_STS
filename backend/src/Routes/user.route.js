import { Router } from "express";
import * as userController from "../controller/user.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/",  userController.getUsers);


export default router;