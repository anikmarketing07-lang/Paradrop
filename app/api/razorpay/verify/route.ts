import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { setUserPlan, type Plan } from "@/lib/usage";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payments not configured." }, { status: 503 });
    }

    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, interval } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment fields." }, { status: 400 });
    }
    if (!["pro", "agency"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }
    if (!["monthly", "quarterly", "yearly"].includes(interval)) {
      return NextResponse.json({ error: "Invalid interval." }, { status: 400 });
    }

    // Verify signature: HMAC SHA256 of `order_id|payment_id` with key_secret
    const expectedSig = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSig !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
    }

    // Cross-check order metadata against claim (anti-tampering)
    const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const orderRes = await fetch(`https://api.razorpay.com/v1/orders/${razorpay_order_id}`, {
      headers: { Authorization: authHeader },
    });
    if (!orderRes.ok) {
      return NextResponse.json({ error: "Order lookup failed." }, { status: 500 });
    }
    const order = await orderRes.json();
    const notes = order.notes || {};
    if (notes.userId !== userId || notes.plan !== plan || notes.interval !== interval) {
      return NextResponse.json({ error: "Order mismatch." }, { status: 400 });
    }
    if (order.status !== "paid") {
      // Order may take a moment; check the payment itself
      const payRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
        headers: { Authorization: authHeader },
      });
      if (!payRes.ok) {
        return NextResponse.json({ error: "Payment lookup failed." }, { status: 500 });
      }
      const payment = await payRes.json();
      if (payment.status !== "captured" && payment.status !== "authorized") {
        return NextResponse.json({ error: "Payment not completed." }, { status: 400 });
      }
    }

    // Upgrade user + set expiry
    const months = interval === "yearly" ? 12 : interval === "quarterly" ? 3 : 1;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + months * 30 * 24 * 60 * 60 * 1000);

    await setUserPlan(userId, plan as Plan);
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const meta = (user.publicMetadata || {}) as Record<string, unknown>;
    const history = (meta.paymentHistory || []) as Array<Record<string, unknown>>;
    history.push({
      provider: "razorpay",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      plan,
      interval,
      amount: order.amount / 100,
      currency: order.currency,
      paidAt: now.toISOString(),
    });

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...meta,
        plan,
        planExpiresAt: expiresAt.toISOString(),
        leadCount: 0,
        emailCount: 0,
        lastReset: now.toISOString(),
        paymentHistory: history,
      },
    });

    console.log(`[RAZORPAY PAID] User ${userId} | ${plan} ${interval} | Payment ${razorpay_payment_id}`);

    return NextResponse.json({ success: true, plan, expiresAt: expiresAt.toISOString() });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
