import express from "express";
import { requireAuth } from "@clerk/express";
import { createComment, getCommentsByTicket, toggleAuthorLike } from "../controller/comment.controller.js";

const router = express.Router();

router.get("/:ticketId", getCommentsByTicket);
router.post("/create", requireAuth(), createComment);
router.patch("/:commentId/author-like", requireAuth(), toggleAuthorLike);

export default router;
