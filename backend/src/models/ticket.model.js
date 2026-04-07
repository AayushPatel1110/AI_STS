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
    likes: [
        {
            type: String,
        }
    ],
}, { timestamps: true }
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
