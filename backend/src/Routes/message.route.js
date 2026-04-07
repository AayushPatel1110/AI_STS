import { Router } from "express";
import { getMessages, sendMessage } from "../controller/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAuth } from "@clerk/express";

const router = Router();

router.get("/:ticketId", requireAuth() , getMessages);
router.post("/", requireAuth() , sendMessage);

export default router;

