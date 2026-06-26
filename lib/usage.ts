import { clerkClient } from "@clerk/nextjs/server";

export const PLAN_LIMITS = {
  free: 20,
  pro: 500,
  agency: Infinity,
  lifetime: 5000,
} as const;

export const RESET_DAYS = 30;

export type Plan = keyof typeof PLAN_LIMITS;

type UserMeta = {
  plan?: Plan;
  planExpiresAt?: string;
  leadCount?: number;
  emailCount?: number;
  lastReset?: string;
};

function isExpired(expiresAt: string | undefined): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() < Date.now();
}

function shouldReset(lastReset: string | undefined): boolean {
  if (!lastReset) return true;
  const last = new Date(lastReset).getTime();
  const now = Date.now();
  const days = (now - last) / (1000 * 60 * 60 * 24);
  return days >= RESET_DAYS;
}

function nextResetDate(lastReset: string | undefined): string {
  const last = lastReset ? new Date(lastReset) : new Date();
  const next = new Date(last.getTime() + RESET_DAYS * 24 * 60 * 60 * 1000);
  return next.toISOString();
}

export async function getUserUsage(userId: string) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  let meta = (user.publicMetadata as UserMeta) || {};

  // Auto-downgrade if paid plan expired
  if (meta.plan && meta.plan !== "free" && isExpired(meta.planExpiresAt)) {
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { ...meta, plan: "free", planExpiresAt: undefined },
    });
    meta = { ...meta, plan: "free", planExpiresAt: undefined };
  }

  const plan: Plan = meta.plan || "free";
  const limit = PLAN_LIMITS[plan];

  if (shouldReset(meta.lastReset)) {
    const now = new Date().toISOString();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...meta,
        leadCount: 0,
        emailCount: 0,
        lastReset: now,
      },
    });
    return {
      plan,
      limit,
      leadCount: 0,
      emailCount: 0,
      resetAt: nextResetDate(now),
    };
  }

  return {
    plan,
    limit,
    leadCount: meta.leadCount || 0,
    emailCount: meta.emailCount || 0,
    resetAt: nextResetDate(meta.lastReset),
  };
}

export async function incrementLeads(userId: string, amount: number) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const meta = (user.publicMetadata as UserMeta) || {};
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...meta,
      leadCount: (meta.leadCount || 0) + amount,
    },
  });
}

export async function incrementEmails(userId: string, amount: number) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const meta = (user.publicMetadata as UserMeta) || {};
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...meta,
      emailCount: (meta.emailCount || 0) + amount,
    },
  });
}

export async function setUserPlan(userId: string, plan: Plan) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const meta = (user.publicMetadata as UserMeta) || {};
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { ...meta, plan },
  });
}
