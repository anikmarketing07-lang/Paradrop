import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Paradrop",
  description: "How Paradrop collects, uses, and protects your data.",
  alternates: { canonical: "https://paradrop.in/privacy" },
};

const UPDATED = "17 July 2026";

export default function PrivacyPage() {
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
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-xs text-[#08090A]/55 mb-10">Last updated: {UPDATED}</p>

        <div className="space-y-8 text-sm leading-relaxed text-[#08090A]/80">
          <section>
            <h2 className="text-lg font-bold text-[#08090A] mb-2">What we collect</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Account data</strong> — your name and email address, handled by our authentication provider (Clerk) when you sign up.</li>
              <li><strong>Usage counters</strong> — how many leads and AI messages you generate, so we can enforce plan limits.</li>
              <li><strong>Payment data</strong> — payments are processed by Razorpay. We never see or store your card number, UPI ID, or bank details. We keep only the payment reference, plan, and amount.</li>
              <li><strong>Analytics</strong> — anonymous page-view analytics (Google Analytics) to understand how the site is used.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#08090A] mb-2">Lead data</h2>
            <p>
              When you run a search, Paradrop fetches publicly available business information (name, phone, website,
              address) from Google Places and public websites, on your request. Results are shown to you in your browser
              — we do not maintain a stored database of these businesses. To generate outreach drafts, lead details are
              sent to our AI provider (Groq) and are not used to train models.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#08090A] mb-2">What we don&apos;t do</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>We don&apos;t sell your personal data. Ever.</li>
              <li>We don&apos;t send email or messages on your behalf — outreach is always sent from your own accounts, by you.</li>
              <li>We don&apos;t store your payment credentials.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#08090A] mb-2">Cookies</h2>
            <p>
              We use essential cookies for sign-in sessions (Clerk) and basic analytics cookies. No cross-site ad
              tracking.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#08090A] mb-2">Your rights</h2>
            <p>
              You can ask us to export or delete your account data at any time. Email{" "}
              <a href="mailto:hello@paradrop.in" className="text-emerald-700 hover:underline">hello@paradrop.in</a> and
              we&apos;ll action it within 7 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#08090A] mb-2">Contact</h2>
            <p>
              Questions about this policy:{" "}
              <a href="mailto:hello@paradrop.in" className="text-emerald-700 hover:underline">hello@paradrop.in</a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#08090A]/10 flex gap-6 text-xs text-[#08090A]/60">
          <Link href="/terms" className="hover:text-[#08090A]">Terms of Service</Link>
          <Link href="/refunds" className="hover:text-[#08090A]">Refund Policy</Link>
          <Link href="/pricing" className="hover:text-[#08090A]">Pricing</Link>
        </div>
      </article>
    </div>
  );
}
