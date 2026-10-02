import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { normalizePhone, stkPush } from "../services/mpesa.js";
import { sendAdminReceipt } from "../services/email.js";

// POST /api/mpesa/stkpush   body: { orderId, phone }
export const initiatePayment = async (req, res, next) => {
  try {
    const { orderId, phone } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    if (order.paymentStatus === "paid") {
      res.status(400);
      throw new Error("This order is already paid");
    }

    let msisdn;
    try {
      msisdn = normalizePhone(phone);
    } catch (err) {
      res.status(400);
      throw err;
    }

    // The amount always comes from the saved order, never from the browser.
    const result = await stkPush({
      phone: msisdn,
      amount: order.totalAmount,
      orderId: order._id,
    });

    order.checkoutRequestId = result.CheckoutRequestID;
    order.paymentStatus = "pending";
    order.paymentFailReason = undefined;
    await order.save();

    res.json({ message: result.CustomerMessage || "Check your phone to complete payment" });
  } catch (error) {
    next(error);
  }
};

// POST /api/mpesa/callback/:secret   (called by Safaricom, not by the browser)
export const mpesaCallback = async (req, res) => {
  if (req.params.secret !== process.env.MPESA_CALLBACK_SECRET) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const cb = req.body?.Body?.stkCallback;

    if (cb?.CheckoutRequestID) {
      const order = await Order.findOne({ checkoutRequestId: cb.CheckoutRequestID });

      // Ignore unknown orders and repeat callbacks for orders already paid.
      if (order && order.paymentStatus !== "paid") {
        if (cb.ResultCode === 0) {
          const items = cb.CallbackMetadata?.Item || [];
          const get = (name) => items.find((i) => i.Name === name)?.Value;

          order.paymentStatus = "paid";
          order.status = "confirmed";
          order.mpesaReceipt = get("MpesaReceiptNumber");
          order.paidAt = new Date();
          await order.save();

          // Reduce stock now that the money has arrived (never below 0).
          for (const p of order.products) {
            await Product.updateOne({ _id: p.productId }, [
              { $set: { stock: { $max: [0, { $subtract: ["$stock", p.quantity] }] } } },
            ]);
          }

          sendAdminReceipt(order).catch((e) => console.error("Admin receipt email failed:", e.message));
        } else {
          order.paymentStatus = "failed";
          order.paymentFailReason = cb.ResultDesc;
          await order.save();
        }
      }
    }
  } catch (err) {
    console.error("M-Pesa callback error:", err.message);
  }

  // Always acknowledge, so Safaricom doesn't keep retrying.
  res.json({ ResultCode: 0, ResultDesc: "Accepted" });
};