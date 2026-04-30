import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        required: true,
        enum: ["open", "in_progress", "resolved", "critical"],
        default: "open",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    votes: {
        type: Number,
        default: 0,
    },
    likes: [
        {
            type: String,
        }
    ],
    aiResponse: {
        type: String,
        default: null,
    },
}, { timestamps: true }
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
