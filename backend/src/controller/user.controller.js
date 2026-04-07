import { User } from "../models/user.model.js";

export const getUsers = async (req, res) => {
  const currerntUserId = req.auth.userId;
  const users = await User.find({ clerkId: { $ne: currerntUserId } });
  res.json(users);
};

export const createUser = async (req, res) => {
  const { clerkId, fullname, imageUrl } = req.body;
  try {
    const existingUser = await User.findOne({ clerkId });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({ clerkId, fullname, imageUrl });
    await newUser.save();
    res.status(201).json(newUser);
  }
  catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserProfile = async (req, res) => {
  const { id } = req.params;
  try {
    // Try clerkId first
    let user = await User.findOne({ clerkId: id });
    
    // If not found, try MongoDB ObjectId
    if (!user && id.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(id);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
