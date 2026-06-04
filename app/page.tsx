import Link from "next/link";
import { ArrowRight, Zap, Target, Mail, TrendingUp, Shield, Users, Sparkles, CheckCircle2, Clock, Globe, BarChart3, Repeat, Search, Send } from "lucide-react";

const stats = [
  { value: "50K+", label: "Leads generated" },
  { value: "38%", label: "Avg reply rate" },
  { value: "2,400+", label: "Freelancers" },
  { value: "$2.4M", label: "Closed deals" },
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

const testimonials = [
  {
    quote: "Got 3 client inquiries in my first week. I was manually DMing on LinkedIn before — this is a completely different speed.",
    name: "Arjun M.",
    role: "Freelance Web Developer",
    location: "Bangalore, India",
    avatar: "AM",
    closed: "$3,200",
  },
  {
    quote: "The AI emails don't sound like AI. One client told me my outreach was the most personal cold email he'd ever received.",
    name: "Sarah K.",
    role: "Brand Designer",
    location: "London, UK",
    avatar: "SK",
    closed: "$5,800",
  },
  {
    quote: "I closed a $4,200 project from a lead I found on LeadDrop. Paid for 18 months of Pro in one deal.",
    name: "Marcus T.",
    role: "Freelance Copywriter",
    location: "Toronto, Canada",
    avatar: "MT",
    closed: "$4,200",
  },
  {
    quote: "Switched from Apollo + Mailshake. LeadDrop does both in one tool, way cheaper, better UX.",
    name: "Priya S.",
    role: "Marketing Consultant",
    location: "Mumbai, India",
    avatar: "PS",
    closed: "$2,100",
  },
  {
    quote: "Finally a tool that doesn't pretend cold outreach is dead. It works if you do it right — this makes doing it right easy.",
    name: "Tom W.",
    role: "Video Editor",
    location: "Sydney, AU",
    avatar: "TW",
    closed: "$1,800",
  },
  {
    quote: "From 0 to 6 paying clients in 2 months. The personalization is what separates this from every other outreach tool.",
    name: "Lisa R.",
    role: "UX Designer",
    location: "Austin, USA",
    avatar: "LR",
    closed: "$7,400",
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

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Aurora Background */}
      <div className="fixed inset-0 -z-10 bg-[#080f1c]">
        <div className="grid-bg" />
        <div className="aurora-bg">
          <div className="aurora-blob aurora-blob-1" />
          <div className="aurora-blob aurora-blob-2" />
          <div className="aurora-blob aurora-blob-3" />
        </div>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080f1c]/70 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 via-cyan-500 to-indigo-500 flex items-center justify-center glow-soft">
              <Zap size={15} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-lg tracking-tight">LeadDrop</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Customers</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/app" className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block">
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
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-600/10 border border-sky-600/30 text-sky-300 text-xs font-medium mb-8 fade-up">
          <Sparkles size={12} className="text-cyan-400" />
          <span className="shimmer-text font-semibold">New:</span>
          AI-personalized outreach for freelancers Â· 2,400+ freelancers & sales reps
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-8 fade-up-delay-1">
          Stop hunting for clients.<br />
          <span className="shimmer-text">Let AI do it.</span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed fade-up-delay-2">
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
            className="inline-flex items-center justify-center gap-2 border border-white/15 bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/[0.06] hover:border-white/25 px-8 py-4 rounded-xl text-sm transition-all"
          >
            See how it works
          </a>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-white/40 mb-16">
          <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-400" /> No credit card</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-400" /> Cancel anytime</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-400" /> 2 min setup</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06] backdrop-blur-xl">
          {stats.map((s) => (
            <div key={s.label} className="bg-[#080f1c]/80 px-6 py-7 text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text-violet mb-1">{s.value}</div>
              <div className="text-sm text-white/40">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Mockup */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="gradient-border-animated glow-violet rounded-2xl overflow-hidden">
          <div className="bg-[#0a0a14]/90 backdrop-blur-xl p-4">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 bg-white/[0.04] rounded-md px-3 py-1 text-xs text-white/40 text-center">
                app.leaddrop.io
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="col-span-1 bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                <div className="text-xs text-white/40 mb-3">Search leads</div>
                <div className="space-y-2">
                  {["Shopify agencies", "SaaS startups", "Marketing agencies", "E-commerce"].map((t) => (
                    <div key={t} className="text-xs bg-gradient-to-r from-sky-600/15 to-cyan-600/10 border border-sky-600/20 rounded-md px-2 py-1.5 text-sky-200">{t}</div>
                  ))}
                </div>
                <div className="mt-4 btn-gradient rounded-lg py-2 text-center text-xs font-medium text-white">
                  Find 20 leads â†’
                </div>
              </div>
              <div className="col-span-2 bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                <div className="text-xs text-white/40 mb-3 flex items-center justify-between">
                  <span>Leads found — 20 results</span>
                  <span className="text-emerald-400">100% verified</span>
                </div>
                <div className="space-y-2">
                  {[
                    { name: "James Carter", role: "CEO, Pixel Studio" },
                    { name: "Priya Sharma", role: "Founder, GrowthLab" },
                    { name: "Tom Nguyen", role: "Head of Design, Layr" },
                    { name: "Lisa Park", role: "CTO, BuildFast" },
                  ].map((l) => (
                    <div key={l.name} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2">
                      <div>
                        <div className="text-xs font-medium text-white">{l.name}</div>
                        <div className="text-xs text-white/40">{l.role}</div>
                      </div>
                      <div className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">âœ“ Verified</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
              <div className="text-xs text-white/40 mb-2 flex items-center gap-2">
                <Sparkles size={11} className="text-cyan-400" />
                AI-generated email for James Carter
              </div>
              <div className="text-xs text-white/70 leading-relaxed">
                <span className="text-white/30">Subject: </span>Quick idea for Pixel Studio&apos;s next project<br /><br />
                Hi James, noticed Pixel Studio recently expanded into mobile — congrats on the growth. I help design-focused agencies like yours build faster with React. Worked with 3 similar studios last quarter, cut their dev time by 40%. Worth a 15-min call?
              </div>
              <div className="mt-3 flex gap-2">
                <div className="btn-gradient rounded-md px-3 py-1.5 text-xs font-medium text-white">Send to all 20 â†’</div>
                <div className="bg-white/[0.06] rounded-md px-3 py-1.5 text-xs text-white/50">Edit email</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-white/[0.06] bg-white/[0.02] py-10 mb-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs text-white/30 uppercase tracking-wider mb-6">Trusted by freelancers selling to teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {trustLogos.map((l) => (
              <div key={l} className="text-xl font-bold text-white/30 hover:text-white/60 transition-colors">{l}</div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="text-sky-400 text-sm font-medium mb-3 uppercase tracking-wider">How it works</div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">From zero to <span className="shimmer-text">50 warm leads</span><br />in under 10 minutes.</h2>
          <p className="text-white/50 max-w-xl mx-auto">No sales experience needed. No copywriting skills needed. Just you, your skill, and AI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {howItWorks.map((step, i) => (
            <div key={step.step} className="gradient-border p-6 card-hover relative">
              <div className="text-6xl font-bold text-white/[0.04] absolute top-2 right-3">{step.step}</div>
              <div className="relative">
                <div className="text-xs font-semibold text-sky-400 mb-3 tracking-wider uppercase">Step {i + 1}</div>
                <h3 className="font-semibold text-white mb-2 text-lg">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="text-cyan-400 text-sm font-medium mb-3 uppercase tracking-wider">Features</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Everything to land your<br />next client. <span className="shimmer-text">Nothing more.</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={f.title} className="gradient-border p-6 card-hover group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-600/30 to-cyan-600/20 border border-sky-600/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <f.icon size={18} className="text-sky-300" />
                </div>
                <span className="text-[10px] font-bold text-white/20 tracking-widest uppercase">0{i + 1}</span>
              </div>
              <div className="inline-block text-[10px] font-semibold text-cyan-300 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full mb-3 tracking-wider uppercase">
                {f.tag}
              </div>
              <h3 className="font-semibold text-white mb-2 text-[15px]">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="text-cyan-400 text-sm font-medium mb-3 uppercase tracking-wider">Why LeadDrop</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Apollo + Mailshake + Hunter,<br /><span className="shimmer-text">for 1/10th the price.</span></h2>
        </div>
        <div className="gradient-border-animated p-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-4 font-medium text-white/40 pl-4"></th>
                <th className="text-center py-4 font-bold text-white">
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center">
                      <Zap size={10} className="text-white" fill="white" />
                    </div>
                    LeadDrop
                  </div>
                </th>
                <th className="text-center py-4 text-white/50">Apollo + Mailshake</th>
                <th className="text-center py-4 text-white/50">Hunter + Lemlist</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Monthly cost", "$19", "$199+", "$149+"],
                ["AI personalization", "Built-in", "Extra $$", "Extra $$"],
                ["Lead search + outreach in one", "âœ“", "Need both tools", "Need both tools"],
                ["For freelancers + sales reps", "âœ“", "Enterprise only", "Enterprise only"],
                ["Setup time", "2 min", "30 min", "20 min"],
                ["Free tier", "20 leads/mo", "Trial only", "25 searches"],
                ["Verified emails", "âœ“", "âœ“", "âœ“"],
              ].map(([label, ld, apl, hn]) => (
                <tr key={label} className="border-b border-white/[0.04] last:border-0">
                  <td className="py-4 pl-4 text-white/70">{label}</td>
                  <td className="text-center py-4 font-semibold gradient-text-violet">{ld}</td>
                  <td className="text-center py-4 text-white/40">{apl}</td>
                  <td className="text-center py-4 text-white/40">{hn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="text-indigo-400 text-sm font-medium mb-3 uppercase tracking-wider">Customers</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Freelancers closing deals<br /><span className="shimmer-text">every single week.</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.name} className="gradient-border p-6 card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">â˜…</span>
                  ))}
                </div>
                <span className="text-xs font-bold gradient-text-violet">{t.closed} closed</span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.05]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500/40 to-cyan-500/40 border border-sky-500/30 flex items-center justify-center text-xs font-bold text-white">
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{t.name}</div>
                  <div className="text-xs text-white/40 truncate">{t.role} Â· {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="text-sky-400 text-sm font-medium mb-3 uppercase tracking-wider">Pricing</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Start free. <span className="shimmer-text">Scale when ready.</span></h2>
          <p className="text-white/40 mt-4">No credit card required. Cancel anytime.</p>
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
                <div className="text-sm font-medium text-white/60 mb-1">{p.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-bold text-white">{p.price}</span>
                  <span className="text-white/40 text-sm">/{p.period}</span>
                </div>
                <p className="text-sm text-white/40">{p.desc}</p>
              </div>
              <div className="space-y-3 mb-8">
                {p.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-white/70">
                    <CheckCircle2 size={14} className="text-sky-400 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <Link
                href={p.href}
                className={`block text-center py-3 rounded-lg text-sm font-semibold transition-all ${
                  p.highlight
                    ? "btn-gradient text-white"
                    : "border border-white/10 bg-white/[0.02] text-white/70 hover:text-white hover:border-white/20 hover:bg-white/[0.05]"
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
          <div className="text-cyan-400 text-sm font-medium mb-3 uppercase tracking-wider">FAQ</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Questions, <span className="shimmer-text">answered.</span></h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="gradient-border p-5 card-hover group cursor-pointer">
              <summary className="flex items-center justify-between text-white font-medium text-sm list-none">
                {f.q}
                <span className="text-sky-400 text-lg group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-sm text-white/50 leading-relaxed mt-4 pt-4 border-t border-white/[0.05]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="gradient-border-animated glow-violet p-12 md:p-16 rounded-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 mb-6">
            <Clock size={11} /> Setup in 2 minutes
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Your next client<br />is <span className="shimmer-text">one email away.</span>
          </h2>
          <p className="text-white/50 mb-8 text-lg">Start free. Find 20 verified leads. Send AI-written emails today.</p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 btn-gradient text-white px-10 py-4 rounded-xl font-semibold hover:-translate-y-0.5 transition-transform"
          >
            Get started — it&apos;s free
            <ArrowRight size={18} />
          </Link>
          <p className="text-white/20 text-xs mt-4">No credit card Â· Cancel anytime Â· 2,400+ freelancers using it</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-12 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 via-cyan-500 to-indigo-500 flex items-center justify-center">
                  <Zap size={13} className="text-white" fill="white" />
                </div>
                <span className="font-bold text-sm">LeadDrop</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed max-w-xs">AI-powered lead generation and cold outreach built for freelancers, sales reps, and indie agencies.</p>
            </div>
            <div>
              <div className="text-xs font-semibold text-white/80 mb-3 uppercase tracking-wider">Product</div>
              <div className="space-y-2 text-xs text-white/40">
                <a href="#features" className="block hover:text-white">Features</a>
                <a href="#pricing" className="block hover:text-white">Pricing</a>
                <a href="#how-it-works" className="block hover:text-white">How it works</a>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-white/80 mb-3 uppercase tracking-wider">Company</div>
              <div className="space-y-2 text-xs text-white/40">
                <a href="#testimonials" className="block hover:text-white">Customers</a>
                <a href="#faq" className="block hover:text-white">FAQ</a>
                <a href="mailto:hello@leaddrop.io" className="block hover:text-white">Contact</a>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-white/80 mb-3 uppercase tracking-wider">Legal</div>
              <div className="space-y-2 text-xs text-white/40">
                <a href="#" className="block hover:text-white">Privacy</a>
                <a href="#" className="block hover:text-white">Terms</a>
                <a href="#" className="block hover:text-white">Refunds</a>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.05]">
            <p className="text-white/20 text-xs">Â© 2026 LeadDrop. Built to help freelancers win.</p>
            <p className="text-white/20 text-xs">Made with <span className="text-sky-400">â™¦</span> for indie hackers worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
