import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        sparse: true, // allows multiple null values if not set
    },
    bio: {
        type: String,
        default: "",
    },
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["user", "developer", "admin"],
        default: "user",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true }
);

export const User  = mongoose.model("User", userSchema);