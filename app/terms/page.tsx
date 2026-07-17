import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Paradrop",
  description: "The terms that govern your use of Paradrop.",
  alternates: { canonical: "https://paradrop.in/terms" },
};

const UPDATED = "17 July 2026";

export default function TermsPage() {
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
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-xs text-[#08090A]/55 mb-10">Last updated: {UPDATED}</p>

        <div className="space-y-8 text-sm leading-relaxed text-[#08090A]/80">
          <section>
            <h2 className="text-lg font-bold text-[#08090A] mb-2">1. What Paradrop is</h2>
            <p>
              Paradrop (paradrop.in) helps freelancers and agencies find publicly listed local businesses and draft
              outreach messages with AI. You get lead results and message drafts — what you send, and to whom, is your
              decision and your responsibility.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#08090A] mb-2">2. Your account</h2>
            <p>
              You need an account to use the app. Keep your login secure — activity under your account is your
              responsibility. One account per person; don&apos;t share or resell access.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#08090A] mb-2">3. Acceptable use</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Follow the laws that apply to your outreach (including anti-spam rules in your and your recipients&apos; countries). Honor opt-outs.</li>
              <li>No harassment, deception, or illegal content in messages you send.</li>
              <li>No scraping, reselling, or bulk-exporting Paradrop&apos;s output as a data product.</li>
              <li>No attempts to bypass plan limits, probe, or disrupt the service.</li>
            </ul>
            <p className="mt-2">We may suspend accounts that break these rules.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#08090A] mb-2">4. Plans and payments</h2>
            <p>
              Free and paid plans are described on the <Link href="/pricing" className="text-emerald-700 hover:underline">pricing page</Link>.
              Payments are processed by Razorpay. Paid cycles are pay-per-cycle — we don&apos;t auto-charge renewals.
              Refunds are governed by our <Link href="/refunds" className="text-emerald-700 hover:underline">Refund Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#08090A] mb-2">5. No guarantees</h2>
            <p>
              Lead data comes from public sources and may be incomplete or out of date. AI drafts may need editing.
              We don&apos;t guarantee replies, clients, or revenue — Paradrop is a tool, not an agency.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#08090A] mb-2">6. Liability</h2>
            <p>
              The service is provided &quot;as is.&quot; To the maximum extent permitted by law, our total liability for any
              claim is limited to the amount you paid us in the 3 months before the claim arose.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#08090A] mb-2">7. Changes</h2>
            <p>
              We may update these terms as the product evolves; continued use after an update means you accept the new
              terms. Material changes will be noted on this page with a new date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#08090A] mb-2">8. Governing law &amp; contact</h2>
            <p>
              These terms are governed by the laws of India. Questions:{" "}
              <a href="mailto:hello@paradrop.in" className="text-emerald-700 hover:underline">hello@paradrop.in</a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#08090A]/10 flex gap-6 text-xs text-[#08090A]/60">
          <Link href="/privacy" className="hover:text-[#08090A]">Privacy Policy</Link>
          <Link href="/refunds" className="hover:text-[#08090A]">Refund Policy</Link>
          <Link href="/pricing" className="hover:text-[#08090A]">Pricing</Link>
        </div>
      </article>
    </div>
  );
}
