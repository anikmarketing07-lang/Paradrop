import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { setUserPlan, type Plan } from "@/lib/usage";

// Only YOU (admin) can approve. Set ADMIN_USER_ID in .env to your Clerk user ID.
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId || userId !== process.env.ADMIN_USER_ID) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { targetUserId, txnId, action } = await req.json();
    const client = await clerkClient();
    const user = await client.users.getUser(targetUserId);
    const meta = (user.publicMetadata || {}) as Record<string, unknown>;
    const pending = (meta.pendingUpiPayments || []) as Array<Record<string, unknown>>;

    const payment = pending.find((p) => p.txnId === txnId);
    if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });

    if (action === "approve") {
      const months = payment.interval === "yearly" ? 12 : payment.interval === "quarterly" ? 3 : 1;
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setMonth(expiresAt.getMonth() + months);
      await setUserPlan(targetUserId, payment.plan as Plan);
      payment.status = "approved";
      payment.approvedAt = now.toISOString();
      payment.expiresAt = expiresAt.toISOString();
      await client.users.updateUserMetadata(targetUserId, {
        publicMetadata: {
          ...meta,
          plan: payment.plan,
          planExpiresAt: expiresAt.toISOString(),
          leadCount: 0,
          emailCount: 0,
          lastReset: now.toISOString(),
          pendingUpiPayments: pending,
        },
      });
    } else {
      payment.status = "rejected";
      await client.users.updateUserMetadata(targetUserId, {
        publicMetadata: { ...meta, pendingUpiPayments: pending },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// List all pending payments across users
export async function GET() {
  const { userId } = await auth();
  if (!userId || userId !== process.env.ADMIN_USER_ID) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const client = await clerkClient();
  const users = await client.users.getUserList({ limit: 500 });

  const allPending: Array<Record<string, unknown>> = [];
  for (const user of users.data) {
    const meta = (user.publicMetadata || {}) as Record<string, unknown>;
    const pending = (meta.pendingUpiPayments || []) as Array<Record<string, unknown>>;
    for (const p of pending) {
      if (p.status === "pending_verification") {
        allPending.push({
          ...p,
          userId: user.id,
          userName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.emailAddresses[0]?.emailAddress,
        });
      }
    }
  }

  return NextResponse.json({ pending: allPending });
}
