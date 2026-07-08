import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft, Clock } from "lucide-react";
import { posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Cold outreach & lead generation guides for Indian freelancers",
  description:
    "Practical guides on finding local clients, cold outreach, WhatsApp templates and lead generation — written for freelancers and agencies in India.",
  alternates: { canonical: "https://paradrop.in/blog" },
  openGraph: {
    title: "Paradrop blog — outreach & lead generation guides",
    description:
      "Guides on cold outreach, finding local clients and lead generation in India.",
    url: "https://paradrop.in/blog",
  },
};

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#08090A]">
      <nav className="border-b border-[#08090A]/10 px-6 py-4 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/paradrop-logo.png" alt="Paradrop" width={28} height={28} className="rounded-lg object-cover" />
          <span className="font-bold text-sm">Paradrop</span>
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-sm text-[#08090A]/70 hover:text-[#08090A] transition-colors">
          <ArrowLeft size={14} /> Home
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-emerald-600 text-sm font-medium mb-3 uppercase tracking-wider">Blog</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Cold outreach &amp; lead generation, <span className="text-emerald-600">no fluff</span>.
          </h1>
          <p className="text-[#08090A]/70 text-lg leading-relaxed">
            Practical guides for freelancers and agencies in India. Find clients, write better outreach, close more deals.
          </p>
        </div>

        <div className="space-y-4">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="block gradient-border p-6 card-hover"
            >
              <div className="flex items-center gap-3 text-xs text-[#08090A]/55 mb-2">
                <span>{new Date(p.date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {p.readMins} min read</span>
              </div>
              <h2 className="text-xl font-bold mb-2 leading-snug">{p.title}</h2>
              <p className="text-sm text-[#08090A]/75 leading-relaxed">{p.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
