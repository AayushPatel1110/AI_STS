import { User } from "../models/user.model.js";
import { Ticket } from "../models/ticket.model.js";

export const getStats = async (req, res) => {
    try {
        const authState = typeof req.auth === 'function' ? req.auth() : req.auth;
        const user = await User.findOne({ clerkId: authState?.userId });

        const totalUsers = await User.countDocuments();
        const totalTickets = await Ticket.countDocuments();
        const developerCount = await User.countDocuments({ role: "developer" });
        const resolvedTicketsCount = await Ticket.countDocuments({ status: "resolved" });

        res.status(200).json({
            totalUsers,
            totalTickets,
            developerCount,
            resolvedTicketsCount
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats" });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("fullname username imageUrl role clerkId email isDeleted createdAt").sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

export const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find()
            .populate("userId", "fullname imageUrl")
            .populate("assignedTo", "fullname imageUrl")
            .sort({ createdAt: -1 });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tickets" });
    }
};

export const deleteTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        await Ticket.findByIdAndDelete(ticketId);
        res.status(200).json({ message: "Ticket deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting ticket" });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!["user", "developer", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select("fullname username imageUrl role clerkId email isDeleted");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error updating role" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndUpdate(userId, { isDeleted: true });
        res.status(200).json({ message: "User soft deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
};

export const restoreUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndUpdate(userId, { isDeleted: false });
        res.status(200).json({ message: "User restored successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error restoring user" });
    }
};
