import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";

// @desc    Get user notifications
// @route   GET /api/notifications
export const getUserNotifications = async (req, res) => {
    try {
        const authState = typeof req.auth === 'function' ? req.auth() : req.auth;
        const clerkId = authState?.userId;
        const user = await User.findOne({ clerkId });
        
        if (!user) return res.status(404).json({ message: "User not found" });

        const notifications = await Notification.find({ recipientId: user._id })
            .populate("senderId", "fullname username imageUrl clerkId")
            .populate("ticketId", "title")
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Mark notifications as read
// @route   PATCH /api/notifications/mark-read
export const markAsRead = async (req, res) => {
    try {
        const authState = typeof req.auth === 'function' ? req.auth() : req.auth;
        const clerkId = authState?.userId;
        const user = await User.findOne({ clerkId });
        
        if (!user) return res.status(404).json({ message: "User not found" });

        await Notification.updateMany(
            { recipientId: user._id, read: false },
            { $set: { read: true } }
        );

        res.status(200).json({ message: "Notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
