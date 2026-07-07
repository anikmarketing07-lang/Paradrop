import { NextRequest, NextResponse } from "next/server";
import { currencyForCountry } from "@/lib/pricing";

// Returns the visitor's billing currency based on Vercel's edge geo header.
// No external API — Vercel injects x-vercel-ip-country for free at the edge.
export function GET(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country");
  const currency = currencyForCountry(country);
  return NextResponse.json(
    { country: country || null, currency },
    { headers: { "Cache-Control": "no-store" } }
  );
}
