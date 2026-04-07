import { Router } from "express";
import { createTicket, getAllTickets, toggleLike, getProfileTickets } from "../controller/ticket.controller.js";
import { requireAuth } from "@clerk/express";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/",  getAllTickets);
router.post("/create", requireAuth(), createTicket);
router.patch("/:id/like", requireAuth(), toggleLike);
router.get("/profile/:userId", getProfileTickets);


export default router;  