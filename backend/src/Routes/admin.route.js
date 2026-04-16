import { Router } from "express";
import { getAllUsers, getStats, updateUserRole, deleteUser, restoreUser, getAllTickets, deleteTicket } from "../controller/admin.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/stats", protectRoute, requireAdmin, getStats);
router.get("/users", protectRoute, requireAdmin, getAllUsers);
router.get("/tickets", protectRoute, requireAdmin, getAllTickets);
router.patch("/users/:userId/role", protectRoute, requireAdmin, updateUserRole);
router.patch("/users/:userId/restore", protectRoute, requireAdmin, restoreUser);
router.delete("/users/:userId", protectRoute, requireAdmin, deleteUser);
router.delete("/tickets/:ticketId", protectRoute, requireAdmin, deleteTicket);

export default router;