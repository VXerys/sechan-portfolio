"use client";

import { useRef, type ElementType, type ReactNode } from "react";

import { EASE_OUT, gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/motion/gsap";

type RevealProps = {
  as?: ElementType;
  id?: string;
  className?: string;
  children: ReactNode;
  // "words" rises headings word by word; "fade" lifts any block.
  mode?: "words" | "fade";
  delay?: number;
};

export function Reveal({ as: Tag = "div", id, className, children, mode = "fade", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const trigger = { trigger: el, start: "top 88%", once: true };
        if (mode === "fade") {
          gsap.from(el, { y: 40, autoAlpha: 0, duration: 1.2, ease: EASE_OUT, delay, scrollTrigger: trigger });
          return;
        }
        const split = SplitText.create(el, {
          type: "words,lines",
          mask: "lines",
          aria: "auto",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, { yPercent: 110, duration: 1.1, ease: EASE_OUT, stagger: 0.04, delay, scrollTrigger: trigger }),
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
