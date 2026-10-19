"use client";

import { useRef, type ReactNode } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/motion/gsap";

type ClipSheetProps = {
  className?: string;
  children: ReactNode;
  labelledBy?: string;
  id?: string;
  section?: string;
  sectionLabel?: string;
  theme?: string;
};

// A section that opens from an inset rounded card to full bleed as it scrolls in, then narrows again on the way out.
export function ClipSheet({ className, children, labelledBy, id, section, sectionLabel, theme }: ClipSheetProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          el,
          { clipPath: "inset(4% 5% 0% 5% round 40px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 15%", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id={id}
      data-section={section}
      data-section-label={sectionLabel}
      data-theme={theme}
      aria-labelledby={labelledBy}
      className={className}
    >
      {children}
    </section>
  );
}
