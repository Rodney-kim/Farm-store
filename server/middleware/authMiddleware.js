import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Requires a valid "Authorization: Bearer <token>" header.
export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Not authorized, please log in");
    }

    let decoded;
    try {
      decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    } catch {
      res.status(401);
      throw new Error("Session expired or invalid, please log in again");
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("This account no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Use AFTER protect.
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  res.status(403);
  next(new Error("Admin access only"));
};
