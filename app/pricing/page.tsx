"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, ArrowLeft, Loader2 } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Get started, find your first clients.",
    features: ["20 leads / month", "AI email writing", "Gmail send", "Basic tracking"],
    cta: "Start free",
    href: "/sign-up",
    highlight: false,
    stripePlan: null,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "per month",
    desc: "For freelancers serious about growth.",
    features: ["500 leads / month", "AI email writing", "Bulk send (200/day)", "Full tracking + analytics", "Follow-up sequences", "Priority support"],
    cta: "Upgrade to Pro",
    href: null,
    highlight: true,
    stripePlan: "pro",
  },
  {
    id: "agency",
    name: "Agency",
    price: "$49",
    period: "per month",
    desc: "For agencies & power users.",
    features: ["Unlimited leads", "Everything in Pro", "Multiple Gmail accounts", "Team access (3 seats)", "API access", "Dedicated support"],
    cta: "Upgrade to Agency",
    href: null,
    highlight: false,
    stripePlan: "agency",
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleUpgrade(plan: string) {
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else if (res.status === 401) window.location.href = "/sign-in";
    } catch {
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/8 rounded-full blur-[100px]" />
      </div>

      <nav className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
            <Zap size={12} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-sm">LeadDrop</span>
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="text-violet-400 text-sm font-medium mb-3">Pricing</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Start free. Scale when ready.</h1>
          <p className="text-white/40">No credit card required to start. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`gradient-border p-6 relative ${p.highlight ? "ring-1 ring-violet-600/50" : ""}`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
                  Most popular
                </div>
              )}
              <div className="mb-6">
                <div className="text-sm font-medium text-white/60 mb-1">{p.name}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold text-white">{p.price}</span>
                  <span className="text-white/40 text-sm">/{p.period}</span>
                </div>
                <p className="text-sm text-white/40">{p.desc}</p>
              </div>

              <div className="space-y-3 mb-8">
                {p.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="text-violet-400 text-xs">✓</span>
                    {f}
                  </div>
                ))}
              </div>

              {p.href ? (
                <Link
                  href={p.href}
                  className="block text-center py-2.5 rounded-lg text-sm font-semibold border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all"
                >
                  {p.cta}
                </Link>
              ) : (
                <button
                  onClick={() => p.stripePlan && handleUpgrade(p.stripePlan)}
                  disabled={loading === p.stripePlan}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    p.highlight
                      ? "bg-violet-600 hover:bg-violet-500 text-white hover:shadow-lg hover:shadow-violet-600/30"
                      : "border border-white/10 text-white/70 hover:text-white hover:border-white/20"
                  } disabled:opacity-50`}
                >
                  {loading === p.stripePlan ? <Loader2 size={14} className="animate-spin" /> : null}
                  {p.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-white/20 text-xs mt-10">
          Questions? Email us at <a href="mailto:hello@leaddrop.io" className="underline hover:text-white/40">hello@leaddrop.io</a>
        </p>
      </div>
    </div>
  );
}
