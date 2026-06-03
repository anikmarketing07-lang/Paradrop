import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { niche, geminiKey } = await req.json();
    const apiKey = geminiKey || "";

    if (!apiKey) {
      return NextResponse.json({ leads: [], error: "No API key. Go to Settings." }, { status: 400 });
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
[{"id":"1","name":"Full Name","role":"CEO","company":"Company Name","email":"firstname.lastname@company.com","industry":"${niche}","location":"City, Country","verified":true}]

Rules: 20 unique people, decision maker roles only (CEO/Founder/CMO/Director/VP), realistic names, real-sounding companies for ${niche}, mix of US/UK/India/Australia locations.`,
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

    return NextResponse.json({ leads });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ leads: [], error: "Failed to generate leads" }, { status: 500 });
  }
}
