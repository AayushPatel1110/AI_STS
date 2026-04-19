import { User } from "../models/user.model.js";
export const authCallback = async (req, res) => {
    try {
        const { clerkId, fullname, imageUrl, email } = req.body;

        // 1. Try to find user by clerkId
        let user = await User.findOne({ clerkId });

        // 2. If not found, try to find by email to link accounts
        if (!user && email) {
            user = await User.findOne({ email });
            if (user) {
                console.log("Linking existing user by email to new Clerk ID:", email);
                user.clerkId = clerkId;
                await user.save();
            }
        }

        const isAdmin = email && process.env.ADMIN_EMAIL &&
            email.trim().toLowerCase() === process.env.ADMIN_EMAIL.trim().toLowerCase();



        // Use findOneAndUpdate with upsert to avoid race conditions
        // This is atomic - if two requests hit at same time, one will create, other will update
        const updatedUser = await User.findOneAndUpdate(
            { clerkId },
            {
                $set: {
                    fullname: fullname || "User",
                    imageUrl: imageUrl || "",
                    email
                },
                ...(isAdmin ? { $set: { role: "admin" } } : { $setOnInsert: { role: "user" } })
            },
            {
                upsert: true,
                returnDocument: 'after',
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        res.status(200).json({ message: "User authenticated successfully", user: updatedUser });
    }
    catch (error) {
        console.error("Error in /callback route:", error);
        res.status(500).json({ message: "Internal server error" });
    }

};