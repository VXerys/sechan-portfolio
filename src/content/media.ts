import type { StaticImageData } from "next/image";

import portrait from "@/assets/images/portrait.webp";
import marketivDashboard from "@/assets/images/marketiv-dashboard.webp";
import { listings } from "@/content/listings";

export type ProjectMedia = {
  src: StaticImageData;
  alt: string;
  fit: "cover" | "contain";
  background: string;
};

export const portraitImage = {
  src: portrait,
  alt: "Portrait of M Sechan Alfarisi in a black suit and red tie against a red backdrop",
};

// Listing covers (F-010) replace the posters; Marketiv keeps its dashboard until its landing page is revamped.
export const projectMedia: Partial<Record<string, ProjectMedia>> = {
  ...Object.fromEntries(
    Object.entries(listings).map(([slug, listing]) => [slug, { src: listing!.cover, alt: listing!.coverAlt, fit: "cover", background: "#0c0c0b" }]),
  ),
  marketiv: {
    src: marketivDashboard,
    alt: "Marketiv MSME dashboard with demo campaigns, escrow balance, and creator submissions",
    fit: "cover",
    background: "#16181c",
  },
};
