import express from "express";
import { initiatePayment, mpesaCallback } from "../controllers/mpesaController.js";

const router = express.Router();

router.post("/stkpush", initiatePayment);
router.post("/callback/:secret", mpesaCallback);

export default router;