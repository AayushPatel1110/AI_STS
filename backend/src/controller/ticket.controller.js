import { Ticket } from "../models/ticket.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { Notification } from "../models/notification.model.js";

// @desc    Get all tickets with user data
// @route   GET /api/tickets
export const getAllTickets = async (req, res) => {
    try {
        const ticketsData = await Ticket.find()
            .populate("userId", "fullname imageUrl clerkId role username isDeleted -_id")
            .populate("assignedTo", "fullname imageUrl clerkId role username -_id")
            .sort({ createdAt: -1 });

        const tickets = ticketsData.filter(ticket => ticket.userId && !ticket.userId.isDeleted);

        const ticketsWithCounts = await Promise.all(tickets.map(async (ticket) => {
            const commentCount = await Comment.countDocuments({ ticketId: ticket._id });
            const ticketObj = ticket.toObject();
            // Remove isDeleted before sending to client
            if (ticketObj.userId) delete ticketObj.userId.isDeleted;
            return { ...ticketObj, commentCount };
        }));

        res.status(200).json(ticketsWithCounts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get single ticket by ID
// @route   GET /api/tickets/:id
export const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await Ticket.findById(id)
            .populate("userId", "fullname imageUrl clerkId role username -_id")
            .populate("assignedTo", "fullname imageUrl clerkId role username -_id");
        
        if (!ticket) return res.status(404).json({ message: "Ticket not found" });
        
        const commentCount = await Comment.countDocuments({ ticketId: id });
        res.status(200).json({ ...ticket.toObject(), commentCount });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Create a new ticket
// @route   POST /api/tickets
export const createTicket = async (req, res) => {
    try {
        const { title, description, code } = req.body;
        const authState = typeof req.auth === 'function' ? req.auth() : req.auth;
        const clerkId = authState?.userId;
        const user = await User.findOne({ clerkId });
        if (!user) return res.status(404).json({ message: "User not found" });

        const newTicket = await Ticket.create({
            title,
            description,
            code,
            userId: user._id,
        });

        await newTicket.populate([
            { path: "userId", select: "fullname imageUrl clerkId role username" },
            { path: "assignedTo", select: "fullname imageUrl clerkId role username" }
        ]);

        res.status(201).json(newTicket);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Toggle Like on a ticket
// @route   PATCH /api/tickets/:id/like
export const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const authState = typeof req.auth === 'function' ? req.auth() : req.auth;
        const clerkId = authState?.userId;

        const user = await User.findOne({ clerkId });
        const ticket = await Ticket.findById(id);

        if (!ticket) return res.status(404).json({ message: "Ticket not found" });

        const hasLiked = ticket.likes.includes(clerkId);

        if (hasLiked) {
            ticket.likes = ticket.likes.filter(id => id !== clerkId);
        } else {
            ticket.likes.push(clerkId);
            
            // Notification logic
            if (ticket.userId.toString() !== user._id.toString()) {
                await Notification.create({
                    recipientId: ticket.userId,
                    senderId: user._id,
                    type: "like",
                    ticketId: ticket._id,
                    message: "reposted your issue."
                });
            }
        }

        await ticket.save();
        res.status(200).json({ likes: ticket.likes, hasLiked: !hasLiked });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get tickets for profile
// @route   GET /api/tickets/profile/:userId
export const getProfileTickets = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findOne({ clerkId: userId });
        if (!user) return res.status(404).json({ message: "User not found" });

        const tickets = await Ticket.find({ userId: user._id })
            .populate("userId", "fullname imageUrl clerkId role username")
            .populate("assignedTo", "fullname imageUrl clerkId role username")
            .sort({ createdAt: -1 });

        const ticketsWithCounts = await Promise.all(tickets.map(async (ticket) => {
            const commentCount = await Comment.countDocuments({ ticketId: ticket._id });
            return { ...ticket.toObject(), commentCount };
        }));

        res.status(200).json(ticketsWithCounts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Delete a ticket
// @route   DELETE /api/tickets/:id
export const deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const authState = typeof req.auth === 'function' ? req.auth() : req.auth;
        const clerkId = authState?.userId;

        const user = await User.findOne({ clerkId });
        const ticket = await Ticket.findById(id);

        if (!ticket) return res.status(404).json({ message: "Ticket not found" });
        if (!user || ticket.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized." });
        }

        await Ticket.findByIdAndDelete(id);
        res.status(200).json({ message: "Ticket deleted successfully", id });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Update a ticket
// @route   PUT /api/tickets/:id
export const updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, code } = req.body;
        const authState = typeof req.auth === 'function' ? req.auth() : req.auth;
        const clerkId = authState?.userId;

        const user = await User.findOne({ clerkId });
        const ticket = await Ticket.findById(id);

        if (!ticket) return res.status(404).json({ message: "Ticket not found" });
        if (!user || ticket.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized." });
        }

        ticket.title = title || ticket.title;
        ticket.description = description || ticket.description;
        ticket.code = code !== undefined ? code : ticket.code;

        await ticket.save();
        const populatedTicket = await Ticket.findById(id)
            .populate("userId", "fullname imageUrl clerkId role username")
            .populate("assignedTo", "fullname imageUrl clerkId role username");
        res.status(200).json(populatedTicket);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Update ticket status (Only developers)
// @route   PATCH /api/tickets/:id/status
export const updateTicketStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const authState = typeof req.auth === 'function' ? req.auth() : req.auth;
        const clerkId = authState?.userId;

        const user = await User.findOne({ clerkId });
        const ticket = await Ticket.findById(id);

        console.log("Update Status Request:", { clerkId, userRole: user?.role, ticketId: id, newStatus: status });

        if (!ticket) return res.status(404).json({ message: "Ticket not found" });

        // User must be a developer or admin
        if (!user || (user.role !== 'developer' && user.role !== 'admin')) {
            console.log("Status update forbidden for user:", user?.clerkId, "with role:", user?.role);
            return res.status(403).json({ message: "Forbidden. Only developers and admins can change ticket status." });
        }

        if (!["open", "in_progress", "resolved", "critical"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        if (status === 'in_progress' && !ticket.assignedTo) {
            ticket.assignedTo = user._id; // Automatically assign to the dev who picks it up
        }

        ticket.status = status;
        await ticket.save();

        if (ticket.userId.toString() !== user._id.toString()) {
            let message = `updated the status of your issue to ${status.replace('_', ' ')}.`;
            if (status === 'in_progress') message = "picked up your issue and is now working on it.";
            
            await Notification.create({
                recipientId: ticket.userId,
                senderId: user._id,
                type: "status_update",
                ticketId: ticket._id,
                message
            });
        }

        const populatedTicket = await Ticket.findById(id)
            .populate("userId", "fullname imageUrl clerkId role username")
            .populate("assignedTo", "fullname imageUrl clerkId role username");
        res.status(200).json(populatedTicket);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateAiResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const { aiResponse } = req.body;
        const authState = typeof req.auth === 'function' ? req.auth() : req.auth;
        const clerkId = authState?.userId;

        const user = await User.findOne({ clerkId });
        const ticket = await Ticket.findById(id);

        if (!ticket) return res.status(404).json({ message: "Ticket not found" });

        if (!user || (ticket.userId.toString() !== user._id.toString() && user.role !== 'admin' && user.role !== 'developer')) {
            return res.status(403).json({ message: "Unauthorized." });
        }

        ticket.aiResponse = aiResponse;
        await ticket.save();

        res.status(200).json({ message: "AI response saved successfully", aiResponse: ticket.aiResponse });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
