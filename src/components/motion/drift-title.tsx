"use client";

import { useRef, type ElementType } from "react";

import { EASE_OUT, gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/motion/gsap";

type DriftTitleProps = {
  lines: string[];
  as?: ElementType;
  id?: string;
  className?: string;
  // Each line slides the opposite way to its neighbour while the title crosses the viewport.
  drift?: number;
  accentLine?: number;
};

export function DriftTitle({ lines, as: Tag = "h2", id, className, drift = 10, accentLine }: DriftTitleProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const rows = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-drift-line]"));
        const split = SplitText.create(rows, { type: "chars", mask: "lines" });
        gsap.from(split.chars, {
          yPercent: 110,
          rotate: 6,
          duration: 1.2,
          ease: EASE_OUT,
          stagger: 0.025,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
        rows.forEach((row, index) => {
          const direction = index % 2 === 0 ? -1 : 1;
          gsap.fromTo(
            row,
            { xPercent: -direction * drift * 0.5 },
            { xPercent: direction * drift * 0.5, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className} aria-label={lines.join(" ")}>
      {lines.map((line, index) => (
        <span
          key={line}
          aria-hidden="true"
          data-drift-line
          className={`block whitespace-nowrap ${index % 2 === 1 ? "text-right" : ""} ${accentLine === index ? "text-accent" : ""}`}
        >
          {line}
        </span>
      ))}
    </Tag>
  );
}
