import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Target, Mail, TrendingUp, Shield, Users, Sparkles, CheckCircle2, Clock, Repeat, Search, Flame, MessageCircle } from "lucide-react";
import AssistantWidget from "./app/AssistantWidget";

const stats = [
  { value: "50+", label: "Leads per search" },
  { value: "8 sec", label: "To your first batch" },
  { value: "3", label: "Channels: email · WhatsApp · IG" },
  { value: "₹0", label: "To get started" },
];

const features = [
  {
    icon: Target,
    title: "Laser-targeted lead search",
    desc: "Filter by industry, company size, role, location, and tech stack. Find decision-makers who actually need your skills.",
    tag: "Find",
  },
  {
    icon: Sparkles,
    title: "AI writes every email",
    desc: "Llama 3.3 reads each lead's profile and writes a unique, personalized cold email. Not a template — an actual human-sounding pitch.",
    tag: "Personalize",
  },
  {
    icon: Mail,
    title: "Bulk send via your Gmail",
    desc: "Send 50-200 emails in one click using your own Gmail. Your domain, your reputation, your deliverability.",
    tag: "Send",
  },
  {
    icon: TrendingUp,
    title: "Track opens & replies",
    desc: "See who opened, who clicked, who replied. Follow up with one click on hot leads. Close more deals.",
    tag: "Close",
  },
  {
    icon: Shield,
    title: "Verified emails only",
    desc: "Every lead email is verified before sending. No bounces, no spam flags, no wasted quota.",
    tag: "Verified",
  },
  {
    icon: Users,
    title: "Built for freelancers & sales reps",
    desc: "No enterprise bloat. No 6-month contracts. No team seats you don't need. Made for solo operators who close deals.",
    tag: "Simple",
  },
];

const howItWorks = [
  { step: "01", title: "Define your niche", desc: "Tell us who to target — 'Shopify agencies' or 'SaaS startups in Series A'. Be as specific as you want." },
  { step: "02", title: "AI finds 20 leads", desc: "In 10 seconds, get 20 verified decision-makers matching your niche. Names, roles, companies, emails." },
  { step: "03", title: "Generate emails", desc: "AI writes a unique cold email for each lead. Mentions their company. Hooks their pain. Soft CTA." },
  { step: "04", title: "Send via Gmail", desc: "Review, edit if needed, send. Uses your Gmail — best deliverability. Track opens and replies." },
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Get started, find your first clients.",
    features: ["20 leads / month", "AI email writing", "Gmail send", "Basic tracking"],
    cta: "Start free",
    href: "/app",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    desc: "For freelancers serious about growth.",
    features: ["500 leads / month", "AI email writing", "Bulk send (200/day)", "Full tracking + analytics", "Follow-up sequences", "Priority support"],
    cta: "Get Pro",
    href: "/pricing",
    highlight: true,
  },
  {
    name: "Agency",
    price: "$49",
    period: "per month",
    desc: "For agencies & power users.",
    features: ["Unlimited leads", "Everything in Pro", "Multiple Gmail accounts", "Team access (3 seats)", "API access", "Dedicated support"],
    cta: "Get Agency",
    href: "/pricing",
    highlight: false,
  },
];

const useCases = [
  {
    icon: Search,
    title: "Find local businesses fast",
    desc: "Type a niche + city and get up to 50 real businesses — with phone, email, website and socials — in seconds.",
  },
  {
    icon: Mail,
    title: "AI writes the first draft",
    desc: "Paradrop reads each business's own website, then writes a personalized cold email. No blank-page paralysis.",
  },
  {
    icon: MessageCircle,
    title: "Reach them where they reply",
    desc: "Email, WhatsApp, and Instagram DMs — pick the channel each lead actually answers on.",
  },
  {
    icon: Target,
    title: "Real contact info, not guesses",
    desc: "Emails are MX-verified before you see them, plus direct phone numbers and social handles pulled live.",
  },
  {
    icon: Zap,
    title: "Skip the manual grind",
    desc: "No more copy-pasting off Google Maps into spreadsheets. One search does the grunt work for you.",
  },
  {
    icon: Repeat,
    title: "One tool, not five",
    desc: "Replaces a scraper + an email writer + an outreach app. Cheaper, simpler, all in one place.",
  },
];

