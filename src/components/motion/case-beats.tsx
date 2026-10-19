"use client";

import { useRef, useState } from "react";

import { BEATS } from "@/components/motion/beats";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";

// Wide screens only: the rail sits in the sticky column, so on a phone it would scroll away with the text it describes.
const RAIL = "(prefers-reduced-motion: no-preference) and (min-width: 1024px)";

// Narrates where the reader is in a case study: the beat whose block crosses the middle lights up, and the rail fills
// with progress through the whole study. Blocks opt in with data-beat="0..2" inside the same <article>.
export function CaseBeats() {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    const el = rail.current;
    const article = el?.closest("article");
    if (!el || !article) return;
    const mm = gsap.matchMedia();
    mm.add(RAIL, () => {
      const fill = el.querySelector("[data-fill]");
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: article, start: "top 50%", end: "bottom 50%", scrub: true } },
      );
      const blocks = Array.from(article.querySelectorAll<HTMLElement>("[data-beat]"));
      const triggers = blocks.map((block) =>
        ScrollTrigger.create({
          trigger: block,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(Number(block.dataset.beat));
          },
        }),
      );
      return () => triggers.forEach((trigger) => trigger.kill());
    });
    return () => mm.revert();
  });

  return (
    <div ref={rail} aria-hidden="true" className="mt-10 hidden gap-5 lg:flex">
      <div className="relative w-px bg-line">
        <span data-fill className="absolute inset-0 origin-top bg-accent" />
      </div>
      <ol className="space-y-4">
        {BEATS.map((beat, index) => (
          <li
            key={beat}
            className={`label flex items-center gap-3 transition-colors duration-500 ${index === active ? "text-paper" : "text-muted"}`}
          >
            <span
              className={`size-2 rounded-full border border-current transition-[background-color,scale] duration-500 ${
                index === active ? "scale-125 bg-accent" : "scale-100 bg-transparent"
              }`}
            />
            {String(index + 1).padStart(2, "0")} {beat}
          </li>
        ))}
      </ol>
    </div>
  );
}
