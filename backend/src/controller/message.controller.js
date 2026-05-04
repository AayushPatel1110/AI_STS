import { message as Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { io, userSocketMap } from "../lib/socket.js";

// @desc    Get users the current user has conversed with
// @route   GET /api/messages/conversations
export const getConversations = async (req, res) => {
    try {
        const authState = typeof req.auth === 'function' ? req.auth() : req.auth;
        const currentUserId = authState?.userId;

        const currentUser = await User.findOne({ clerkId: currentUserId });
        if (!currentUser) return res.status(404).json({ message: "User not found" });

        const messages = await Message.find({
            $or: [{ sender: currentUser._id }, { receiver: currentUser._id }]
        });

        const conversationUserIds = new Set();
        messages.forEach(msg => {
            if (msg.sender && msg.sender.toString() !== currentUser._id.toString()) {
                conversationUserIds.add(msg.sender.toString());
            }
            if (msg.receiver && msg.receiver.toString() !== currentUser._id.toString()) {
                conversationUserIds.add(msg.receiver.toString());
            }
        });

        const users = await User.find({ _id: { $in: Array.from(conversationUserIds) } });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all messages for a specific conversation/ticket
// @route   GET /api/messages/:ticketId
export const getMessages = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const authState = typeof req.auth === 'function' ? req.auth() : req.auth;
        const currentUserId = authState?.userId;

        // If ticketId is a Clerk ID, it's a direct message request
        if (ticketId.startsWith("user_")) {
            const currentUser = await User.findOne({ clerkId: currentUserId });
            const otherUser = await User.findOne({ clerkId: ticketId });

            if (!currentUser || !otherUser) {
                console.log("getMessages 404. currentUserId:", currentUserId, "Found:", !!currentUser, "ticketId/other:", ticketId, "Found:", !!otherUser);
                return res.status(404).json({ message: "User not found" });
            }

            const messages = await Message.find({
                $or: [
                    { sender: currentUser._id, receiver: otherUser._id },
                    { sender: otherUser._id, receiver: currentUser._id }
                ]
            })
            .populate("sender", "fullname imageUrl clerkId")
            .sort({ createdAt: 1 });

            return res.status(200).json(messages);
        }

        // Otherwise, it's a ticket ID
        const messages = await Message.find({ ticketId })
            .populate("sender", "fullname imageUrl clerkId")
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
        const authState = typeof req.auth === 'function' ? req.auth() : req.auth;
        const senderClerkId = authState?.userId;

        const sender = await User.findOne({ clerkId: senderClerkId });
        if (!sender) return res.status(404).json({ message: "Sender not found" });

        let receiver;
        // If receiverId is a clerkId, fetch the corresponding MongoDB user
        if (receiverId && receiverId.startsWith("user_")) {
            receiver = await User.findOne({ clerkId: receiverId });
        } else {
            receiver = await User.findById(receiverId);
        }

        if (!receiver) return res.status(404).json({ message: "Receiver not found" });

        const messageData = {
            content,
            sender: sender._id,
            receiver: receiver._id,
        };

        // If ticketId is NOT a clerkId and exists, assign it. Otherwise, it's a direct message without a ticket.
        if (ticketId && !ticketId.startsWith("user_")) {
            messageData.ticketId = ticketId;
        }

        const newMessage = await Message.create(messageData);
        const populatedMessage = await newMessage.populate("sender", "fullname imageUrl clerkId");

        // Real-time Emit
        const receiverSocketId = userSocketMap[receiver.clerkId] || userSocketMap[receiver._id];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", populatedMessage);
        }

        // Create a notification for the receiver
        await Notification.create({
            recipientId: receiver._id,
            senderId: sender._id,
            type: "message",
            message: "sent you a message",
            ticketId: messageData.ticketId || null,
        });

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