const faqs = [
  {
    q: "Do I need a credit card to start?",
    a: "No. Free tier gives you 20 leads/month — no card required. Upgrade only when you need more volume.",
  },
  {
    q: "Does my Gmail get banned for cold emailing?",
    a: "Not if you do it right. We rate-limit sends (max 30/day on free, 200/day on Pro) to stay under Gmail's spam thresholds. Way safer than blasting from a single tool's IP.",
  },
  {
    q: "How accurate are the leads?",
    a: "Decision-makers with verified emails only. We don't include unverified contacts in your quota. If a lead bounces, we replace it.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — cancel anytime from your dashboard. You keep access until end of billing period. No refunds on partial months.",
  },
  {
    q: "Do you offer annual billing?",
    a: "Yes. Pay yearly and save 17% — $190/year for Pro, $490/year for Agency. Best value if you plan to use it long-term.",
  },
  {
    q: "Why is it cheaper than Apollo/Hunter?",
    a: "Built for freelancers, not enterprises. No sales team to pay, no fancy CRM features you don't need. Just leads + emails. That's it.",
  },
  {
    q: "What if the AI emails sound robotic?",
    a: "They don't — we use Llama 3.3 with custom prompts tuned for cold outreach. But you can always edit before sending.",
  },
];

const trustLogos = ["Shopify", "Stripe", "Notion", "Linear", "Vercel", "Figma"];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://paradrop.in/#org",
      name: "Paradrop",
      url: "https://paradrop.in",
      logo: "https://paradrop.in/paradrop-logo.png",
      description:
        "AI lead generation for freelancers and agencies — find local clients and auto-write outreach.",
    },
    {
      "@type": "WebSite",
      "@id": "https://paradrop.in/#website",
      url: "https://paradrop.in",
      name: "Paradrop",
      publisher: { "@id": "https://paradrop.in/#org" },
    },
    {
      "@type": "SoftwareApplication",
      name: "Paradrop",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://paradrop.in",
      description:
        "AI lead generation for freelancers and agencies. Find local business leads with phone, email, Instagram and website, then auto-write a personalized cold email and WhatsApp DM for each.",
      offers: [
        { "@type": "Offer", name: "Free", price: "0", priceCurrency: "INR" },
        { "@type": "Offer", name: "Lifetime", price: "5999", priceCurrency: "INR" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Aurora Background */}
      <div className="fixed inset-0 -z-10 bg-[#F7F6F2]">
        <div className="grid-bg" />
        <div className="aurora-bg">
          <div className="aurora-blob aurora-blob-1" />
          <div className="aurora-blob aurora-blob-2" />
          <div className="aurora-blob aurora-blob-3" />
        </div>
      </div>

      {/* Lifetime deal banner */}
      <Link
        href="/pricing"
        className="block relative z-50 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white text-center py-2 px-4 text-xs md:text-sm font-medium hover:brightness-110 transition-all group"
      >
        <span className="inline-flex items-center gap-2 flex-wrap justify-center">
          <Flame size={14} className="animate-pulse" />
          <strong>Launch deal:</strong> Lifetime access ₹5,999
          <span className="hidden md:inline opacity-80">— first 100 buyers only, then ₹15,999/year forever.</span>
          <span className="inline-flex items-center gap-1 font-bold underline-offset-2 group-hover:underline">
            Claim now <ArrowRight size={12} />
          </span>
        </span>
      </Link>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[#08090A]/10 bg-[#F7F6F2]/70 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/paradrop-logo.png" alt="Paradrop" width={32} height={32} className="rounded-xl object-cover glow-soft" />
            <span className="font-bold text-lg tracking-tight">Paradrop</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#08090A]/65">
            <a href="#how-it-works" className="hover:text-[#08090A] transition-colors">How it works</a>
            <a href="#features" className="hover:text-[#08090A] transition-colors">Features</a>
            <a href="#how" className="hover:text-[#08090A] transition-colors">What you get</a>
            <a href="#pricing" className="hover:text-[#08090A] transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[#08090A] transition-colors">FAQ</a>
            <Link href="/blog" className="hover:text-[#08090A] transition-colors">Blog</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/app" className="text-sm text-[#08090A]/65 hover:text-[#08090A] transition-colors hidden sm:block">
              Sign in
            </Link>
            <Link
              href="/app"
              className="text-sm btn-gradient text-white px-4 py-2 rounded-lg font-medium"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 pt-12 md:pt-24 pb-12 md:pb-24 text-center">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 p-0.5 pr-2.5 sm:p-1 sm:pr-3.5 rounded-full bg-[#08090A]/[0.03] hover:bg-[#08090A]/[0.05] border border-[#08090A]/8 text-[10px] sm:text-xs md:text-sm text-[#08090A]/80 transition-all duration-300 hover:scale-[1.02] shadow-sm mb-6 fade-up max-w-full whitespace-nowrap overflow-x-auto select-none">
          <span className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[9px] sm:text-[10px] md:text-xs font-bold tracking-wide uppercase shadow-sm shrink-0">
            <Sparkles className="animate-pulse shrink-0 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-white" />
            New
          </span>
          <span className="font-medium shrink-0">AI outreach across email · WhatsApp · Instagram</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-8 fade-up-delay-1">
          Stop hunting for clients.<br />
          <span className="shimmer-text">Let AI do it.</span>
        </h1>

        <p className="text-lg md:text-xl text-[#08090A]/65 max-w-2xl mx-auto mb-10 leading-relaxed fade-up-delay-2">
          Built for freelancers, sales reps, and indie agencies. Find verified leads, write personalized cold emails with AI, send in bulk — all from one dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12 fade-up-delay-3">
          <Link
            href="/app"
            className="inline-flex items-center justify-center gap-2 btn-gradient text-white px-8 py-4 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-transform"
          >
            Find my first 20 leads
            <ArrowRight size={16} />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center gap-2 border border-[#08090A]/15 bg-white text-[#08090A]/75 hover:text-[#08090A] hover:bg-[#EEEDE7] hover:border-[#08090A]/20 px-8 py-4 rounded-xl text-sm transition-all"
          >
            See how it works
          </a>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-[#08090A]/70 mb-16">
          <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-600" /> No credit card</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-600" /> Cancel anytime</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-600" /> 2 min setup</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#EEEDE7] rounded-2xl overflow-hidden border border-[#08090A]/10 backdrop-blur-xl">
          {stats.map((s) => (
            <div key={s.label} className="bg-[#F7F6F2]/80 px-6 py-7 text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text-violet mb-1">{s.value}</div>
              <div className="text-sm text-[#08090A]/70">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Mockup */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="gradient-border-animated glow-violet rounded-2xl overflow-hidden">
          <div className="bg-white/90 backdrop-blur-xl p-4">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#08090A]/10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 bg-[#EEEDE7] rounded-md px-3 py-1 text-xs text-[#08090A]/70 text-center">
                paradrop.in/app
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="col-span-1 bg-white rounded-xl p-4 border border-[#08090A]/10">
                <div className="text-xs text-[#08090A]/70 mb-3">Search leads</div>
                <div className="space-y-2">
                  {["Shopify agencies", "SaaS startups", "Marketing agencies", "E-commerce"].map((t) => (
                    <div key={t} className="text-xs bg-gradient-to-r from-emerald-600/12 to-emerald-600/6 border border-emerald-600/25 rounded-md px-2 py-1.5 text-emerald-700">{t}</div>
                  ))}
                </div>
                <div className="mt-4 btn-gradient rounded-lg py-2 text-center text-xs font-medium text-white">
                  Find 20 leads →
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 bg-white rounded-xl p-4 border border-[#08090A]/10">
                <div className="text-xs text-[#08090A]/70 mb-3 flex items-center justify-between">
                  <span>Leads found — 20 results</span>
                  <span className="text-emerald-600">100% verified</span>
                </div>
                <div className="space-y-2">
                  {[
                    { name: "James Carter", role: "CEO, Pixel Studio" },
                    { name: "Priya Sharma", role: "Founder, GrowthLab" },
                    { name: "Tom Nguyen", role: "Head of Design, Layr" },
                    { name: "Lisa Park", role: "CTO, BuildFast" },
                  ].map((l) => (
                    <div key={l.name} className="flex items-center justify-between bg-[#EEEDE7] rounded-lg px-3 py-2 border border-[#08090A]/5">
                      <div>
                        <div className="text-xs font-medium text-[#08090A]">{l.name}</div>
                        <div className="text-xs text-[#08090A]/70">{l.role}</div>
                      </div>
                      <div className="text-[10px] text-emerald-700 bg-emerald-500/15 px-2 py-0.5 rounded-full">✓ Verified</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#08090A]/10">
              <div className="text-xs text-[#08090A]/70 mb-2 flex items-center gap-2">
                <Sparkles size={11} className="text-emerald-600" />
                AI-generated email for James Carter
              </div>
              <div className="text-xs text-[#08090A]/75 leading-relaxed">
                <span className="text-[#08090A]/65">Subject: </span>Quick idea for Pixel Studio&apos;s next project<br /><br />
                Hi James, noticed Pixel Studio recently expanded into mobile — congrats on the growth. I help design-focused agencies like yours build faster with React. Worked with 3 similar studios last quarter, cut their dev time by 40%. Worth a 15-min call?
              </div>
              <div className="mt-3 flex gap-2">
                <div className="btn-gradient rounded-md px-3 py-1.5 text-xs font-medium text-white">Send to all 20 →</div>
                <div className="bg-[#EEEDE7] rounded-md px-3 py-1.5 text-xs text-[#08090A]/75">Edit email</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-[#08090A]/10 bg-[#08090A]/[0.03] py-10 mb-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs text-[#08090A]/65 uppercase tracking-wider mb-6">Trusted by freelancers selling to teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {trustLogos.map((l) => (
              <div key={l} className="text-xl font-bold text-[#08090A]/65 hover:text-[#08090A]/65 transition-colors">{l}</div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="text-emerald-600 text-sm font-medium mb-3 uppercase tracking-wider">How it works</div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">From zero to <span className="shimmer-text">50 warm leads</span><br />in under 10 minutes.</h2>
          <p className="text-[#08090A]/75 max-w-xl mx-auto">No sales experience needed. No copywriting skills needed. Just you, your skill, and AI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {howItWorks.map((step, i) => (
            <div key={step.step} className="gradient-border p-6 card-hover relative">
              <div className="text-6xl font-bold text-[#08090A]/[0.06] absolute top-2 right-3">{step.step}</div>
              <div className="relative">
                <div className="text-xs font-semibold text-emerald-600 mb-3 tracking-wider uppercase">Step {i + 1}</div>
                <h3 className="font-semibold text-[#08090A] mb-2 text-lg">{step.title}</h3>
                <p className="text-sm text-[#08090A]/75 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="text-emerald-600 text-sm font-medium mb-3 uppercase tracking-wider">Features</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Everything to land your<br />next client. <span className="shimmer-text">Nothing more.</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={f.title} className="gradient-border p-6 card-hover group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600/15 to-emerald-600/8 border border-emerald-600/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <f.icon size={18} className="text-emerald-700" />
                </div>
                <span className="text-[10px] font-bold text-[#08090A]/50 tracking-widest uppercase">0{i + 1}</span>
              </div>
              <div className="inline-block text-[10px] font-semibold text-emerald-600 bg-emerald-600/8 border border-emerald-600/25 px-2 py-0.5 rounded-full mb-3 tracking-wider uppercase">
                {f.tag}
              </div>
              <h3 className="font-semibold text-[#08090A] mb-2 text-[15px]">{f.title}</h3>
              <p className="text-sm text-[#08090A]/75 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="text-emerald-600 text-sm font-medium mb-3 uppercase tracking-wider">Why Paradrop</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Apollo + Mailshake + Hunter,<br /><span className="shimmer-text">for 1/10th the price.</span></h2>
        </div>
        {/* Desktop comparison table (hidden on mobile) */}
        <div className="hidden md:block gradient-border-animated p-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#08090A]/10">
                <th className="text-left py-4 font-medium text-[#08090A]/70 pl-4"></th>
                <th className="text-center py-4 font-bold text-[#08090A]">
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center">
                      <Zap size={10} className="text-white" fill="white" />
                    </div>
                    Paradrop
                  </div>
                </th>
                <th className="text-center py-4 text-[#08090A]/75">Apollo + Mailshake</th>
                <th className="text-center py-4 text-[#08090A]/75">Hunter + Lemlist</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Monthly cost", "$19", "$199+", "$149+"],
                ["AI personalization", "Built-in", "Extra $$", "Extra $$"],
                ["Lead search + outreach in one", "✓", "Need both tools", "Need both tools"],
                ["For freelancers + sales reps", "✓", "Enterprise only", "Enterprise only"],
                ["Setup time", "2 min", "30 min", "20 min"],
                ["Free tier", "20 leads/mo", "Trial only", "25 searches"],
                ["Verified emails", "✓", "✓", "✓"],
              ].map(([label, ld, apl, hn]) => (
                <tr key={label} className="border-b border-[#08090A]/8 last:border-0">
                  <td className="py-4 pl-4 text-[#08090A]/75">{label}</td>
                  <td className="text-center py-4 font-semibold gradient-text-violet">{ld}</td>
                  <td className="text-center py-4 text-[#08090A]/70">{apl}</td>
                  <td className="text-center py-4 text-[#08090A]/70">{hn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile comparison view (hidden on desktop, stacked card layout) */}
        <div className="block md:hidden space-y-4">
          {/* Paradrop Card */}
          <div className="gradient-border-animated p-6 border-[#0E8C66]/35 bg-[#0E8C66]/[0.01]">
            <div className="flex items-center justify-between border-b border-[#08090A]/10 pb-4 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center">
                  <Zap size={10} className="text-white" fill="white" />
                </div>
                <span className="font-bold text-sm text-[#08090A]">Paradrop</span>
              </div>
              <span className="text-lg font-bold text-[#0E8C66]">$19/mo</span>
            </div>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center justify-between text-[#08090A]/75">
                <span>AI personalization</span>
                <span className="font-semibold text-emerald-600">Built-in</span>
              </li>
              <li className="flex items-center justify-between text-[#08090A]/75">
                <span>Lead search + outreach in one</span>
                <span className="font-semibold text-emerald-600">Yes (All-in-one)</span>
              </li>
              <li className="flex items-center justify-between text-[#08090A]/75">
                <span>For freelancers & reps</span>
                <span className="font-semibold text-emerald-600">Yes (Tailored)</span>
              </li>
              <li className="flex items-center justify-between text-[#08090A]/75">
                <span>Setup time</span>
                <span className="font-semibold">2 min</span>
              </li>
              <li className="flex items-center justify-between text-[#08090A]/75">
                <span>Free tier</span>
                <span className="font-semibold">20 leads/mo</span>
              </li>
              <li className="flex items-center justify-between text-[#08090A]/75">
                <span>Verified emails</span>
                <span className="font-semibold text-emerald-600">Yes</span>
              </li>
            </ul>
          </div>

          {/* Competitors Group */}
          <div className="grid grid-cols-2 gap-3">
            {/* Apollo + Mailshake Card */}
            <div className="gradient-border p-4 bg-[#08090A]/[0.02]">
              <h3 className="font-bold text-xs text-[#08090A]/85 mb-1.5">Apollo + Mailshake</h3>
              <div className="text-sm font-bold text-[#08090A]/75 mb-3">$199+/mo</div>
              <ul className="space-y-2 text-[10px] text-[#08090A]/65">
                <li>• Extra $$ for AI</li>
                <li>• Needs two tools</li>
                <li>• Enterprise focus</li>
                <li>• 30 min setup</li>
                <li>• Trial only</li>
              </ul>
            </div>

            {/* Hunter + Lemlist Card */}
            <div className="gradient-border p-4 bg-[#08090A]/[0.02]">
              <h3 className="font-bold text-xs text-[#08090A]/85 mb-1.5">Hunter + Lemlist</h3>
              <div className="text-sm font-bold text-[#08090A]/75 mb-3">$149+/mo</div>
              <ul className="space-y-2 text-[10px] text-[#08090A]/65">
                <li>• Extra $$ for AI</li>
                <li>• Needs two tools</li>
                <li>• Enterprise focus</li>
                <li>• 20 min setup</li>
                <li>• 25 searches only</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="text-emerald-600 text-sm font-medium mb-3 uppercase tracking-wider">What you get</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Everything you need to land clients<br /><span className="shimmer-text">in one place.</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {useCases.map((u) => (
            <div key={u.title} className="gradient-border p-6 card-hover">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600/20 to-emerald-600/10 border border-emerald-600/30 flex items-center justify-center mb-4">
                <u.icon size={18} className="text-emerald-600" />
              </div>
              <h3 className="text-base font-semibold text-[#08090A] mb-2">{u.title}</h3>
              <p className="text-sm text-[#08090A]/70 leading-relaxed">{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="text-emerald-600 text-sm font-medium mb-3 uppercase tracking-wider">Pricing</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Start free. <span className="shimmer-text">Scale when ready.</span></h2>
          <p className="text-[#08090A]/70 mt-4">No credit card required. Cancel anytime.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pricing.map((p) => (
            <div
              key={p.name}
              className={`${p.highlight ? "gradient-border-animated glow-violet" : "gradient-border"} p-7 relative card-hover`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 btn-gradient text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
                  Most popular
                </div>
              )}
              <div className="mb-6">
                <div className="text-sm font-medium text-[#08090A]/65 mb-1">{p.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-bold text-[#08090A]">{p.price}</span>
                  <span className="text-[#08090A]/70 text-sm">/{p.period}</span>
                </div>
                <p className="text-sm text-[#08090A]/70">{p.desc}</p>
              </div>
              <div className="space-y-3 mb-8">
                {p.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-[#08090A]/75">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <Link
                href={p.href}
                className={`block text-center py-3 rounded-lg text-sm font-semibold transition-all ${p.highlight
                  ? "btn-gradient text-white"
                  : "border border-[#08090A]/12 bg-[#08090A]/3 text-[#08090A]/75 hover:text-[#08090A] hover:border-[#08090A]/18 hover:bg-[#EEEDE7]"
                  }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="text-emerald-600 text-sm font-medium mb-3 uppercase tracking-wider">FAQ</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Questions, <span className="shimmer-text">answered.</span></h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="gradient-border p-5 card-hover group cursor-pointer">
              <summary className="flex items-center justify-between text-[#08090A] font-medium text-sm list-none">
                {f.q}
                <span className="text-emerald-600 text-lg group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-sm text-[#08090A]/75 leading-relaxed mt-4 pt-4 border-t border-[#08090A]/8">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="gradient-border-animated glow-violet p-12 md:p-16 rounded-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEEDE7] border border-[#08090A]/12 text-xs text-[#08090A]/65 mb-6">
            <Clock size={11} /> Setup in 2 minutes
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Your next client<br />is <span className="shimmer-text">one email away.</span>
          </h2>
          <p className="text-[#08090A]/75 mb-8 text-lg">Start free. Find 20 verified leads. Send AI-written emails today.</p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 btn-gradient text-white px-10 py-4 rounded-xl font-semibold hover:-translate-y-0.5 transition-transform"
          >
            Get started — it&apos;s free
            <ArrowRight size={18} />
          </Link>
          <p className="text-[#08090A]/50 text-xs mt-4">No credit card · Cancel anytime · 20 free leads every month</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#08090A]/10 px-6 py-12 bg-[#08090A]/3">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Image src="/paradrop-logo.png" alt="Paradrop" width={28} height={28} className="rounded-lg object-cover" />
                <span className="font-bold text-sm">Paradrop</span>
              </div>
              <p className="text-xs text-[#08090A]/70 leading-relaxed max-w-xs">AI-powered lead generation and cold outreach built for freelancers, sales reps, and indie agencies.</p>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#08090A]/85 mb-3 uppercase tracking-wider">Product</div>
              <div className="space-y-2 text-xs text-[#08090A]/70">
                <a href="#features" className="block hover:text-[#08090A]">Features</a>
                <a href="#pricing" className="block hover:text-[#08090A]">Pricing</a>
                <a href="#how-it-works" className="block hover:text-[#08090A]">How it works</a>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#08090A]/85 mb-3 uppercase tracking-wider">Company</div>
              <div className="space-y-2 text-xs text-[#08090A]/70">
                <a href="#how" className="block hover:text-[#08090A]">What you get</a>
                <a href="#faq" className="block hover:text-[#08090A]">FAQ</a>
                <Link href="/blog" className="block hover:text-[#08090A]">Blog</Link>
                <a href="mailto:hello@paradrop.in" className="block hover:text-[#08090A]">Contact</a>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#08090A]/85 mb-3 uppercase tracking-wider">Legal</div>
              <div className="space-y-2 text-xs text-[#08090A]/70">
                <a href="#" className="block hover:text-[#08090A]">Privacy</a>
                <a href="#" className="block hover:text-[#08090A]">Terms</a>
                <a href="#" className="block hover:text-[#08090A]">Refunds</a>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[#08090A]/8">
            <p className="text-[#08090A]/50 text-xs">© 2026 Paradrop. Built to help freelancers win.</p>
            <p className="text-[#08090A]/50 text-xs">Made with <span className="text-emerald-600">♦</span> for indie hackers worldwide</p>
          </div>
        </div>
      </footer>

      <AssistantWidget plan="free" />
    </div>
  );
}
