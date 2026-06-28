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

    const groqBody = JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 450,
        temperature: 0.9,
        messages: [
          {
            role: "system",
            content: `You write cold outreach that makes the reader feel they're MISSING OUT and CURIOUS. Two psychological levers only: FOMO and seduction.

FOMO: make them feel their competitors are already winning, clients are slipping away, or an opportunity is closing. Use real details (their rating, city, business type) to make the threat feel personal.

SEDUCTION: make the offer irresistible — paint a vivid before/after. "Right now you're doing X manually. Imagine Y instead." Make them WANT to reply, not feel obligated.

HARD RULES:
- First line = pattern interrupt. Never start with their name. Start with a provocative observation, a competitor move, or a number that stings.
- No pleasantries. No "hope you're doing well." No "I came across." These are dead on arrival.
- Write like a confident equal, not a desperate seller. Short sentences. Punchy. Conversational.
- One specific, tangible result (with a number if possible). "3 of your competitors in [city] are doing X" beats "I can help grow your business."
- CTA = curiosity-based, never needy. "Want to see how?" / "Curious?" / "Should I show you theirs?" / "Open to a 2-min demo?"
- No exclamation marks. No emoji. No buzzwords (synergy, leverage, scale, elevate, unlock). No sign-off names.
- Subject line: 4-6 words, lowercase, curiosity gap. Make them HAVE to open it.
- If lead has NO website, that's the killer hook — their competitors with websites are stealing their walk-in customers right now.

Output: ONLY a JSON object with keys "subject", "email", "dm". No markdown, no backticks, no text before or after the JSON.`,
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

1. "subject" — 4-6 words, lowercase, curiosity gap. They MUST open it. Examples: "your competitors are doing this", "noticed something about [business]", "quick question about [city]"

2. "email" — 60-90 words. Structure:
   - line 1: PATTERN INTERRUPT. A provocative observation, a competitor reference, or a number. Never start with their name or a greeting. Examples: "3 agencies near you in [city] are already doing this." / "Your [rating]★ rating is strong — but you're invisible online." / "Checked [city] [industry] — most have websites now. You don't."
   - line 2-3: Paint the before/after. What they're losing NOW vs what changes with the sender's offer. Be specific + vivid.
   - line 4: Curiosity CTA — "want to see how?", "curious?", "should I show you what they're doing?", "want the breakdown?"
   - No greeting. No signature. No "I hope this finds you well."

3. "dm" — WhatsApp version, 20-35 words. Casual, lowercase. Start with a FOMO hook ("your competitors in [city] are doing X..."). End with curiosity ("want to see?"). Sound like a friend tipping them off, not a salesman.

Return ONLY: {"subject":"...","email":"...","dm":"..."}`,
          },
        ],
    });

    // Groq free tier has a tokens-per-minute cap. On 429, back off and retry
    // a few times so bulk "generate all" doesn't fail mid-batch.
    let res: Response | null = null;
    for (let attempt = 0; attempt < 4; attempt++) {
      res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: groqBody,
      });
      if (res.status !== 429) break;
      const retryAfter = Number(res.headers.get("retry-after"));
      const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
        ? Math.min(retryAfter * 1000, 8000)
        : 1500 * (attempt + 1);
      await new Promise((r) => setTimeout(r, waitMs));
    }

    if (!res || !res.ok) {
      const err = res ? await res.text() : "no response";
      console.error("Groq email error:", res?.status, err);
      return NextResponse.json(
        { subject: "Rate limited", email: "Server busy — wait a few seconds and hit Generate again on this lead." },
        { status: 429 }
      );
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
