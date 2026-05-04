import express from "express";
import { requireAuth } from "@clerk/express";
import { getUserNotifications, markAsRead, markSenderAsRead } from "../controller/notification.controller.js";

const router = express.Router();

router.get("/", requireAuth(), getUserNotifications);
router.patch("/mark-read", requireAuth(), markAsRead);
router.patch("/mark-read/:senderId", requireAuth(), markSenderAsRead);

export default router;
