import { User } from "../models/user.model.js";

export const getUsers = async (req, res) => {
  const authState = typeof req.auth === 'function' ? req.auth() : req.auth;
  const currentUserId = authState?.userId;
  const users = await User.find({ clerkId: { $ne: currentUserId } });
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

export const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { username, bio } = req.body;
  const authState = typeof req.auth === 'function' ? req.auth() : req.auth;
  const currentUserId = authState?.userId;

  if (currentUserId !== id) {
    return res.status(403).json({ message: "Unauthorized: You can only edit your own profile." });
  }

  try {
    const user = await User.findOne({ clerkId: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) {
      // Check if username is already taken by someone else
      const existingUser = await User.findOne({ username, clerkId: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      user.username = username;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

