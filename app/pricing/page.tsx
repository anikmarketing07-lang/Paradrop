"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, ArrowLeft, Loader2, CheckCircle2, RefreshCw, CreditCard, Smartphone, Crown, Flame } from "lucide-react";

type Interval = "monthly" | "quarterly" | "yearly" | "lifetime";
type PayMethod = "card" | "upi";

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

function intervalLabel(interval: Interval) {
  if (interval === "monthly") return "monthly";
  if (interval === "quarterly") return "every 3 months";
  if (interval === "lifetime") return "lifetime";
  return "yearly";
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
  const [payMethod, setPayMethod] = useState<PayMethod>("upi");
  const [showUpiModal, setShowUpiModal] = useState<{ plan: Plan; price: ReturnType<typeof calculatePrice>; interval: Interval } | null>(null);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      const lang = (typeof navigator !== "undefined" ? navigator.language : "") || "";
      const isIndia =
        tz === "Asia/Kolkata" ||
        tz === "Asia/Calcutta" ||
        lang.toLowerCase().endsWith("-in") ||
        lang.toLowerCase().startsWith("hi");
      setPayMethod(isIndia ? "upi" : "card");
    } catch {
      // fallback stays UPI
    }
  }, []);

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
        // Razorpay not configured — fall back to manual UPI
        const planObj = plan === "lifetime" ? LIFETIME_PLAN : plans.find((p) => p.stripePlan === plan);
        if (planObj) {
          setPayMethod("upi");
          openUpiModal(planObj, useInterval);
        }
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

  function openUpiModal(plan: Plan, intervalOverride?: Interval) {
    const useInterval = intervalOverride || interval;
    const price = plan.id === "lifetime"
      ? { perMonthUSD: 0, totalUSD: 0, totalINR: LIFETIME_INR, months: 0 }
      : calculatePrice(plan.basePrice, useInterval);
    setShowUpiModal({ plan, price, interval: useInterval });
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
              {payMethod === "upi" ? (
                <button
                  onClick={() => openUpiModal(LIFETIME_PLAN, "lifetime")}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/40 transition-all"
                >
                  <Smartphone size={14} /> Pay ₹{LIFETIME_INR} via UPI
                </button>
              ) : (
                <button
                  onClick={() => handleRazorpayCheckout("lifetime", "lifetime")}
                  disabled={loading === "lifetime"}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/40 transition-all disabled:opacity-50"
                >
                  {loading === "lifetime" ? <Loader2 size={14} className="animate-spin" /> : <Crown size={14} />}
                  Claim lifetime ₹{LIFETIME_INR}
                </button>
              )}
              <p className="text-[10px] text-[#08090A]/65 mt-2">Backed by 7-day refund. No questions asked.</p>
            </div>
          </div>
        </div>

        {/* Payment method toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-1 bg-[#EEEDE7] border border-[#08090A]/10 rounded-xl p-1">
            <button
              onClick={() => setPayMethod("card")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                payMethod === "card"
                  ? "bg-gradient-to-br from-emerald-600 to-emerald-600 text-[#08090A]"
                  : "text-[#08090A]/75 hover:text-[#08090A]"
              }`}
            >
              <CreditCard size={14} /> Instant <span className="text-[10px] bg-emerald-500/12 text-emerald-600 px-1.5 py-0.5 rounded">Card · UPI · Wallet</span>
            </button>
            <button
              onClick={() => setPayMethod("upi")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                payMethod === "upi"
                  ? "bg-gradient-to-br from-emerald-600 to-emerald-600 text-[#08090A]"
                  : "text-[#08090A]/75 hover:text-[#08090A]"
              }`}
            >
              <Smartphone size={14} /> Manual UPI
            </button>
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
            const isUpi = payMethod === "upi";
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
                      : isUpi
                      ? `Manual UPI · pay then submit txn ID`
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
                ) : isUpi ? (
                  <button
                    onClick={() => openUpiModal(p)}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                      p.highlight
                        ? "btn-gradient text-white"
                        : "border border-[#08090A]/12 bg-[#08090A]/3 text-[#08090A]/75 hover:text-[#08090A] hover:border-[#08090A]/18 hover:bg-[#EEEDE7]"
                    }`}
                  >
                    Pay ₹{price.totalINR.toLocaleString("en-IN")} via UPI
                  </button>
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

      {/* UPI Modal */}
      {showUpiModal && <UpiModal data={showUpiModal} interval={showUpiModal.interval} onClose={() => setShowUpiModal(null)} />}
    </div>
  );
}

