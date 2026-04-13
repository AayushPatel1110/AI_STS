import { User } from "../models/user.model.js";
export const authCallback = async (req, res) => {
    try {
        const { id, firstName, lastName, imageUrl } = req.body;

        if (!id) return res.status(400).json({ message: "Clerk ID is required" });

        const user = await User.findOne({ clerkId: id });
        if (!user) {
            // Robust name and image handling to prevent schema validation errors
            const fullname = `${firstName || ""} ${lastName || ""}`.trim() || "New User";
            const finalImageUrl = imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullname)}&background=random`;

            await User.create({
                clerkId: id,
                fullname: fullname,
                imageUrl: finalImageUrl,
            });
        }
        res.status(200).json({ message: "User authenticated successfully" });
    }
    catch (error) {
        console.error("Error in authCallback:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};