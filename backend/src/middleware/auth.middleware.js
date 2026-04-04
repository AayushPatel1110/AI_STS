import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
    if(!req.auth || !req.auth.userId) {
        res.status(401).json({ message: "Unauthorized. You must be logged in." });
        return;
    }
    next();
}

export const requireAdmin = async (req, res, next) => {
    try {
        const currerntUser = await clerkClient.users.getUser(req.auth.userId);    
        const isAdmin = process.env.Admin_Email === currerntUser.primaryEmailAddress?.emailAddress;
        if (!isAdmin) {
            res.status(403).json({ message: "Forbidden. You must be an administrator." });
            return;
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
}

export const isDeveloper = async (req, res, next) => {
    try {
        const currerntUser = await clerkClient.users.getUser(req.auth.userId);
        const isDeveloper = User.findOne({ clerkId: req.auth.userId, role: "developer" });
        if (!isDeveloper) {
            res.status(403).json({ message: "Forbidden. You must be a developer." });
            return;
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
}