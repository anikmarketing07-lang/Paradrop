import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { type, key } = await req.json();

  if (type === "apollo") {
    try {
      const res = await fetch("https://api.apollo.io/v1/auth/health", {
        headers: { "x-api-key": key, "Content-Type": "application/json" },
      });
      return NextResponse.json({ ok: res.ok });
    } catch {
      return NextResponse.json({ ok: false });
    }
  }

  if (type === "groq") {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${key}` },
      });
      return NextResponse.json({ ok: res.ok });
    } catch {
      return NextResponse.json({ ok: false });
    }
  }

  return NextResponse.json({ ok: false });
}
