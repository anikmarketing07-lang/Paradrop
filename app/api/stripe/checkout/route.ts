import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const PRICE_MAP: Record<string, Record<string, string | undefined>> = {
  pro: {
    monthly: process.env.STRIPE_PRO_PRICE_ID,
    quarterly: process.env.STRIPE_PRO_PRICE_ID_QUARTERLY,
    yearly: process.env.STRIPE_PRO_PRICE_ID_YEARLY,
  },
  agency: {
    monthly: process.env.STRIPE_AGENCY_PRICE_ID,
    quarterly: process.env.STRIPE_AGENCY_PRICE_ID_QUARTERLY,
    yearly: process.env.STRIPE_AGENCY_PRICE_ID_YEARLY,
  },
};

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { plan, interval = "monthly" } = await req.json();
    const priceId = PRICE_MAP[plan]?.[interval];

    if (!priceId) {
      return NextResponse.json({ error: `Price not configured for ${plan} ${interval}` }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: { userId, plan, interval },
      subscription_data: { metadata: { userId, plan, interval } },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
