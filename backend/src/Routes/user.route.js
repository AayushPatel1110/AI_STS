import { Router } from "express";
import * as userController from "../controller/user.controller.js";

const router = Router();

router.get("/",  userController.getUsers);
router.get("/profile/:id",  userController.getUserProfile);


export default router;