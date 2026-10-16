import type { Metadata, Viewport } from "next";
import { Archivo, Host_Grotesk, Instrument_Serif, JetBrains_Mono } from "next/font/google";

import { Intro } from "@/components/motion/intro";
import { SliceTransition } from "@/components/motion/slice-transition";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Cursor } from "@/components/site/cursor";
import { profile, siteUrl } from "@/content/portfolio";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const hostGrotesk = Host_Grotesk({
  variable: "--font-host",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Resolves relative metadata URLs (icons, Open Graph) to the live domain instead of localhost or a preview URL.
  metadataBase: new URL(siteUrl),
  title: `${profile.name} | ${profile.role}`,
  description: profile.intro,
  authors: [{ name: profile.name, url: siteUrl }],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${profile.name} | Portfolio`,
    description: profile.intro,
    url: "/",
    siteName: profile.name,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0c0b",
};

// Runs before paint: marks JS as available, stops the browser restoring a mid-page scroll under the intro, and
// removes the class again if the intro never starts (script error), so content always shows.
const bootScript = `document.documentElement.classList.add('js');if('scrollRestoration' in history){history.scrollRestoration='manual'}setTimeout(function(){if(!document.documentElement.dataset.intro){document.documentElement.classList.remove('js')}},6000);`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${hostGrotesk.variable} ${instrument.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <SmoothScroll />
        <Intro />
        <SliceTransition />
        <Cursor />
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
