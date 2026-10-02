import express from "express";
import { createOrder, getOrderById, getOrders } from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, adminOnly, getOrders).post(createOrder);
router.get("/:id", getOrderById);

export default router;