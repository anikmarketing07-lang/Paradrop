import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Lifetime ₹6,000, or start free",
  description:
    "Simple pricing for Paradrop. Start free with 20 leads/month, or grab the lifetime deal at ₹6,000 (first 100 buyers). Pay via UPI, card, wallet or netbanking. No auto-charge.",
  alternates: { canonical: "https://paradrop.in/pricing" },
  openGraph: {
    title: "Paradrop pricing — Lifetime ₹6,000 or start free",
    description:
      "20 free leads/month, or lifetime access for ₹6,000. AI cold email + WhatsApp DM included.",
    url: "https://paradrop.in/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
