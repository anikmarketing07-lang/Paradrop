import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserUsage } from "@/lib/usage";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const usage = await getUserUsage(userId);
  return NextResponse.json(usage);
}
