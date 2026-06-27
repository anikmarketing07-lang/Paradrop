import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Paradrop — AI Lead Generation",
    short_name: "Paradrop",
    description:
      "Find local business leads with phone, email & socials. AI writes your cold email + WhatsApp DM for each.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0b",
    theme_color: "#0e8c66",
    icons: [
      { src: "/paradrop-logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/paradrop-logo.png", sizes: "192x192", type: "image/png", purpose: "any" },
    ],
  };
}
