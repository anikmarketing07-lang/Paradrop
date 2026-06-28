import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "./globals.css";

const GA_ID = "G-QKC2HFVNS5";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const SITE_URL = "https://paradrop.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Paradrop — AI Lead Generation for Freelancers & Agencies",
    template: "%s · Paradrop",
  },
  description:
    "Find local business leads in 30 seconds — phone, email, Instagram & website. AI writes your cold email + WhatsApp DM for each. Built for freelancers and agencies in India. Free to start, no card needed.",
  applicationName: "Paradrop",
  keywords: [
    // Core / brand
    "Paradrop", "AI lead generation", "lead generation tool", "lead generation software", "find leads",
    // Local SMB cluster
    "local business leads", "find local clients", "SMB lead generation", "local lead finder",
    "small business leads", "Google Maps leads scraper", "business email finder",
    // Cold outreach cluster
    "cold email tool", "cold outreach software", "AI cold email writer", "bulk cold email",
    "WhatsApp outreach tool", "Instagram DM outreach", "AI outreach assistant",
    // Freelancer / agency cluster
    "leads for freelancers", "freelance client finder", "get clients for freelancers",
    "agency lead generation", "client acquisition tool", "find clients online",
    // India cluster
    "lead generation India", "find clients in India", "lead generation Mumbai",
    "lead generation Delhi", "lead generation Bangalore", "Indian SMB leads", "UPI lead tool",
    // Competitor / alternative cluster
    "Apollo alternative", "Hunter.io alternative", "Instantly alternative", "cheap lead generation tool",
    "affordable cold email software",
  ],
  authors: [{ name: "Paradrop" }],
  creator: "Paradrop",
  publisher: "Paradrop",
  category: "business",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Paradrop",
    title: "Paradrop — Find local clients in 30 seconds, AI writes the pitch",
    description:
      "20 verified local business leads with phone, email & socials. AI-written cold email + WhatsApp DM for each. Built for freelancers & agencies. Lifetime deal ₹6,000.",
    images: [{ url: "/paradrop-logo.png", width: 1232, height: 1232, alt: "Paradrop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paradrop — AI lead generation for freelancers & agencies",
    description:
      "Find 20 local clients in 30s. AI writes cold email + WhatsApp DM for each. Free to start.",
    images: ["/paradrop-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInForceRedirectUrl="/app"
      signUpForceRedirectUrl="/app"
      signInFallbackRedirectUrl="/app"
      signUpFallbackRedirectUrl="/app"
    >
      <html lang="en" className={`${geist.variable} h-full`}>
        <head>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
          </Script>
        </head>
        <body className="min-h-full bg-[#F7F6F2] text-[#08090A] antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
