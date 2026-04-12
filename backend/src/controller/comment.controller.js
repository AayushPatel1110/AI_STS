import { Comment } from "../models/comment.model.js";
import { Ticket } from "../models/ticket.model.js";
import { User } from "../models/user.model.js";

export const createComment = async (req, res) => {
    try {
        const { content, ticketId } = req.body;
        const authState = typeof req.auth === 'function' ? req.auth() : req.auth;
        const clerkId = authState?.userId;

        if (!clerkId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findOne({ clerkId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        const newComment = new Comment({
            content,
            userId: user._id,
            ticketId,
        });

        await newComment.save();

        // Populate user info for the response
        const populatedComment = await Comment.findById(newComment._id).populate("userId", "fullname username imageUrl role clerkId");

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getCommentsByTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const comments = await Comment.find({ ticketId })
            .populate("userId", "fullname username imageUrl role clerkId")
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const toggleAuthorLike = async (req, res) => {
    try {
        const { commentId } = req.params;
        const authState = typeof req.auth === 'function' ? req.auth() : req.auth;
        const clerkId = authState?.userId;

        if (!clerkId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const comment = await Comment.findById(commentId).populate("ticketId");
        if (!comment) {
             return res.status(404).json({ message: "Comment not found" });
        }

        // Check if current user is the author of the ticket
        const ticket = comment.ticketId;
        const user = await User.findOne({ clerkId });
        
        if (!user || ticket.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Only the ticket author can like comments" });
        }

        comment.authorLiked = !comment.authorLiked;
        await comment.save();

        res.status(200).json(comment);
    } catch (error) {
        console.error("Error toggling author like:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
