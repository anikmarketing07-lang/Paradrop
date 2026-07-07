import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { priceFor, currencyForCountry } from "@/lib/pricing";

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

    // Currency is resolved SERVER-SIDE from the visitor's geo — never trusted
    // from the client — so a US visitor can't force cheaper INR pricing.
    const currency = currencyForCountry(req.headers.get("x-vercel-ip-country"));

    const amount = priceFor(plan, interval, currency);
    if (amount === null) {
      return NextResponse.json({ error: "Invalid plan/interval." }, { status: 400 });
    }
    const amountMinor = amount * 100; // paise for INR, cents for USD

    const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const receipt = `r_${userId.slice(-12)}_${Date.now().toString().slice(-8)}`;

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountMinor,
        currency,
        receipt,
        notes: { userId, plan, interval, currency },
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
