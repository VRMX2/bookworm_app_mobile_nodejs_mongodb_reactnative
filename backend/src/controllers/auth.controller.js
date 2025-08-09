import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    if (username.length < 3)
      return res.status(400).json({ message: "Username must be at least 3 characters" });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already in use" });

    if (await User.findOne({ username }))
      return res.status(400).json({ message: "Username already in use" });

    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
    const user = new User({ username, email, password, profileImage });
    await user.save();

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
