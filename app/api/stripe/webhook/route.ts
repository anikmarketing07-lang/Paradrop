import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { setUserPlan } from "@/lib/usage";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan as "pro" | "agency" | undefined;
      if (userId && plan) {
        await setUserPlan(userId, plan);
        console.log(`✓ User ${userId} upgraded to ${plan}`);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (userId) {
        await setUserPlan(userId, "free");
        console.log(`✗ User ${userId} downgraded to free`);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
