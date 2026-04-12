import { Router } from "express";
import { createTicket, getAllTickets, toggleLike, getProfileTickets, updateTicket, deleteTicket, updateTicketStatus, getTicketById } from "../controller/ticket.controller.js";
import { requireAuth } from "@clerk/express";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/",  getAllTickets);
router.get("/:id", getTicketById);
router.post("/create", requireAuth(), createTicket);
router.patch("/:id/like", requireAuth(), toggleLike);
router.get("/profile/:userId", getProfileTickets);
router.delete("/:id", requireAuth(), deleteTicket);
router.put("/:id", requireAuth(), updateTicket);
router.patch("/:id/status", requireAuth(), updateTicketStatus);

export default router;