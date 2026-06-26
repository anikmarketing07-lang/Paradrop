"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, ArrowLeft, Loader2, CheckCircle2, RefreshCw, Crown, Flame } from "lucide-react";

type Interval = "monthly" | "quarterly" | "yearly" | "lifetime";

const LIFETIME_INR = 1499;

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const INTERVAL_LABELS: Record<Interval, string> = {
  monthly: "Monthly",
  quarterly: "3 months",
  yearly: "Yearly",
  lifetime: "Lifetime",
};

const INTERVAL_DISCOUNT: Record<Interval, number> = {
  monthly: 0,
  quarterly: 10,
  yearly: 20,
  lifetime: 0,
};

const USD_TO_INR = 84;

type Plan = {
  id: string;
  name: string;
  basePrice: number;
  desc: string;
  features: string[];
  highlight: boolean;
  stripePlan: string | null;
  href: string | null;
};

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    basePrice: 0,
    desc: "Get started, find your first clients.",
    features: ["20 leads / 30 days", "AI email writing", "Gmail send", "Basic tracking"],
    highlight: false,
    stripePlan: null,
    href: "/sign-up",
  },
  {
    id: "pro",
    name: "Pro",
    basePrice: 19,
    desc: "For freelancers serious about growth.",
    features: ["500 leads / 30 days", "AI email writing", "Bulk send (200/day)", "Full tracking + analytics", "Follow-up sequences", "Priority support"],
    highlight: true,
    stripePlan: "pro",
    href: null,
  },
  {
    id: "agency",
    name: "Agency",
    basePrice: 49,
    desc: "For agencies & power users.",
    features: ["Unlimited leads", "Everything in Pro", "Multiple Gmail accounts", "Team access (3 seats)", "API access", "Dedicated support"],
    highlight: false,
    stripePlan: "agency",
    href: null,
  },
];

function calculatePrice(basePrice: number, interval: Interval) {
  if (basePrice === 0) return { perMonthUSD: 0, totalUSD: 0, totalINR: 0, months: 0 };
  if (interval === "lifetime") {
    return { perMonthUSD: 0, totalUSD: LIFETIME_INR / USD_TO_INR, totalINR: LIFETIME_INR, months: 0 };
  }
  const discount = INTERVAL_DISCOUNT[interval];
  const months = interval === "monthly" ? 1 : interval === "quarterly" ? 3 : 12;
  const totalUSD = basePrice * months * (1 - discount / 100);
  const perMonthUSD = totalUSD / months;
  const totalINR = Math.round(totalUSD * USD_TO_INR);
  return { perMonthUSD, totalUSD, totalINR, months };
}

