import { User } from "../models/user.model.js";
export const authCallback = async (req, res) => {
    try {
        const { id, firstName, lastName, imageUrl, email } = req.body;

        let user = await User.findOne({ clerkId: id });
        const isAdmin = email && process.env.ADMIN_EMAIL && 
                        email.trim().toLowerCase() === process.env.ADMIN_EMAIL.trim().toLowerCase();
        
        console.log("AuthSync Check:", { 
            receivedEmail: email, 
            expectedAdmin: process.env.ADMIN_EMAIL, 
            isAdminResult: isAdmin 
        });

        if (!user) {
            user = await User.create({
                clerkId: id,
                fullname: `${firstName} ${lastName}`,
                imageUrl: imageUrl,
                email: email,
                role: isAdmin ? "admin" : "user",
            });
        } else {
            // Update role if user already exists but should be admin
            if (isAdmin && user.role !== "admin") {
                user.role = "admin";
                await user.save();
            }
            // Also ensure email is saved if it was missing
            if (!user.email) {
                user.email = email;
                await user.save();
            }
        }
        res.status(200).json({ message: "User authenticated successfully" });
    }
    catch (error) {
        console.error("Error in /callback route:", error);
        res.status(500).json({ message: "Internal server error" });
    }

};