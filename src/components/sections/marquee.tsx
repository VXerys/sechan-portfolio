"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";

export function Marquee({ items }: { items: string[] }) {
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loop = gsap.to(el, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
        let direction = 1;
        // Scroll velocity speeds the loop up and flips it with the scroll direction, then it eases back.
        const trigger = ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            direction = self.direction;
            const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 400);
            gsap.to(loop, { timeScale: direction * boost, duration: 0.2, overwrite: true });
            gsap.to(loop, { timeScale: direction, duration: 1.2, delay: 0.2, ease: "power2.out" });
          },
        });
        return () => {
          trigger.kill();
          loop.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: track },
  );

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap">
          <span className="display px-6 text-[9vw] md:text-[5.5vw]">{item}</span>
          <span className="statement text-[7vw] italic text-accent md:text-[4vw]" aria-hidden="true">
            &amp;
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="overflow-hidden border-y border-line py-4" role="region" aria-label="Tools I work with">
      <div ref={track} className="flex w-max will-change-transform">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