const LIFETIME_PLAN: Plan = {
  id: "lifetime",
  name: "Lifetime",
  basePrice: LIFETIME_INR,
  desc: "Pay once. Use forever. First 100 buyers only.",
  features: [
    "5,000 leads / month forever",
    "AI email + DM generation",
    "WhatsApp + Instagram + Facebook outreach",
    "All future features included",
    "Priority support",
    "No recurring charges",
  ],
  highlight: true,
  stripePlan: "lifetime",
  href: null,
};

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [interval, setInterval] = useState<Interval>("monthly");

  async function handleRazorpayCheckout(plan: string, intervalOverride?: Interval) {
    setLoading(plan);
    const useInterval = intervalOverride || interval;
    try {
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval: useInterval }),
      });
      const order = await orderRes.json();

      if (orderRes.status === 401) {
        window.location.href = "/sign-in";
        return;
      }
      if (orderRes.status === 503) {
        alert("Payments are temporarily unavailable. Please try again in a moment.");
        return;
      }
      if (!orderRes.ok || !order.orderId) {
        alert(order.error || "Failed to create order. Try again.");
        return;
      }

      const scriptOK = await loadRazorpayScript();
      if (!scriptOK || !window.Razorpay) {
        alert("Could not load payment SDK. Check your internet connection.");
        return;
      }

      const planLabel = plan === "pro" ? "Pro" : plan === "agency" ? "Agency" : "Lifetime";
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Paradrop",
        description: `${planLabel} plan (${useInterval})`,
        order_id: order.orderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan,
              interval: useInterval,
            }),
          });
          const verify = await verifyRes.json();
          if (verifyRes.ok) {
            window.location.href = "/app?upgraded=true";
          } else {
            alert(verify.error || "Payment verification failed. Contact support with your payment ID: " + response.razorpay_payment_id);
          }
        },
        prefill: {},
        theme: { color: "#7c3aed" },
        modal: {
          ondismiss: () => setLoading(null),
        },
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#08090A]">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-sky-600/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[80px]" />
      </div>

      <nav className="border-b border-[#08090A]/10 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-600 flex items-center justify-center">
            <Zap size={13} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-sm">Paradrop</span>
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-sm text-[#08090A]/70 hover:text-[#08090A] transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="text-emerald-600 text-sm font-medium mb-3 uppercase tracking-wider">Pricing</div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Start free. <span className="shimmer-text">Scale when ready.</span>
          </h1>
          <p className="text-[#08090A]/70">Auto-renews each cycle. Cancel anytime. No refunds on partial periods.</p>
        </div>

        {/* === LIFETIME DEAL HERO === */}
        <div className="mb-12 gradient-border-animated glow-violet p-7 md:p-9 relative overflow-hidden">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase shadow-lg shadow-amber-500/40 flex items-center gap-1">
            <Flame size={11} /> Limited launch deal
          </div>
          <div className="md:flex items-center gap-8">
            <div className="flex-1 mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-2 text-amber-500 text-xs font-bold uppercase tracking-wider">
                <Crown size={14} /> Lifetime Access
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Pay once. <span className="shimmer-text">Use forever.</span>
              </h2>
              <p className="text-[#08090A]/65 text-sm mb-4">
                First 100 buyers only. After that, it&apos;s ₹4,116/year forever. Save 96% vs. monthly.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {LIFETIME_PLAN.features.map((f) => (
                  <div key={f} className="flex items-start gap-1.5 text-xs text-[#08090A]/75">
                    <CheckCircle2 size={12} className="text-amber-500 shrink-0 mt-0.5" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-64 text-center md:text-right">
              <div className="flex items-baseline gap-2 justify-center md:justify-end mb-1">
                <span className="text-[#08090A]/65 line-through text-lg">₹4,116</span>
                <span className="text-5xl font-bold text-[#08090A]">₹{LIFETIME_INR.toLocaleString("en-IN")}</span>
              </div>
              <div className="text-xs text-amber-500 font-semibold mb-4">One time. Never pay again.</div>
              <button
                onClick={() => handleRazorpayCheckout("lifetime", "lifetime")}
                disabled={loading === "lifetime"}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/40 transition-all disabled:opacity-50"
              >
                {loading === "lifetime" ? <Loader2 size={14} className="animate-spin" /> : <Crown size={14} />}
                Claim lifetime ₹{LIFETIME_INR}
              </button>
              <p className="text-[10px] text-[#08090A]/65 mt-2">Backed by 7-day refund. No questions asked.</p>
            </div>
          </div>
        </div>

        {/* Interval toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-1 bg-[#EEEDE7] border border-[#08090A]/10 rounded-xl p-1">
            {(["monthly", "quarterly", "yearly"] as Interval[]).map((i) => (
              <button
                key={i}
                onClick={() => setInterval(i)}
                className={`relative px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  interval === i
                    ? "bg-gradient-to-br from-emerald-600 to-emerald-600 text-[#08090A]"
                    : "text-[#08090A]/75 hover:text-[#08090A]"
                }`}
              >
                {INTERVAL_LABELS[i]}
                {INTERVAL_DISCOUNT[i] > 0 && (
                  <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    interval === i ? "bg-white/20 text-[#08090A]" : "bg-emerald-500/12 text-emerald-600"
                  }`}>
                    -{INTERVAL_DISCOUNT[i]}%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => {
            const price = calculatePrice(p.basePrice, interval);
            return (
              <div
                key={p.id}
                className={`${p.highlight ? "gradient-border-animated glow-violet" : "gradient-border"} p-7 relative card-hover`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 btn-gradient text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
                    Most popular
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-sm font-medium text-[#08090A]/65 mb-1">{p.name}</div>
                  <div className="flex items-baseline gap-1 mb-1">
                    {p.basePrice === 0 ? (
                      <span className="text-5xl font-bold text-[#08090A]">₹0</span>
                    ) : (
                      <>
                        <span className="text-5xl font-bold text-[#08090A]">₹{price.totalINR.toLocaleString("en-IN")}</span>
                        <span className="text-[#08090A]/70 text-sm">/{interval === "monthly" ? "mo" : interval === "quarterly" ? "3mo" : "yr"}</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-[#08090A]/70 min-h-[2.5em]">
                    {p.basePrice === 0
                      ? "Free forever, no card needed."
                      : `One-click via UPI, card, wallet, or netbanking`}
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-[#08090A]/75">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>

                {p.href ? (
                  <Link
                    href={p.href}
                    className="block text-center py-3 rounded-lg text-sm font-semibold border border-[#08090A]/12 bg-[#08090A]/3 text-[#08090A]/75 hover:text-[#08090A] hover:border-[#08090A]/18 hover:bg-[#EEEDE7] transition-all"
                  >
                    Start free
                  </Link>
                ) : (
                  <button
                    onClick={() => p.stripePlan && handleRazorpayCheckout(p.stripePlan)}
                    disabled={loading === p.stripePlan}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                      p.highlight
                        ? "btn-gradient text-white"
                        : "border border-[#08090A]/12 bg-[#08090A]/3 text-[#08090A]/75 hover:text-[#08090A] hover:border-[#08090A]/18 hover:bg-[#EEEDE7]"
                    } disabled:opacity-50`}
                  >
                    {loading === p.stripePlan ? <Loader2 size={14} className="animate-spin" /> : null}
                    Pay ₹{price.totalINR.toLocaleString("en-IN")}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Renewal note */}
        <div className="mt-10 max-w-2xl mx-auto gradient-border p-5 flex items-start gap-3">
          <RefreshCw size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-[#08090A] mb-1">Pay-per-cycle (no auto-charge)</div>
            <p className="text-xs text-[#08090A]/75 leading-relaxed">
              One-time payment per billing cycle. We&apos;ll email you 3 days before expiry to renew. No auto-charge — you&apos;re in control.
            </p>
          </div>
        </div>

        <p className="text-center text-[#08090A]/50 text-xs mt-8">
          Questions? Email <a href="mailto:hello@paradrop.in" className="underline hover:text-[#08090A]/70">hello@paradrop.in</a>
        </p>
      </div>
    </div>
  );
}
