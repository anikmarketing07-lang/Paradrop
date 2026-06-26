import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const USD_TO_INR = 84;
const PLAN_USD: Record<string, number> = { pro: 19, agency: 49 };
const INTERVAL_MONTHS: Record<string, number> = { monthly: 1, quarterly: 3, yearly: 12 };
const INTERVAL_DISCOUNT: Record<string, number> = { monthly: 0, quarterly: 10, yearly: 20 };

// Lifetime deal: fixed INR price, no recurring.
export const LIFETIME_INR = 1499;

function expectedInr(plan: string, interval: string): number | null {
  if (plan === "lifetime" && interval === "lifetime") return LIFETIME_INR;
  const base = PLAN_USD[plan];
  const months = INTERVAL_MONTHS[interval];
  const discount = INTERVAL_DISCOUNT[interval];
  if (!base || !months || discount === undefined) return null;
  return Math.round(base * months * (1 - discount / 100) * USD_TO_INR);
}

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payments not configured." }, { status: 503 });
    }

    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

    const { plan, interval } = await req.json();
    if (!["pro", "agency", "lifetime"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }
    if (plan === "lifetime") {
      if (interval !== "lifetime") {
        return NextResponse.json({ error: "Invalid interval for lifetime." }, { status: 400 });
      }
    } else if (!["monthly", "quarterly", "yearly"].includes(interval)) {
      return NextResponse.json({ error: "Invalid interval." }, { status: 400 });
    }

    const amountInr = expectedInr(plan, interval);
    if (amountInr === null) {
      return NextResponse.json({ error: "Invalid plan/interval." }, { status: 400 });
    }
    const amountPaise = amountInr * 100;

    const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const receipt = `r_${userId.slice(-12)}_${Date.now().toString().slice(-8)}`;

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt,
        notes: { userId, plan, interval },
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Razorpay order error:", res.status, errBody);
      return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
    }

    const order = await res.json();
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      plan,
      interval,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
