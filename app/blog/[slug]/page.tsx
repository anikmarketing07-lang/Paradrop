import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { getPost, posts } from "@/lib/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };
  const url = `https://paradrop.in/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: ["Paradrop"],
      images: ["/paradrop-logo.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/paradrop-logo.png"],
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: "https://paradrop.in/paradrop-logo.png",
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "Paradrop", url: "https://paradrop.in" },
    publisher: {
      "@type": "Organization",
      name: "Paradrop",
      logo: { "@type": "ImageObject", url: "https://paradrop.in/paradrop-logo.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://paradrop.in/blog/${post.slug}` },
    keywords: post.keywords.join(", "),
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#08090A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <nav className="border-b border-[#08090A]/10 px-6 py-4 flex items-center justify-between max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/paradrop-logo.png" alt="Paradrop" width={28} height={28} className="rounded-lg object-cover" />
          <span className="font-bold text-sm">Paradrop</span>
        </Link>
        <Link href="/blog" className="flex items-center gap-1.5 text-sm text-[#08090A]/70 hover:text-[#08090A] transition-colors">
          <ArrowLeft size={14} /> All posts
        </Link>
      </nav>

      <article className="max-w-2xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 text-xs text-[#08090A]/55 mb-4">
          <span>{new Date(post.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock size={11} /> {post.readMins} min read</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-6">{post.title}</h1>
        <p className="text-lg text-[#08090A]/75 leading-relaxed mb-10 border-l-2 border-emerald-600 pl-4">{post.description}</p>

        <div className="space-y-5">
          {post.body.map((b, i) => {
            if (b.type === "h2") {
              return <h2 key={i} className="text-xl md:text-2xl font-bold mt-8 mb-3">{b.text}</h2>;
            }
            if (b.type === "ul") {
              return (
                <ul key={i} className="space-y-2 pl-5 list-disc text-[#08090A]/80 leading-relaxed">
                  {b.items.map((it, j) => <li key={j}>{it}</li>)}
                </ul>
              );
            }
            return <p key={i} className="text-[#08090A]/80 leading-relaxed">{b.text}</p>;
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 gradient-border-animated p-7 text-center">
          <h3 className="text-xl font-bold mb-2">Want this on autopilot?</h3>
          <p className="text-sm text-[#08090A]/70 mb-5">
            Paradrop pulls 20 local leads in 30 seconds and auto-writes the cold email + WhatsApp DM for each. Lifetime deal ₹5,999.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 btn-gradient text-white px-6 py-3 rounded-lg font-semibold text-sm"
          >
            Try Paradrop free <ArrowRight size={14} />
          </Link>
        </div>
      </article>
    </div>
  );
}
