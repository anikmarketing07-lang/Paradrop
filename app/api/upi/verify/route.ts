import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

const USD_TO_INR = 84;
const PLAN_USD: Record<string, number> = { pro: 19, agency: 49 };
const INTERVAL_MONTHS: Record<string, number> = { monthly: 1, quarterly: 3, yearly: 12 };
const INTERVAL_DISCOUNT: Record<string, number> = { monthly: 0, quarterly: 10, yearly: 20 };
const LIFETIME_INR = 1499;

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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
    }

    const { plan, interval, amount, txnId } = await req.json();

    if (!plan || !interval || amount === undefined || !txnId) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }
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
    const txnTrimmed = String(txnId).trim();
    if (txnTrimmed.length < 6) {
      return NextResponse.json({ error: "Invalid transaction ID." }, { status: 400 });
    }

    const expected = expectedInr(plan, interval);
    if (expected === null || Math.abs(Number(amount) - expected) > 1) {
      return NextResponse.json({ error: `Amount mismatch. Expected ₹${expected}.` }, { status: 400 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const meta = (user.publicMetadata || {}) as Record<string, unknown>;
    const pending = (meta.pendingUpiPayments || []) as Array<Record<string, unknown>>;

    if (pending.some((p) => p.txnId === txnTrimmed && p.status === "pending_verification")) {
      return NextResponse.json({ error: "Transaction ID already submitted." }, { status: 409 });
    }

    pending.push({
      plan,
      interval,
      amount: expected,
      txnId: txnTrimmed,
      submittedAt: new Date().toISOString(),
      status: "pending_verification",
      email: user.emailAddresses[0]?.emailAddress,
    });

    await client.users.updateUserMetadata(userId, {
      publicMetadata: { ...meta, pendingUpiPayments: pending },
    });

    console.log(`[UPI PAYMENT] User ${userId} | ${plan} ${interval} | INR ${expected} | Txn: ${txnTrimmed}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error. Try again." }, { status: 500 });
  }
}
