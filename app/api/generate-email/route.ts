import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { incrementEmails } from "@/lib/usage";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ subject: "Error", email: "Unauthorized" }, { status: 401 });

    const { lead, yourSkill, yourName } = await req.json();
    const apiKey = process.env.GROQ_API_KEY || "";

    if (!apiKey) {
      return NextResponse.json({ subject: "Error", email: "Server not configured." }, { status: 500 });
    }

    const senderName = yourName || "Alex";
    const skill = yourSkill || "freelancer";

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 500,
        temperature: 0.8,
        messages: [
          {
            role: "system",
            content: "You write short human cold outreach. Return ONLY valid JSON with keys 'subject', 'email', and 'dm'. No markdown. No backticks.",
          },
          {
            role: "user",
            content: `Write cold outreach from "${senderName}" (${skill}) to ${lead.name} (${lead.role} at ${lead.company}, ${lead.industry}).

Generate TWO versions:
1. "email": full cold email, max 80 words, mention their role/company, one value prop, soft CTA (15-min call), no generic openers, no exclamation marks, human tone.
2. "dm": ultra-short version for WhatsApp/Instagram DM — max 35 words, casual, one line hook + one ask. No subject line. Sound like a real person texting.

Return ONLY: {"subject":"under 8 words","email":"body only","dm":"short message"}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Groq email error:", res.status, err);
      return NextResponse.json({ subject: "Error", email: "API error." }, { status: 400 });
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { subject: "Quick question", email: text };

    await incrementEmails(userId, 1);

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ subject: "Error", email: "Failed to generate email." }, { status: 500 });
  }
}
