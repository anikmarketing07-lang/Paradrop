// Single source of truth for all prices, in every supported currency. Used by
// the pricing page AND the payment routes — so the amount a user sees always
// matches what the server charges. Charm-ended per market (PPP, not FX).

export type PlanId = "pro" | "agency" | "lifetime";
export type IntervalId = "monthly" | "quarterly" | "yearly" | "lifetime";
export type Currency = "INR" | "USD";

// PPP pricing — India/SE Asia pays INR, rest of world pays USD (higher, not a
// straight FX conversion — international willingness-to-pay is higher).
export const PRICES: Record<Currency, Record<PlanId, Partial<Record<IntervalId, number>>>> = {
  INR: {
    pro: { monthly: 1499, quarterly: 3999, yearly: 14999 },
    agency: { monthly: 3999, quarterly: 10999, yearly: 39999 },
    lifetime: { lifetime: 5999 },
  },
  USD: {
    pro: { monthly: 29, quarterly: 79, yearly: 279 },
    agency: { monthly: 59, quarterly: 159, yearly: 559 },
    lifetime: { lifetime: 99 },
  },
};

// Strike-through anchor next to the lifetime deal (≈ a year at the monthly rate).
export const ANCHOR: Record<Currency, number> = { INR: 15999, USD: 299 };

export const CURRENCY_SYMBOL: Record<Currency, string> = { INR: "₹", USD: "$" };

// Countries that pay in INR. Everything else pays USD.
const INR_COUNTRIES = new Set([
  "IN", "BD", "PK", "LK", "NP", "BT", "MM", "ID", "PH", "VN", "TH", "KH", "LA", "MV",
]);

// Resolve currency from an ISO country code (e.g. Vercel's x-vercel-ip-country).
// Unknown → INR, because this is an India-first product and Razorpay INR is the
// primary, always-available rail. International visitors get a real geo header.
export function currencyForCountry(country?: string | null): Currency {
  if (!country) return "INR";
  return INR_COUNTRIES.has(country.toUpperCase()) ? "INR" : "USD";
}

export function priceFor(plan: string, interval: string, currency: Currency = "INR"): number | null {
  const table = PRICES[currency]?.[plan as PlanId];
  if (!table) return null;
  const amount = table[interval as IntervalId];
  return typeof amount === "number" ? amount : null;
}

export function isCurrency(v: unknown): v is Currency {
  return v === "INR" || v === "USD";
}

// ── Back-compat aliases (INR is the default market) ──
export const LIFETIME_INR = PRICES.INR.lifetime.lifetime!;
export const LIFETIME_ANCHOR_INR = ANCHOR.INR;
