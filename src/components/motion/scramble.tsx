"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/motion/gsap";

type ScrambleProps = {
  text: string;
  className?: string;
  // "view" decodes once when scrolled into view; "hover" re-decodes when the nearest link or button is hovered.
  on?: "view" | "hover";
};

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/";

export function Scramble({ text, className, on = "view" }: ScrambleProps) {
  const visual = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = visual.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const decode = () =>
          gsap.to(el, { duration: 0.9, ease: "none", overwrite: true, scrambleText: { text, chars: CHARS, speed: 0.5, revealDelay: 0.15 } });

        if (on === "view") {
          gsap.set(el, { scrambleText: { text: " ", chars: CHARS } });
          const tween = gsap.to(el, {
            duration: 1.1,
            ease: "none",
            scrambleText: { text, chars: CHARS, speed: 0.5, revealDelay: 0.2 },
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
          return () => tween.kill();
        }

        const host = el.closest("a, button") ?? el;
        host.addEventListener("pointerenter", decode);
        host.addEventListener("focus", decode);
        return () => {
          host.removeEventListener("pointerenter", decode);
          host.removeEventListener("focus", decode);
          el.textContent = text;
        };
      });
      return () => mm.revert();
    },
    { dependencies: [text, on] },
  );

  // The visible span is decorative while it scrambles; assistive tech reads the stable copy.
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={visual} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
