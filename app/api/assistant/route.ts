import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUserUsage } from "@/lib/usage";

const PREMIUM_PLANS = new Set(["pro", "agency", "lifetime"]);

const SYSTEM_INSTRUCTION = `You are Paradrop's sales assistant — a sharp, friendly AI helping freelancers and agencies land local SMB clients.

You know the Paradrop product: it finds local businesses via Google Places, scrapes their email + Instagram + Facebook, and AI-writes personalized cold email + WhatsApp DM for each.

Your job:
- Suggest profitable niches the user can target (with reasoning).
- Suggest cities that match their skill.
- Critique their cold email + DM copy and rewrite stronger versions.
- Answer questions about how to do outreach without spamming.
- If they ask about non-outreach topics, politely redirect.

Style: short, punchy, Hinglish-friendly when user writes Hindi/Hinglish, English otherwise. Skip fluff. Give specific advice with examples.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI assistant not configured. Contact support." },
        { status: 503 }
      );
    }

    const usage = await getUserUsage(userId);
    if (!PREMIUM_PLANS.has(usage.plan)) {
      return NextResponse.json(
        {
          error: "AI assistant is a premium feature. Upgrade to use.",
          locked: true,
          plan: usage.plan,
        },
        { status: 403 }
      );
    }

    const { messages } = (await req.json()) as { messages: ChatMessage[] };
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    const trimmed = messages.slice(-12);
    const latest = trimmed[trimmed.length - 1];
    if (latest.role !== "user" || !latest.content?.trim()) {
      return NextResponse.json({ error: "Last message must be from user." }, { status: 400 });
    }

    const history = trimmed.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(latest.content);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[assistant]", err);
    return NextResponse.json({ error: "Assistant failed. Try again." }, { status: 500 });
  }
}
