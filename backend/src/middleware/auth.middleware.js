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
        const isAdmin = process.env.Admin_Email === authState?.sessionClaims?.email;
        if (!isAdmin) {
            res.status(403).json({ message: "Forbidden. You must be an administrator." });
            return;
        }
        next();
    } catch (error) {
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