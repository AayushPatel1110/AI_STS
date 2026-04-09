import { Ticket } from "../models/ticket.model.js";
import { User } from "../models/user.model.js";

// @desc    Get all tickets with user data
// @route   GET /api/tickets
export const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find()
            .populate("userId", "fullname imageUrl clerkId role username")
            .populate("assignedTo", "fullname imageUrl clerkId role username")
            .sort({ createdAt: -1 });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Create a new ticket
// @route   POST /api/tickets
export const createTicket = async (req, res) => {
    try {
        const { title, description, code } = req.body;
        const clerkId = req.auth().userId; // From Clerk middleware
        const user = await User.findOne({ clerkId });
        if (!user) return res.status(404).json({ message: "User not found" });

        const newTicket = await Ticket.create({
            title,
            description,
            code,
            userId: user._id,
        });

        const populatedTicket = await newTicket
            .populate("userId", "fullname imageUrl clerkId role username")
            .populate("assignedTo", "fullname imageUrl clerkId role username");
        res.status(201).json(populatedTicket);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Toggle Like on a ticket
// @route   PATCH /api/tickets/:id/like
export const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const clerkId = req.auth().userId;

        const user = await User.findOne({ clerkId });
        const ticket = await Ticket.findById(id);

        if (!ticket) return res.status(404).json({ message: "Ticket not found" });

        const hasLiked = ticket.likes.includes(clerkId);

        if (hasLiked) {
            ticket.likes = ticket.likes.filter(id => id !== clerkId);
        } else {
            ticket.likes.push(clerkId);
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
        res.status(200).json(tickets);
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

        if (!ticket) return res.status(404).json({ message: "Ticket not found" });

        // User must be a developer
        if (!user || user.role !== 'developer') {
            return res.status(403).json({ message: "Forbidden. Only developers can change ticket status." });
        }

        if (!["open", "in_progress", "resolved", "critical"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        if (status === 'in_progress' && !ticket.assignedTo) {
            ticket.assignedTo = user._id; // Automatically assign to the dev who picks it up
        }

        ticket.status = status;
        await ticket.save();

        const populatedTicket = await Ticket.findById(id)
            .populate("userId", "fullname imageUrl clerkId role username")
            .populate("assignedTo", "fullname imageUrl clerkId role username");
        res.status(200).json(populatedTicket);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