function UpiModal({
  data,
  interval,
  onClose,
}: {
  data: { plan: Plan; price: ReturnType<typeof calculatePrice> };
  interval: Interval;
  onClose: () => void;
}) {
  const upiId = "9303776635@slc";
  const merchantName = "Anik Vishwakarma";
  const note = `Paradrop ${data.plan.name} ${intervalLabel(interval)}`;
  const amount = data.price.totalINR;

  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(upiLink)}&bgcolor=ffffff&color=000000&margin=10`;

  const [txnId, setTxnId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    if (!txnId.trim()) {
      alert("Enter your UPI transaction ID after paying");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/upi/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: data.plan.stripePlan,
          interval,
          amount,
          txnId: txnId.trim(),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setDone(true);
        return;
      }
      if (res.status === 401) {
        if (confirm("Please sign in first. Go to sign-in?")) {
          window.location.href = "/sign-in";
        }
        return;
      }
      alert(body.error || "Failed to submit. Try again.");
    } catch {
      alert("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="gradient-border-animated max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">Payment submitted</h2>
            <p className="text-sm text-[#08090A]/65 mb-6">
              We&apos;ll verify within 12 hours and activate your <strong>{data.plan.name}</strong> plan. You&apos;ll get an email confirmation.
            </p>
            <button onClick={onClose} className="btn-gradient text-white px-6 py-2.5 rounded-lg text-sm font-semibold">
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mb-1">
                  {data.plan.name} · {intervalLabel(interval)}
                </div>
                <h2 className="text-2xl font-bold">Pay ₹{amount.toLocaleString("en-IN")}</h2>
              </div>
              <button onClick={onClose} className="text-[#08090A]/70 hover:text-[#08090A] text-2xl">×</button>
            </div>

            <div className="bg-white p-4 rounded-xl mb-4 flex justify-center">
              <img src={qrUrl} alt="UPI QR" width={280} height={280} />
            </div>

            <div className="text-center mb-4">
              <p className="text-xs text-[#08090A]/70 mb-1">Scan with any UPI app</p>
              <p className="text-xs text-[#08090A]/70">GPay · PhonePe · Paytm · BHIM · Slice</p>
            </div>

            <div className="bg-[#EEEDE7] border border-[#08090A]/10 rounded-lg p-3 mb-4 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#08090A]/70">UPI ID</span>
                <span className="text-[#08090A] font-mono">{upiId}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#08090A]/70">Name</span>
                <span className="text-[#08090A]">{merchantName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#08090A]/70">Amount</span>
                <span className="text-[#08090A] font-semibold">₹{amount.toLocaleString("en-IN")} (fixed)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#08090A]/70">Note</span>
                <span className="text-[#08090A] truncate ml-2 max-w-[60%] text-right">{note}</span>
              </div>
            </div>

            <a
              href={upiLink}
              className="block btn-gradient text-white text-center py-3 rounded-lg text-sm font-semibold mb-4"
            >
              Open UPI app
            </a>

            <div className="border-t border-[#08090A]/10 pt-4">
              <label className="text-xs text-[#08090A]/65 block mb-2">After payment, paste UPI transaction ID</label>
              <input
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                placeholder="UPI Ref / Transaction ID"
                className="w-full bg-[#EEEDE7] border border-[#08090A]/10 rounded-lg px-3 py-2.5 text-sm text-[#08090A] placeholder-white/20 outline-none focus:border-sky-600/50 mb-3"
              />
              <button
                onClick={submit}
                disabled={submitting}
                className="w-full btn-gradient text-white py-3 rounded-lg text-sm font-semibold disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "I've paid — activate my plan"}
              </button>
            </div>

            <p className="text-center text-xs text-[#08090A]/65 mt-4">
              Manual verification within 12 hours. We&apos;ll email confirmation.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
