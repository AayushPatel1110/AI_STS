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
    status: {
        type: String,
        required: true,
        enum: ["open", "in_progress", "closed"],
        default: "open",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    votes: {
        type: Number,
        default: 0,
    },
}, { timestamps: true }
);

export const ticket = mongoose.model("Ticket", ticketSchema);
