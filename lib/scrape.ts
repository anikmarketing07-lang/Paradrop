// Scrape a business website to recover email + Instagram + Facebook handles.
// Google Places does not expose these, so we fetch the homepage (and /contact)
// and pull them out of HTML with regex.

import { promises as dns } from "dns";

export type ScrapedContacts = {
  email: string;
  instagram: string;
  facebook: string;
};

const EMPTY: ScrapedContacts = { email: "", instagram: "", facebook: "" };

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const IG_RE = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([A-Za-z0-9_.]+)/i;
const FB_RE = /(?:https?:\/\/)?(?:www\.|m\.)?facebook\.com\/([A-Za-z0-9.\-]+)/i;

// Domains that are never a real business inbox (analytics, CMS, placeholders).
const DOMAIN_BLOCKLIST = [
  "sentry.io", "sentry-next.wixpress.com", "wixpress.com", "example.com",
  "domain.com", "yourdomain.com", "email.com", "test.com",
  "w3.org", "schema.org", "googleapis.com", "gstatic.com", "cloudflare.com",
  "wordpress.org", "godaddy.com", "cloudflare.net",
];

// Local-parts (before the @) that exist but are useless for outreach.
const JUNK_LOCAL = new Set([
  "noreply", "no-reply", "donotreply", "do-not-reply", "mailer-daemon",
  "postmaster", "abuse", "root", "webmaster",
]);

// Real inboxes people actually read — surface these first.
const PREFERRED_LOCAL = [
  "info", "contact", "hello", "hi", "hey", "sales", "team", "support",
  "office", "enquiry", "enquiries", "inquiry", "booking", "bookings",
];

// File extensions that look like a TLD but are just asset names.
const ASSET_TLDS = new Set([
  "png", "jpg", "jpeg", "svg", "webp", "gif", "css", "js", "json",
  "xml", "ico", "woff", "woff2", "ttf", "eot", "mp4", "pdf",
]);

// IG/FB paths that are not real handles
const SOCIAL_BLOCKLIST = new Set([
  "sharer",
  "share",
  "dialog",
  "plugins",
  "tr",
  "events",
  "explore",
  "p",
  "reel",
  "reels",
  "stories",
  "accounts",
  "login",
  "signup",
  "help",
  "about",
  "privacy",
  "terms",
  "policy",
  "policies",
  "developers",
  "business",
  "tags",
  "directory",
  "pages",
]);

// Strict RFC-ish format check. Kills the junk regex alone lets through:
// double dots, leading/trailing dots, asset filenames (logo@2x.png), etc.
function isValidFormat(email: string): boolean {
  const m = /^([a-z0-9._%+-]+)@([a-z0-9.-]+\.[a-z]{2,})$/i.exec(email);
  if (!m) return false;
  const local = m[1];
  const domain = m[2].toLowerCase();
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
  if (domain.startsWith(".") || domain.endsWith(".") || domain.includes("..")) return false;
  const tld = domain.split(".").pop()!;
  if (ASSET_TLDS.has(tld)) return false;
  return true;
}

// Collect every valid-format, non-junk email, deduped, best inboxes first.
function collectEmails(html: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of html.match(EMAIL_RE) || []) {
    const e = raw.toLowerCase();
    if (seen.has(e)) continue;
    if (e.startsWith("u003")) continue; // mangled unicode escape
    if (!isValidFormat(e)) continue;
    const [local, domain] = e.split("@");
    if (DOMAIN_BLOCKLIST.some((d) => domain === d || domain.endsWith("." + d))) continue;
    if (JUNK_LOCAL.has(local)) continue;
    seen.add(e);
    out.push(e);
  }
  // Preferred role inboxes to the front, order otherwise preserved.
  out.sort((a, b) => {
    const pa = PREFERRED_LOCAL.includes(a.split("@")[0]) ? 0 : 1;
    const pb = PREFERRED_LOCAL.includes(b.split("@")[0]) ? 0 : 1;
    return pa - pb;
  });
  return out;
}

// Does the domain actually accept mail? A fake/parked domain has no MX record.
// Fail-OPEN: a DNS timeout or transient error must never drop a real lead —
// only a definitive "domain has no mail server" (ENOTFOUND/ENODATA) rejects.
async function hasMx(domain: string, cache: Map<string, boolean>, timeoutMs = 1200): Promise<boolean> {
  const cached = cache.get(domain);
  if (cached !== undefined) return cached;
  let ok = true;
  try {
    const records = await Promise.race([
      dns.resolveMx(domain),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), timeoutMs)),
    ]);
    ok = Array.isArray(records) && records.length > 0;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    ok = !(code === "ENOTFOUND" || code === "ENODATA"); // definite miss → false
  }
  cache.set(domain, ok);
  return ok;
}

// Return the best deliverable email: first candidate whose domain has MX.
// Checks at most 3 candidates to bound DNS latency inside the enrichment race.
async function pickEmail(html: string): Promise<string> {
  const candidates = collectEmails(html).slice(0, 3);
  const mxCache = new Map<string, boolean>();
  for (const e of candidates) {
    if (await hasMx(e.split("@")[1], mxCache)) return e;
  }
  return "";
}

function pickHandle(html: string, re: RegExp): string {
  const m = html.match(re);
  if (!m) return "";
  const handle = m[1].replace(/\/$/, "").trim();
  if (!handle) return "";
  if (SOCIAL_BLOCKLIST.has(handle.toLowerCase())) return "";
  if (handle.length > 40) return "";
  return handle;
}

async function fetchHtml(url: string, timeoutMs: number): Promise<string> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        // Some sites block unknown UAs; pretend to be a regular browser.
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) return "";
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("text/html") && !ct.includes("application/xhtml")) return "";
    const text = await res.text();
    // Cap size to avoid pulling multi-MB pages into memory.
    return text.slice(0, 500_000);
  } catch {
    return "";
  } finally {
    clearTimeout(t);
  }
}

export async function scrapeContacts(websiteDomain: string): Promise<ScrapedContacts> {
  if (!websiteDomain) return EMPTY;

  const base = websiteDomain.startsWith("http") ? websiteDomain : `https://${websiteDomain}`;
  const candidates = [base, `${base.replace(/\/$/, "")}/contact`];

  let combined = "";
  for (const url of candidates) {
    const html = await fetchHtml(url, 2500);
    if (html) combined += "\n" + html;
    // If the homepage already yields an email + both socials, skip /contact.
    // Uses the cheap format-level check (no DNS) — MX is verified once at the end.
    if (combined && collectEmails(combined).length && pickHandle(combined, IG_RE) && pickHandle(combined, FB_RE)) break;
  }

  if (!combined) return EMPTY;

  return {
    email: await pickEmail(combined),
    instagram: pickHandle(combined, IG_RE),
    facebook: pickHandle(combined, FB_RE),
  };
}
