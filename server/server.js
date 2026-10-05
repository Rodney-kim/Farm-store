import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import mpesaRoutes from "./routes/mpesaRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
connectDB();

const app = express();

// Allow the React frontend (a different origin in development) to call this API.
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));

// Parse incoming JSON request bodies into req.body.
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "FarmStore API is running" });
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/mpesa", mpesaRoutes);
app.use("/api/pay", mpesaRoutes);

// Keep these two LAST: notFound catches unmatched routes, and
// errorHandler catches everything passed to next(error) above.
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`FarmStore API listening on http://localhost:${PORT}`);
});
