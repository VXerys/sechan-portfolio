import type { StaticImageData } from "next/image";

import portrait from "@/assets/images/portrait.webp";
import cartifyCover from "@/assets/images/cartify-cover.webp";
import marketivPoster from "@/assets/images/marketiv-landing-poster.webp";
import { listings } from "@/content/listings";

export type ProjectMedia = {
  src: StaticImageData;
  alt: string;
  fit: "cover" | "contain";
  background: string;
  // Composed covers run edge to edge (title, tags), so they are shown whole: no zoom, no scaled parallax.
  composed?: boolean;
  // A screen recording that plays while the frame is in view; src stays the poster for reduced motion and loading.
  video?: { src: string; type: string };
};

export const portraitImage = {
  src: portrait,
  alt: "Portrait of M Sechan Alfarisi in a black suit and red tie against a red backdrop",
};

// Listing covers (F-010) replace the posters; Marketiv's revamped landing page plays as a recording instead.
export const projectMedia: Partial<Record<string, ProjectMedia>> = {
  ...Object.fromEntries(
    Object.entries(listings).map(([slug, listing]) => [slug, { src: listing!.cover, alt: listing!.coverAlt, fit: "cover", background: "#0c0c0b", composed: true }]),
  ),
  cartify: {
    src: cartifyCover,
    alt: "Cartify cover: the SENTIMETER 2026 paper, the presenter certificate, the app's shopping screen and its code, with email addresses hidden",
    fit: "cover",
    background: "#0c0c0b",
    composed: true,
  },
  marketiv: {
    src: marketivPoster,
    alt: "Screen recording of the Marketiv landing page, scrolling from the hero through the problem, the two hiring modes, escrow and the app previews",
    fit: "cover",
    background: "#fbf7f0",
    composed: true,
    video: { src: "/media/marketiv-landing.mp4", type: "video/mp4" },
  },
};
