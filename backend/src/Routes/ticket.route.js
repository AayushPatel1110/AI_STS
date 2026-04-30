import { Router } from "express";
import { createTicket, getAllTickets, toggleLike, getProfileTickets, updateTicket, deleteTicket, updateTicketStatus, getTicketById, updateAiResponse } from "../controller/ticket.controller.js";
import { requireAuth } from "@clerk/express";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/",  getAllTickets);
router.post("/create", requireAuth(), createTicket);
router.patch("/:id/like", requireAuth(), toggleLike);
router.get("/profile/:userId", getProfileTickets);
router.get("/:id", getTicketById);
router.delete("/:id", requireAuth(), deleteTicket);
router.put("/:id", requireAuth(), updateTicket);
router.patch("/:id/status", requireAuth(), updateTicketStatus);
router.patch("/:id/ai-response", requireAuth(), updateAiResponse);

export default router;