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

