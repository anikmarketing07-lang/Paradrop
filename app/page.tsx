import Link from "next/link";
import { ArrowRight, Zap, Target, Mail, TrendingUp, Shield, Users } from "lucide-react";

const stats = [
  { value: "50K+", label: "Leads generated" },
  { value: "38%", label: "Avg reply rate" },
  { value: "2,400+", label: "Freelancers using it" },
  { value: "$0", label: "To get started" },
];

const features = [
  {
    icon: Target,
    title: "Laser-targeted lead search",
    desc: "Filter by industry, company size, role, location, and tech stack. Find decision-makers who actually need your skills.",
    tag: "Find",
  },
  {
    icon: Zap,
    title: "AI writes every email",
    desc: "Claude reads each lead's profile and writes a unique, personalized cold email. Not a template — an actual human-sounding pitch.",
    tag: "Personalize",
  },
  {
    icon: Mail,
    title: "Bulk send via your Gmail",
    desc: "Send 50-200 emails in one click using your own Gmail account. Your domain, your reputation, your deliverability.",
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
    desc: "Every lead email is verified before you send. No bounces, no spam flags, no wasted quota.",
    tag: "Verified",
  },
  {
    icon: Users,
    title: "Built for freelancers",
    desc: "No enterprise bloat. No 6-month contracts. No team seats you don't need. One tool, one freelancer, real results.",
    tag: "Simple",
  },
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
    cta: "Start Pro — $19/mo",
    href: "/app",
    highlight: true,
  },
  {
    name: "Agency",
    price: "$49",
    period: "per month",
    desc: "For agencies & power users.",
    features: ["Unlimited leads", "Everything in Pro", "Multiple Gmail accounts", "Team access (3 seats)", "API access", "Dedicated support"],
    cta: "Start Agency",
    href: "/app",
    highlight: false,
  },
];

