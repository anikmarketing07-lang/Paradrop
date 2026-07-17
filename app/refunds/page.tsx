import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Paradrop",
  description: "Paradrop's refund and cancellation policy — clear and simple.",
  alternates: { canonical: "https://paradrop.in/refunds" },
};

const UPDATED = "17 July 2026";

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#08090A]">
      <nav className="border-b border-[#08090A]/10 px-6 py-4 flex items-center justify-between max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/paradrop-logo.png" alt="Paradrop" width={28} height={28} className="rounded-lg object-cover" />
          <span className="font-bold text-sm">Paradrop</span>
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-sm text-[#08090A]/70 hover:text-[#08090A] transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>
      </nav>

      <article className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Refund &amp; Cancellation Policy</h1>
        <p className="text-xs text-[#08090A]/55 mb-10">Last updated: {UPDATED}</p>

        <div className="space-y-8 text-sm leading-relaxed text-[#08090A]/80">
          <section>
            <h2 className="text-lg font-bold text-[#08090A] mb-2">Lifetime plan — 7-day money-back</h2>
            <p>
              If you buy the Lifetime plan and it isn&apos;t for you, email us within <strong>7 days of purchase</strong>{" "}
              and we&apos;ll refund you in full. No questions asked.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#08090A] mb-2">Monthly / 3-month / yearly plans</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Plans are <strong>pay-per-cycle</strong> — there is no auto-charge. When a cycle ends, you choose whether to renew.</li>
              <li>&quot;Cancelling&quot; simply means not renewing — you keep access until the end of the paid cycle.</li>
              <li>We don&apos;t offer pro-rated refunds for partially used cycles.</li>
              <li>If you were charged but your plan wasn&apos;t activated, or you were charged twice, contact us within 7 days — we&apos;ll fix it or refund in full.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#08090A] mb-2">How refunds are paid</h2>
            <p>
              Approved refunds go back to your original payment method via Razorpay, typically within{" "}
              <strong>5–7 business days</strong> depending on your bank.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#08090A] mb-2">How to request</h2>
            <p>
              Email <a href="mailto:hello@paradrop.in" className="text-emerald-700 hover:underline">hello@paradrop.in</a>{" "}
              from your account email with your payment ID (you get it from Razorpay&apos;s confirmation). We respond within
              48 hours.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#08090A]/10 flex gap-6 text-xs text-[#08090A]/60">
          <Link href="/privacy" className="hover:text-[#08090A]">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#08090A]">Terms of Service</Link>
          <Link href="/pricing" className="hover:text-[#08090A]">Pricing</Link>
        </div>
      </article>
    </div>
  );
}
