// Scrape a business website to recover email + Instagram + Facebook handles.
// Google Places does not expose these, so we fetch the homepage (and /contact)
// and pull them out of HTML with regex.

export type ScrapedContacts = {
  email: string;
  instagram: string;
  facebook: string;
};

const EMPTY: ScrapedContacts = { email: "", instagram: "", facebook: "" };

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const IG_RE = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([A-Za-z0-9_.]+)/i;
const FB_RE = /(?:https?:\/\/)?(?:www\.|m\.)?facebook\.com\/([A-Za-z0-9.\-]+)/i;

// Filenames / paths we never want to treat as emails (sentry@..., wix support, etc.)
const EMAIL_BLOCKLIST = [
  "sentry.io",
  "wixpress.com",
  "example.com",
  "domain.com",
  "yourdomain",
  "email.com",
  "sentry-next",
];

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

function pickEmail(html: string): string {
  const matches = html.match(EMAIL_RE) || [];
  for (const raw of matches) {
    const e = raw.toLowerCase();
    if (EMAIL_BLOCKLIST.some((b) => e.includes(b))) continue;
    if (e.endsWith(".png") || e.endsWith(".jpg") || e.endsWith(".jpeg") || e.endsWith(".svg") || e.endsWith(".webp")) continue;
    if (e.startsWith("u003")) continue; // mangled unicode escapes
    return e;
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
    const html = await fetchHtml(url, 4000);
    if (html) combined += "\n" + html;
    // If we already have everything from the homepage, skip /contact.
    if (combined && pickEmail(combined) && pickHandle(combined, IG_RE) && pickHandle(combined, FB_RE)) break;
  }

  if (!combined) return EMPTY;

  return {
    email: pickEmail(combined),
    instagram: pickHandle(combined, IG_RE),
    facebook: pickHandle(combined, FB_RE),
  };
}
