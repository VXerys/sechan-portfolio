import type { StaticImageData } from "next/image";

import portrait from "@/assets/images/portrait.webp";
import bookmateListing from "@/assets/images/bookmate-listing.webp";
import marketivDashboard from "@/assets/images/marketiv-dashboard.webp";

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

// Only screenshots logged in assumption A-002 are listed; every other project renders a placeholder.
export const projectMedia: Partial<Record<string, ProjectMedia>> = {
  bookmate: {
    src: bookmateListing,
    alt: "BookMate Google Play listing showing the home screen with reading activity, categories, and recommendations",
    fit: "contain",
    background: "#dfe5f7",
  },
  marketiv: {
    src: marketivDashboard,
    alt: "Marketiv MSME dashboard with demo campaigns, escrow balance, and creator submissions",
    fit: "cover",
    background: "#16181c",
  },
};
