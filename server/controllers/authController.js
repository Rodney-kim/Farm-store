import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  token: signToken(user._id),
});

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email and password are required");
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      res.status(400);
      throw new Error("An account with this email already exists");
    }

    // The email set as ADMIN_EMAIL in .env becomes the admin.
    const isAdmin =
      process.env.ADMIN_EMAIL &&
      email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();

    const user = await User.create({
      name,
      email,
      password,
      role: isAdmin ? "admin" : "user",
    });

    res.status(201).json(userResponse(user));
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = email && (await User.findOne({ email: email.toLowerCase() }));

    if (!user || !(await user.matchPassword(password || ""))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.json(userResponse(user));
  } catch (error) {
    next(error);
  }
};
