"use client";

import { useRef, type ElementType, type ReactNode } from "react";

import { EASE_OUT, gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";

type LineRowsProps = { as?: ElementType; className?: string; children: ReactNode };

// Children mark rows with `data-row`, each holding a `data-line` hairline and `data-row-content`.
// Rows entering together are batched so a list draws in as one gesture instead of one trigger per row.
export function LineRows({ as: Tag = "div", className, children }: LineRowsProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const rows = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-row]"));
        rows.forEach((row) => {
          gsap.set(row.querySelectorAll("[data-line]"), { scaleX: 0, transformOrigin: "left center" });
          gsap.set(row.querySelectorAll("[data-row-content]"), { yPercent: 40, autoAlpha: 0 });
        });
        const batches = ScrollTrigger.batch(rows, {
          start: "top 90%",
          once: true,
          onEnter: (batch) => {
            const lines = batch.flatMap((row) => Array.from((row as HTMLElement).querySelectorAll("[data-line]")));
            const content = batch.flatMap((row) => Array.from((row as HTMLElement).querySelectorAll("[data-row-content]")));
            gsap.to(lines, { scaleX: 1, duration: 1.2, ease: "expo.inOut", stagger: 0.08 });
            gsap.to(content, { yPercent: 0, autoAlpha: 1, duration: 1, ease: EASE_OUT, stagger: 0.08, delay: 0.15 });
          },
        });
        return () => batches.forEach((trigger) => trigger.kill());
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
