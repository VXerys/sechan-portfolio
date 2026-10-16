"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";

const pad = (n: number) => String(n).padStart(2, "0");

// The site mark (also the favicon): three rounded bars at 0, 60, and 120 degrees.
function Asterisk() {
  return (
    <svg data-spin viewBox="-32 -32 64 64" aria-hidden="true" className="size-[0.55em] shrink-0 text-accent">
      {[0, 60, 120].map((angle) => (
        <rect key={angle} x="-4.5" y="-21" width="9" height="42" rx="4.5" fill="currentColor" transform={`rotate(${angle})`} />
      ))}
    </svg>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const track = el.querySelector<HTMLElement>("[data-track]");
      if (!track) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loop = gsap.to(track, { xPercent: -50, duration: 36, ease: "none", repeat: -1 });
        const marks = gsap.utils.toArray<SVGElement>(el.querySelectorAll("[data-spin]"));
        const spin = gsap.to(marks, { rotate: 360, duration: 8, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
        let direction = 1;
        let hovering = false;
        const settle = () => {
          const base = hovering ? 0.25 : 1;
          gsap.to([loop, spin], { timeScale: direction * base, duration: 1.2, ease: "power2.out", overwrite: true });
        };

        // Scroll speed pushes the band and spins the marks faster in the scroll direction, then both ease back.
        const trigger = ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            direction = self.direction;
            const boost = gsap.utils.clamp(1, 5, 1 + Math.abs(self.getVelocity()) / 450);
            gsap.to([loop, spin], { timeScale: direction * boost * (hovering ? 0.25 : 1), duration: 0.2, overwrite: true });
            gsap.delayedCall(0.25, settle);
          },
        });

        // Hover slows the band so a word can be read; the word itself turns lime in CSS.
        const enter = () => {
          hovering = true;
          settle();
        };
        const leave = () => {
          hovering = false;
          settle();
        };
        el.addEventListener("pointerenter", enter);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointerenter", enter);
          el.removeEventListener("pointerleave", leave);
          trigger.kill();
          loop.kill();
          spin.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Display caps and serif italics alternate so the band reads as typesetting, not a shouting banner.
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, index) => (
        <li key={item} className="flex items-center gap-[0.45em] whitespace-nowrap px-[0.45em]">
          <span
            className={`transition-colors duration-300 hover:text-accent ${
              index % 2 === 0 ? "display tracking-tight" : "statement italic normal-case text-paper/80"
            }`}
          >
            {item}
          </span>
          <Asterisk />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      ref={root}
      role="region"
      aria-label="Stack I ship with"
      className="flex flex-col gap-3 border-y border-line py-5 md:flex-row md:items-center md:gap-0 md:py-6"
    >
      <p className="label flex shrink-0 items-center gap-3 px-4 text-muted md:w-56 md:flex-col md:items-start md:gap-1 md:border-r md:border-line md:px-8">
        <span>Stack I ship with</span>
        <span className="text-paper">{pad(items.length)} tools</span>
      </p>
      {/* Faded edges let words enter and leave instead of being cut by the viewport. */}
      <div className="min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div data-track className="flex w-max items-center text-[9vw] leading-none will-change-transform md:text-[3.6vw]">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  );
}
