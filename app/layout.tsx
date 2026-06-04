import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeadDrop — AI Lead Generation for Freelancers",
  description: "Find high-quality leads and send personalized cold emails in bulk. Free to start. No credit card required.",
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
        <body className="min-h-full bg-[#08080f] text-white antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
