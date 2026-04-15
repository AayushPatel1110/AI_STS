import express from "express";
import { requireAuth } from "@clerk/express";
import { getUserNotifications, markAsRead } from "../controller/notification.controller.js";

const router = express.Router();

router.get("/", requireAuth(), getUserNotifications);
router.patch("/mark-read", requireAuth(), markAsRead);

export default router;
