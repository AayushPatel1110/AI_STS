import { message as Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { io, userSocketMap } from "../lib/socket.js";

// @desc    Get all messages for a specific conversation/ticket
// @route   GET /api/messages/:ticketId
export const getMessages = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const messages = await Message.find({ ticketId })
            .populate("sender", "fullname imageUrl")
            .sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Send a message
// @route   POST /api/messages
export const sendMessage = async (req, res) => {
    try {
        const { content, receiverId, ticketId } = req.body;
        const senderClerkId = req.auth.userId;

        const sender = await User.findOne({ clerkId: senderClerkId });
        if (!sender) return res.status(404).json({ message: "Sender not found" });

        const newMessage = await Message.create({
            content,
            sender: sender._id,
            receiver: receiverId,
            ticketId,
        });

        const populatedMessage = await newMessage.populate("sender", "fullname imageUrl");

        // Real-time Emit
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", populatedMessage);
        }

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
