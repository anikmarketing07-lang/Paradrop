// Static blog content for SEO. Each post targets a keyword cluster.
// No CMS — content lives here, rendered server-side for full indexability.

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  date: string; // ISO
  readMins: number;
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "find-local-clients-freelancer-india",
    title: "How to find local clients as a freelancer in India (2026 guide)",
    description:
      "A practical, step-by-step guide to finding local business clients as a freelancer in India — using Google Maps data, cold WhatsApp and email outreach that actually gets replies.",
    keywords: [
      "find local clients", "freelance client finder", "get clients for freelancers",
      "lead generation India", "find clients in India", "local business leads",
    ],
    date: "2026-06-27",
    readMins: 6,
    body: [
      { type: "p", text: "Most freelancers in India wait for clients to come to them — through referrals, marketplaces, or the occasional Instagram DM. That works, slowly. The faster path is outbound: you pick who you want to work with, reach out, and start conversations. Here's how to do it without a sales team or a big budget." },
      { type: "h2", text: "1. Pick a niche you can actually serve" },
      { type: "p", text: "Generalists struggle in cold outreach because their message fits no one. Pick one type of business — dental clinics, gyms, restaurants, real estate agents — and one service you offer them. \"I build fast websites for dental clinics\" beats \"I do web development\" every time. A specific message gets specific replies." },
      { type: "h2", text: "2. Build a list of local businesses" },
      { type: "p", text: "Google Maps is the largest, freshest database of local businesses in India. Every clinic, salon, and cafe is listed with a phone number, often a website, and reviews. You can pull this data by hand (slow) or use a tool that does it in seconds. For each business you want: name, phone, website, and ideally their email and social handles." },
      { type: "h2", text: "3. Find a real reason to reach out" },
      { type: "p", text: "Generic pitches get ignored. Before you message a business, look at what they're missing: no website, a slow website, a weak Instagram, no online booking. That gap is your opening line. \"Noticed your clinic doesn't show up on Google Maps for 'dentist near me' — I can fix that\" lands far better than \"I offer marketing services.\"" },
      { type: "h2", text: "4. Reach out where they actually reply" },
      { type: "p", text: "In India, WhatsApp gets read. Email works for larger businesses. A short, specific WhatsApp message — one line of context, one clear offer, one soft ask — beats a long formal email for most local SMBs. Keep it under 40 words. You're starting a conversation, not closing a deal." },
      { type: "ul", items: [
        "Open with something specific to them (their business, their gap).",
        "State one clear value in plain language.",
        "End with a low-pressure ask: \"Worth a quick chat?\"",
        "Follow up once after 3 days if no reply. Then move on.",
      ] },
      { type: "h2", text: "5. Do it at volume, consistently" },
      { type: "p", text: "Outreach is a numbers game. 5 messages a day is 150 a month. At even a 2% conversion, that's 3 new clients a month from zero ad spend. The hard part isn't skill — it's doing it every day. Tools that pull leads and draft your message remove the friction so you actually keep going." },
      { type: "p", text: "Paradrop does steps 2–4 for you: it pulls 20 local businesses with phone, email and socials, then writes a personalized cold email and WhatsApp DM for each — so you can focus on step 5, sending." },
    ],
  },
  {
    slug: "apollo-alternative-india",
    title: "The best affordable Apollo alternative for Indian freelancers",
    description:
      "Apollo, ZoomInfo and Hunter are built for US enterprise sales teams — and priced like it. Here's a cheaper, India-friendly alternative for freelancers and small agencies.",
    keywords: [
      "Apollo alternative", "Hunter.io alternative", "Instantly alternative",
      "cheap lead generation tool", "affordable cold email software", "lead generation India",
    ],
    date: "2026-06-27",
    readMins: 5,
    body: [
      { type: "p", text: "Apollo, ZoomInfo, Hunter, Instantly — these are powerful tools. They're also built for US-based enterprise sales teams, priced in dollars, and weak on Indian local business data. If you're a freelancer or a small agency in India, you're paying enterprise prices for data that often doesn't cover the clients you actually want." },
      { type: "h2", text: "Why the big tools don't fit Indian freelancers" },
      { type: "ul", items: [
        "Pricing: $49–$1,500/month. In rupees, that's a serious monthly cost before you've earned a single client.",
        "Data gaps: strong on US/EU B2B contacts, thin on Indian local SMBs (clinics, salons, gyms, cafes).",
        "No WhatsApp: they're email-first. In India, WhatsApp is where SMBs actually reply.",
        "No UPI: paying is friction — international cards, currency conversion, GST headaches.",
      ] },
      { type: "h2", text: "What an India-first alternative looks like" },
      { type: "p", text: "The right tool for an Indian freelancer pulls local business data (from Google Maps, which has the best SMB coverage in India), surfaces phone + email + Instagram + Facebook, and helps you reach out on the channel that works here — WhatsApp first, email second. And it should cost rupees, not dollars, with UPI checkout." },
      { type: "h2", text: "Paradrop vs the enterprise tools" },
      { type: "ul", items: [
        "Local SMB data from Google Maps — clinics, gyms, salons, restaurants and more.",
        "Phone, email, Instagram and Facebook for each lead, not just a B2B email.",
        "AI writes a cold email and a WhatsApp DM for every lead automatically.",
        "Priced in INR with UPI, card, wallet and netbanking. Lifetime deal at ₹6,000.",
      ] },
      { type: "p", text: "If you sell to local Indian businesses and you're tired of paying enterprise SaaS prices, an India-first tool like Paradrop covers the same outbound workflow — find, personalize, send — for a fraction of the cost." },
    ],
  },
  {
    slug: "cold-whatsapp-outreach-templates",
    title: "Cold WhatsApp outreach: 5 templates that get replies",
    description:
      "WhatsApp is where Indian businesses reply. Here are 5 short cold WhatsApp templates for freelancers and agencies — plus the rules that keep you out of spam.",
    keywords: [
      "WhatsApp outreach tool", "cold WhatsApp message", "cold outreach software",
      "AI cold email writer", "client acquisition tool", "get clients online",
    ],
    date: "2026-06-27",
    readMins: 5,
    body: [
      { type: "p", text: "Email open rates hover around 20%. A relevant WhatsApp message to a local business in India gets read almost every time. The catch: WhatsApp is personal, so a lazy copy-paste pitch gets you blocked. Here's how to do cold WhatsApp right, with templates you can adapt." },
      { type: "h2", text: "The 3 rules of cold WhatsApp" },
      { type: "ul", items: [
        "Be specific to them in the first line — prove you looked at their business.",
        "Keep it under 40 words. One hook, one ask.",
        "Never send the same message to 50 people verbatim. Personalize the opener.",
      ] },
      { type: "h2", text: "Template 1 — the gap opener" },
      { type: "p", text: "\"Hi [name], saw [business] on Google Maps — great reviews, but no website yet. I build simple 1-page sites for clinics like yours that turn searches into bookings. Worth a quick look?\"" },
      { type: "h2", text: "Template 2 — the competitor angle" },
      { type: "p", text: "\"Hi [name], a couple of gyms near you are running Instagram ads and pulling in members. I help local gyms set those up. Want me to show you what they're doing?\"" },
      { type: "h2", text: "Template 3 — the quick win" },
      { type: "p", text: "\"Hi [name], your [business] site loads a bit slow on mobile (6s+). That quietly loses customers. I can make it load in under 2s. Want a free speed report?\"" },
      { type: "h2", text: "Template 4 — the referral-style intro" },
      { type: "p", text: "\"Hi [name], I work with a few salons in [city] on their bookings and socials. Saw [business] and thought I could help the same way. Open to a 10-min chat this week?\"" },
      { type: "h2", text: "Template 5 — the soft follow-up" },
      { type: "p", text: "\"Hi [name], following up on my last note — no worries if now's not the time. If client bookings ever become a focus, I'm one message away. 🙏\"" },
      { type: "h2", text: "Scale it without sounding like a robot" },
      { type: "p", text: "The work is personalizing each opener at volume. That's exactly what Paradrop automates: it pulls the lead's details and drafts a tailored WhatsApp DM (and email) per business, so every message feels written for them — because it was." },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
