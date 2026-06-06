import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserUsage, incrementLeads } from "@/lib/usage";

type PlaceResult = {
  displayName?: { text?: string };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  businessStatus?: string;
  primaryTypeDisplayName?: { text?: string };
};

function toE164(intlPhone?: string): string {
  if (!intlPhone) return "";
  return intlPhone.replace(/[^\d+]/g, "");
}

function bareDomain(url?: string): string {
  if (!url) return "";
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "").replace(/^www\./, "");
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ leads: [], error: "Unauthorized" }, { status: 401 });

    const { niche, location } = await req.json();
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || "";

    if (!apiKey) {
      return NextResponse.json({ leads: [], error: "Lead source not configured. Contact support." }, { status: 503 });
    }
    if (!niche || !String(niche).trim()) {
      return NextResponse.json({ leads: [], error: "Enter a niche or business type." }, { status: 400 });
    }

    // Usage limits
    const usage = await getUserUsage(userId);
    if (usage.leadCount + 20 > usage.limit) {
      return NextResponse.json(
        {
          leads: [],
          error: `Limit reached. ${usage.leadCount}/${usage.limit} leads used this cycle. Upgrade your plan.`,
          limitReached: true,
          plan: usage.plan,
        },
        { status: 403 }
      );
    }

    // Build text query: "<niche> in <location>"
    const query = location && String(location).trim()
      ? `${niche} in ${location}`
      : String(niche);

    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": [
          "places.displayName",
          "places.formattedAddress",
          "places.nationalPhoneNumber",
          "places.internationalPhoneNumber",
          "places.websiteUri",
          "places.rating",
          "places.userRatingCount",
          "places.googleMapsUri",
          "places.businessStatus",
          "places.primaryTypeDisplayName",
        ].join(","),
      },
      body: JSON.stringify({
        textQuery: query,
        pageSize: 20,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Places error:", res.status, err);
      return NextResponse.json({ leads: [], error: `Search failed (${res.status}). Try a different niche or location.` }, { status: 400 });
    }

    const data = await res.json();
    const places: PlaceResult[] = data.places || [];

    if (places.length === 0) {
      return NextResponse.json({ leads: [], error: "No businesses found. Try a broader niche or different city." }, { status: 200 });
    }

    const leads = places
      .filter((p) => p.businessStatus !== "CLOSED_PERMANENTLY")
      .map((p, i) => {
        const phone = toE164(p.internationalPhoneNumber || p.nationalPhoneNumber);
        const name = p.displayName?.text || "Business";
        return {
          id: String(i + 1),
          name,
          role: p.primaryTypeDisplayName?.text || "Business",
          company: name,
          email: "", // Places doesn't expose email; outreach via WhatsApp/phone/website
          phone,
          whatsapp: phone,
          instagram: "",
          facebook: "",
          website: bareDomain(p.websiteUri),
          address: p.formattedAddress || "",
          mapsUrl: p.googleMapsUri || "",
          rating: p.rating,
          reviews: p.userRatingCount,
          industry: String(niche),
          location: location ? String(location) : (p.formattedAddress?.split(",").slice(-2).join(",").trim() || ""),
          verified: !!phone, // verified = has a reachable phone
        };
      });

    await incrementLeads(userId, leads.length);

    return NextResponse.json({
      leads,
      usage: { used: usage.leadCount + leads.length, limit: usage.limit, plan: usage.plan },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ leads: [], error: "Failed to fetch leads. Try again." }, { status: 500 });
  }
}
