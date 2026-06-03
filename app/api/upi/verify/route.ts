import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

// UPI payments are MANUAL verification.
// User submits txn ID → stored in their Clerk metadata for you to verify.
// You manually check your UPI app, then upgrade them by setting plan in Clerk dashboard or via API.

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { plan, interval, amount, txnId } = await req.json();

    if (!plan || !interval || !amount || !txnId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const meta = (user.publicMetadata || {}) as Record<string, unknown>;
    const pending = (meta.pendingUpiPayments || []) as Array<Record<string, unknown>>;

    pending.push({
      plan,
      interval,
      amount,
      txnId,
      submittedAt: new Date().toISOString(),
      status: "pending_verification",
      email: user.emailAddresses[0]?.emailAddress,
    });

    await client.users.updateUserMetadata(userId, {
      publicMetadata: { ...meta, pendingUpiPayments: pending },
    });

    // TODO: Send Telegram/Email notification to admin (you)
    console.log(`[UPI PAYMENT] User ${userId} | ${plan} ${interval} | ₹${amount} | Txn: ${txnId}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit payment" }, { status: 500 });
  }
}
