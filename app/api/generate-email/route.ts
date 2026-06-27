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

    // Pull personalization signals from the lead (rating, reviews, address, channels available).
    const ratingLine = typeof lead.rating === "number"
      ? `Rating: ${lead.rating}★ (${lead.reviews ?? "?"} reviews)`
      : "Rating: none yet";
    const cityLine = lead.location ? `Location: ${lead.location}` : "";
    const websiteLine = lead.website ? `Website: ${lead.website}` : "No website";
    const hasIG = !!lead.instagram;
    const hasFB = !!lead.facebook;
    const hasEmail = !!lead.email;
    const hasPhone = !!lead.phone;
    const channelsLine = [
      hasPhone ? "phone/WhatsApp" : null,
      hasEmail ? "email" : null,
      hasIG ? "Instagram" : null,
      hasFB ? "Facebook" : null,
    ].filter(Boolean).join(", ") || "limited contact options";

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 600,
        temperature: 0.9,
        messages: [
          {
            role: "system",
            content: `You are a sharp B2B cold-outreach copywriter for Indian SMB sales.

Hard rules:
- Sound like a real human texting another human, never an AI or template.
- Be SPECIFIC to the lead — reference their actual rating, city, website status, or business type. Never generic openers like "I came across your business" or "I noticed your company".
- One concrete value, plainly stated. Skip buzzwords ("synergy", "leverage", "scale", "elevate", "unlock").
- No exclamation marks. No emoji. No sign-off names — the platform adds the name.
- Vary the CTA across leads: a 10-min chat, a quick reply, a Loom demo, a free audit, "open to it?". Never just "15-min call" every time.
- If the lead has NO website, that gap IS your hook for the pitch.
- Subject line: under 7 words, lowercase fine, no clickbait.

Output: ONLY a JSON object with keys "subject", "email", "dm". No markdown, no backticks, no commentary before or after.`,
          },
          {
            role: "user",
            content: `LEAD
Name: ${lead.name}
Type: ${lead.role || lead.industry || "local business"}
${cityLine}
${ratingLine}
${websiteLine}
Available channels: ${channelsLine}

SENDER
Name: ${senderName}
Pitches/offers: ${skill}

TASK — write 3 fields:

1. "subject" — under 7 words. Specific. No clickbait.

2. "email" — full cold email, 60-85 words. Structure:
   - line 1: a specific hook tied to a real detail above (their rating, their city, missing website, business type)
   - line 2-3: ONE concrete value the sender offers, in plain language
   - line 4: a soft, varied CTA (not "15-min call" — try "worth a quick reply?", "open to a 10-min chat?", "want a free audit?", "shall I send a 2-min Loom?")
   - No greeting beyond the name. No "I hope this finds you well". No signature.

3. "dm" — WhatsApp/Instagram version, 25-40 words. Casual, lowercase fine, one hook + one ask. Sound like a person texting, not a marketer.

Return ONLY: {"subject":"...","email":"...","dm":"..."}`,
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