const testimonials = [
  {
    quote: "Got 3 client inquiries in my first week. I was manually DMing on LinkedIn before — this is a completely different speed.",
    name: "Arjun M.",
    role: "Freelance Web Developer",
    avatar: "AM",
  },
  {
    quote: "The AI emails don't sound like AI. One client told me my outreach was the most personal cold email he'd ever received.",
    name: "Sarah K.",
    role: "Brand Designer",
    avatar: "SK",
  },
  {
    quote: "I closed a $4,200 project from a lead I found on LeadDrop. Paid for 18 months of Pro in one deal.",
    name: "Marcus T.",
    role: "Freelance Copywriter",
    avatar: "MT",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-800/5 rounded-full blur-[80px]" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#08080f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <Zap size={14} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-lg tracking-tight">LeadDrop</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/app" className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block">
              Sign in
            </Link>
            <Link
              href="/app"
              className="text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-violet-600/25"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-600/10 border border-violet-600/20 text-violet-400 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          2,400+ freelancers already using LeadDrop
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
          Stop hunting for clients.<br />
          <span className="shimmer">Let AI do it.</span>
        </h1>

        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          Find verified leads, generate personalized cold emails with AI, and send in bulk — all from one dashboard. Free to start.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
          <Link
            href="/app"
            className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-7 py-3.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-xl hover:shadow-violet-600/30 hover:-translate-y-0.5"
          >
            Find my first 20 leads free
            <ArrowRight size={16} />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center gap-2 border border-white/10 text-white/60 hover:text-white hover:border-white/20 px-7 py-3.5 rounded-lg text-sm transition-all duration-200"
          >
            See how it works
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
          {stats.map((s) => (
            <div key={s.label} className="bg-[#08080f] px-6 py-6 text-center">
              <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-sm text-white/40">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* App preview mockup */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="gradient-border glow rounded-2xl overflow-hidden">
          <div className="bg-[#0d0d18] p-4">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="flex-1 bg-white/[0.04] rounded-md px-3 py-1 text-xs text-white/30 text-center">
                app.leaddrop.io
              </div>
            </div>
            {/* Fake dashboard */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="col-span-1 bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                <div className="text-xs text-white/40 mb-3">Search leads</div>
                <div className="space-y-2">
                  {["Shopify agencies", "SaaS startups", "Marketing agencies", "E-commerce brands"].map((t) => (
                    <div key={t} className="text-xs bg-violet-600/10 border border-violet-600/20 rounded-md px-2 py-1.5 text-violet-300">{t}</div>
                  ))}
                </div>
                <div className="mt-4 bg-violet-600 rounded-lg py-2 text-center text-xs font-medium text-white">
                  Find 20 leads →
                </div>
              </div>
              <div className="col-span-2 bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                <div className="text-xs text-white/40 mb-3">Leads found — 20 results</div>
                <div className="space-y-2">
                  {[
                    { name: "James Carter", role: "CEO, Pixel Studio", tag: "✓ Email verified" },
                    { name: "Priya Sharma", role: "Founder, GrowthLab", tag: "✓ Email verified" },
                    { name: "Tom Nguyen", role: "Head of Design, Layr", tag: "✓ Email verified" },
                    { name: "Lisa Park", role: "CTO, BuildFast", tag: "✓ Email verified" },
                  ].map((l) => (
                    <div key={l.name} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2">
                      <div>
                        <div className="text-xs font-medium text-white">{l.name}</div>
                        <div className="text-xs text-white/40">{l.role}</div>
                      </div>
                      <div className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{l.tag}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
              <div className="text-xs text-white/40 mb-2">AI-generated email for James Carter</div>
              <div className="text-xs text-white/70 leading-relaxed">
                <span className="text-white/30">Subject: </span>Quick idea for Pixel Studio&apos;s next project<br /><br />
                Hi James, noticed Pixel Studio recently expanded into mobile — congrats on the growth. I help design-focused agencies like yours build faster with React. Worked with 3 similar studios last quarter, cut their dev time by 40%. Worth a 15-min call?
              </div>
              <div className="mt-3 flex gap-2">
                <div className="bg-violet-600 rounded-md px-3 py-1.5 text-xs font-medium text-white">Send to all 20 →</div>
                <div className="bg-white/[0.06] rounded-md px-3 py-1.5 text-xs text-white/50">Edit email</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="text-violet-400 text-sm font-medium mb-3">How it works</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">From zero to 50 warm leads<br />in under 10 minutes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={f.title} className="gradient-border p-6 hover:bg-white/[0.06] transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-600/20 flex items-center justify-center group-hover:bg-violet-600/20 transition-colors">
                  <f.icon size={18} className="text-violet-400" />
                </div>
                <span className="text-[10px] font-bold text-white/20 tracking-widest uppercase">0{i + 1}</span>
              </div>
              <div className="inline-block text-[10px] font-semibold text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded-full mb-3 tracking-wider uppercase">
                {f.tag}
              </div>
              <h3 className="font-semibold text-white mb-2 text-[15px]">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="text-violet-400 text-sm font-medium mb-3">Real results</div>
          <h2 className="text-4xl font-bold tracking-tight">Freelancers closing deals every week</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.name} className="gradient-border p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-violet-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-600/30 flex items-center justify-center text-xs font-bold text-violet-300">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t.name}</div>
                  <div className="text-xs text-white/40">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="text-violet-400 text-sm font-medium mb-3">Pricing</div>
          <h2 className="text-4xl font-bold tracking-tight">Start free. Scale when ready.</h2>
          <p className="text-white/40 mt-3">No credit card required. Cancel anytime.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pricing.map((p) => (
            <div
              key={p.name}
              className={`gradient-border p-6 relative ${p.highlight ? "ring-1 ring-violet-600/50" : ""}`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
                  Most popular
                </div>
              )}
              <div className="mb-6">
                <div className="text-sm font-medium text-white/60 mb-1">{p.name}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold text-white">{p.price}</span>
                  <span className="text-white/40 text-sm">/{p.period}</span>
                </div>
                <p className="text-sm text-white/40">{p.desc}</p>
              </div>
              <div className="space-y-3 mb-8">
                {p.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="text-violet-400 text-xs">✓</span>
                    {f}
                  </div>
                ))}
              </div>
              <Link
                href={p.href}
                className={`block text-center py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  p.highlight
                    ? "bg-violet-600 hover:bg-violet-500 text-white hover:shadow-lg hover:shadow-violet-600/30"
                    : "border border-white/10 text-white/70 hover:text-white hover:border-white/20"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="gradient-border glow p-12 md:p-16 rounded-3xl">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Your next client<br />is one email away.
          </h2>
          <p className="text-white/50 mb-8 text-lg">Start free. Find 20 verified leads. Send AI-written emails today.</p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:shadow-xl hover:shadow-violet-600/30 hover:-translate-y-0.5"
          >
            Get started — it&apos;s free
            <ArrowRight size={18} />
          </Link>
          <p className="text-white/20 text-xs mt-4">No credit card. No commitment. Cancel anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
              <Zap size={12} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-sm">LeadDrop</span>
          </div>
          <p className="text-white/20 text-xs">© 2026 LeadDrop. Built to help freelancers win.</p>
          <div className="flex gap-6 text-xs text-white/30">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/60 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
