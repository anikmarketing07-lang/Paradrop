import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { priceFor } from "@/lib/pricing";

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

    const expected = priceFor(plan, interval);
    if (expected === null || Math.abs(Number(amount) - expected) > 1) {
      return NextResponse.json({ error: `Amount mismatch. Expected ₹${expected}.` }, { status: 400 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const meta = (user.publicMetadata || {}) as Record<string, unknown>;
    const pending = (meta.pendingUpiPayments || []) as Array<Record<string, unknown>>;

    // Reject a txn ID we've seen in ANY state (pending/approved/rejected), not
    // just pending — otherwise an already-approved ID could be resubmitted and
    // spawn duplicate pending entries in the admin panel.
    if (pending.some((p) => p.txnId === txnTrimmed)) {
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
