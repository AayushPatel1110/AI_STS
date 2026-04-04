import { User } from "../models/user.model.js";
export const authCallback = async (req, res) => {
    try {
        const {id , firstName, lastName, imageUrl} = req.body;

        const user = await User.findOne({ clerkId: id });
        if (!user) {

            await User.create({
                clerkId: id,
                fullname: `${firstName} ${lastName}`,
                imageUrl: imageUrl,
            });
        }
        res.status(200).json({ message: "User authenticated successfully" });
    }
    catch (error) {
        console.error("Error in /callback route:", error);
        res.status(500).json({ message: "Internal server error" }); 
    }
            
};