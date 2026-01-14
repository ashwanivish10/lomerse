import express, { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/Payment";
// import User from "../models/User";
import { User } from '../models/User';


const router = express.Router();

/**
 * Razorpay Webhook Route
 * --------------------------------
 * This route listens for payment events from Razorpay.
 * When a payment is captured, it verifies the signature,
 * updates the Payment document, and activates the user's subscription.
 */
router.post("/razorpay/webhook", async (req: Request, res: Response) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const signature = req.headers["x-razorpay-signature"] as string;

    // Validate Razorpay signature
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest !== signature) {
      console.error("❌ Invalid webhook signature");
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = req.body.event;
    const paymentEntity = req.body.payload?.payment?.entity;

    if (event === "payment.captured" && paymentEntity) {
      const { id, order_id } = paymentEntity;

      // Find payment in DB
      const payment = await Payment.findOne({ razorpayOrderId: order_id });
      if (!payment) {
        console.error("❌ Payment not found for order:", order_id);
        return res.status(404).json({ message: "Payment not found" });
      }

      // Mark payment as succeeded
      payment.status = "succeeded";
      payment.razorpayPaymentId = id;
      await payment.save();

      // Update user subscription
      const user = await User.findById(payment.userId);
      if (user) {
        const durationDays =
          payment.paymentType === "subscription_yearly" ? 365 : 30;
        const newExpiry = new Date(
          Date.now() + durationDays * 24 * 60 * 60 * 1000
        );

        user.subscriptionStatus = "active";
        user.subscriptionTier =
          payment.paymentType === "subscription_yearly" ? "yearly" : "monthly";
        user.subscriptionEndsAt = newExpiry;

        // Optional: add credits for premium templates
        if (payment.paymentType === "subscription_monthly") {
          user.invoiceCredits = (user.invoiceCredits || 0) + 10;
        } else if (payment.paymentType === "subscription_yearly") {
          user.invoiceCredits = (user.invoiceCredits || 0) + 150;
        }

        await user.save();
        console.log("✅ Subscription activated for:", user.email);
      } else {
        console.error("❌ User not found for payment:", payment.userId);
      }

      return res
        .status(200)
        .json({ message: "Payment verified and subscription activated" });
    }

    // Handle other events (optional)
    res.status(200).json({ message: "Webhook received" });
  } catch (err) {
    console.error("⚠️ Webhook error:", err);
    res.status(500).json({ message: "Server error processing webhook" });
  }
});

export default router;
