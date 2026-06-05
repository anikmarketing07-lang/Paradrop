import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserUsage, incrementLeads } from "@/lib/usage";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ leads: [], error: "Unauthorized" }, { status: 401 });

    const { niche } = await req.json();
    const apiKey = process.env.GROQ_API_KEY || "";

    if (!apiKey) {
      return NextResponse.json({ leads: [], error: "Server not configured." }, { status: 500 });
    }

    // Check usage limits
    const usage = await getUserUsage(userId);
    if (usage.leadCount + 20 > usage.limit) {
      return NextResponse.json(
        {
          leads: [],
          error: `Limit reached. ${usage.leadCount}/${usage.limit} leads used this month. Upgrade your plan.`,
          limitReached: true,
          plan: usage.plan,
        },
        { status: 403 }
      );
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 2048,
        temperature: 0.9,
        messages: [
          {
            role: "system",
            content: "You generate realistic B2B lead data. Return ONLY valid JSON arrays. No markdown. No explanation. No backticks.",
          },
          {
            role: "user",
            content: `Generate 20 realistic B2B leads for freelancers targeting: "${niche}".

Return ONLY a JSON array (no markdown, no backticks, no extra text):
[{"id":"1","name":"Full Name","role":"CEO","company":"Company Name","email":"firstname.lastname@company.com","phone":"+1234567890","whatsapp":"+1234567890","instagram":"username","facebook":"username","website":"company.com","address":"123 Main St, City","industry":"${niche}","location":"City, Country","verified":true}]

Rules:
- 20 unique people, decision maker roles only (CEO/Founder/CMO/Director/VP)
- Realistic names, real-sounding companies for ${niche}
- Mix of US/UK/India/Australia locations
- phone + whatsapp in E.164 international format (+CountryCode + digits, NO spaces/dashes); whatsapp usually same as phone
- instagram and facebook = plain handle/username only (no @, no URL)
- website = bare domain (no https://)
- address = realistic street + city for the location`,
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Groq error:", res.status, err);
      return NextResponse.json({ leads: [], error: `API error: ${res.status}` }, { status: 400 });
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "[]";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const leads = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    // Track usage
    await incrementLeads(userId, leads.length);

    return NextResponse.json({
      leads,
      usage: { used: usage.leadCount + leads.length, limit: usage.limit, plan: usage.plan },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ leads: [], error: "Failed to generate leads" }, { status: 500 });
  }
}
