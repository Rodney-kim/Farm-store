import express from "express";
import { getCategories } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getCategories);

export default router;
