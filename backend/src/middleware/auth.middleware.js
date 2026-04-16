import { clerkClient } from "@clerk/express";
import { User } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    const authState = typeof req.auth === 'function' ? req.auth() : req.auth;
    if (!authState || !authState.userId) {
        res.status(401).json({ message: "Unauthorized. You must be logged in." });
        return;
    }
    next();
}

export const requireAdmin = async (req, res, next) => {
    try {
        const authState = typeof req.auth === 'function' ? req.auth() : req.auth;
        let user = await User.findOne({ clerkId: authState?.userId });
        
        // Auto-upgrade if email matches but role isn't admin
        if (user && user.email === process.env.ADMIN_EMAIL && user.role !== "admin") {
            console.log("Auto-upgrading user to admin:", user.email);
            user.role = "admin";
            await user.save();
        }

        console.log("Admin Check Middleware:", {
            userId: authState?.userId,
            foundUser: user ? user.fullname : "None",
            role: user ? user.role : "None",
            email: user ? user.email : "None"
        });

        if (!user || user.role !== "admin") {
            res.status(403).json({ message: "Forbidden. You must be an administrator." });
            return;
        }
        next();
    } catch (error) {
        console.error("Error in requireAdmin:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const isDeveloper = async (req, res, next) => {
    try {
        const authState = typeof req.auth === 'function' ? req.auth() : req.auth;
        const user = await User.findOne({ clerkId: authState?.userId, role: "developer" });
        if (!user) {
            res.status(403).json({ message: "Forbidden. You must be a developer." });
            return;
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
}