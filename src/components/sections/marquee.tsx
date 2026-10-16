"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";

export function Marquee({ items }: { items: string[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tracks = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-track]"));
        const loops = tracks.map((track, index) =>
          index === 0
            ? gsap.to(track, { xPercent: -50, duration: 40, ease: "none", repeat: -1 })
            : gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration: 48, ease: "none", repeat: -1 }),
        );
        const skew = gsap.quickTo(tracks, "skewX", { duration: 0.6, ease: "power3" });

        // Scroll speed accelerates both rows, flips them with the scroll direction, and leans the type into the motion.
        const trigger = ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(velocity) / 400);
            loops.forEach((loop) => {
              gsap.to(loop, { timeScale: self.direction * boost, duration: 0.2, overwrite: true });
              gsap.to(loop, { timeScale: self.direction, duration: 1.2, delay: 0.2, ease: "power2.out" });
            });
            skew(gsap.utils.clamp(-12, 12, velocity / -250));
            gsap.delayedCall(0.25, () => skew(0));
          },
        });
        return () => {
          trigger.kill();
          loops.forEach((loop) => loop.kill());
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const row = (hidden: boolean, outline: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap">
          <span
            className={`display px-6 text-[9vw] md:text-[5.5vw] ${outline ? "text-transparent [-webkit-text-stroke:1px_var(--color-muted)]" : ""}`}
          >
            {item}
          </span>
          <span className="statement text-[7vw] italic text-accent md:text-[4vw]" aria-hidden="true">
            &amp;
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={root} className="overflow-hidden border-y border-line py-4" role="region" aria-label="Tools I work with">
      <div data-track className="flex w-max will-change-transform">
        {row(false, false)}
        {row(true, false)}
      </div>
      <div data-track className="flex w-max will-change-transform" aria-hidden="true">
        {row(true, true)}
        {row(true, true)}
      </div>
    </div>
  );
}
