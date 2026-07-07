"use client";

import { useState, useRef, useEffect } from "react";
import { Crown, Loader2, Send, Sparkles, X, Lock } from "lucide-react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string };

type Plan = "free" | "pro" | "agency" | "lifetime";

const PREMIUM_PLANS = new Set<Plan>(["pro", "agency", "lifetime"]);

const SUGGESTED_PROMPTS = [
  "Suggest 3 hot niches for a React developer in Mumbai",
  "Rewrite my pitch to sound less salesy",
  "How do I follow up without being annoying?",
  "What's the best WhatsApp opener for cold outreach?",
];

export default function AssistantWidget({ plan }: { plan: Plan }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isPremium = PREMIUM_PLANS.has(plan);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error || "Something went wrong. Try again." },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Try again." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Floating launcher button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-500 text-white px-4 py-3 rounded-full shadow-lg shadow-amber-500/40 hover:scale-105 transition-transform"
          title="AI assistant"
        >
          <Crown size={16} fill="white" />
          <span className="text-sm font-semibold">Ask AI</span>
          <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Premium
          </span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-40 w-[92vw] max-w-sm h-[70vh] max-h-[600px] flex flex-col bg-white border border-[#08090A]/12 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#08090A]/10 bg-gradient-to-r from-amber-500/8 to-orange-500/8">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Crown size={13} className="text-white" fill="white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#08090A] flex items-center gap-1.5">
                  Paradrop AI
                  <span className="text-[9px] bg-amber-500/15 text-amber-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    Premium
                  </span>
                </div>
                <div className="text-[10px] text-[#08090A]/70">Sales assistant · powered by Llama 3.3</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-md flex items-center justify-center text-[#08090A]/70 hover:text-[#08090A] hover:bg-[#EEEDE7] transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          {!isPremium ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/12 border border-amber-500/30 flex items-center justify-center mb-4">
                <Lock size={22} className="text-amber-500" />
              </div>
              <h3 className="text-base font-bold text-[#08090A] mb-2">AI assistant locked</h3>
              <p className="text-xs text-[#08090A]/75 leading-relaxed mb-5">
                Upgrade to <strong className="text-amber-500">Lifetime (₹5,999)</strong> or Pro to unlock the AI sales coach. Suggests niches, rewrites your pitch, plans your follow-ups.
              </p>
              <Link
                href="/pricing"
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-amber-500/40 transition-all"
              >
                <Crown size={14} fill="white" /> Unlock with Lifetime
              </Link>
              <p className="text-[10px] text-[#08090A]/65 mt-3">7-day refund. No questions asked.</p>
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.length === 0 && (
                  <div>
                    <div className="text-xs text-[#08090A]/70 mb-3 flex items-center gap-1.5">
                      <Sparkles size={11} className="text-amber-500" />
                      Try one of these:
                    </div>
                    <div className="space-y-2">
                      {SUGGESTED_PROMPTS.map((p) => (
                        <button
                          key={p}
                          onClick={() => send(p)}
                          className="w-full text-left text-xs bg-[#EEEDE7] hover:bg-[#EAEAE4] border border-[#08090A]/10 hover:border-amber-500/30 text-[#08090A]/75 hover:text-[#08090A] px-3 py-2.5 rounded-lg transition-all"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        m.role === "user"
                          ? "bg-emerald-600 text-white rounded-br-sm"
                          : "bg-[#EEEDE7] text-[#08090A]/85 rounded-bl-sm border border-[#08090A]/8"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex justify-start">
                    <div className="bg-[#EEEDE7] text-[#08090A]/65 border border-[#08090A]/8 rounded-2xl rounded-bl-sm px-3 py-2 text-sm flex items-center gap-2">
                      <Loader2 size={12} className="animate-spin" /> Thinking...
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="px-3 py-3 border-t border-[#08090A]/10 flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about outreach..."
                  disabled={sending}
                  className="flex-1 bg-[#EEEDE7] border border-[#08090A]/10 rounded-lg px-3 py-2 text-sm text-[#08090A] placeholder-white/30 outline-none focus:border-amber-500/40 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-[#08090A] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                >
                  {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
