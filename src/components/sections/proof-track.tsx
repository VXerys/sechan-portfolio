"use client";

import { useRef } from "react";

import { DriftTitle } from "@/components/motion/drift-title";
import { Reveal } from "@/components/motion/reveal";
import type { Achievement } from "@/content/portfolio";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";

const WIDE_MOTION = `${MOTION_OK} and (min-width: 1024px)`;

// Recognition as a horizontal reel on wide screens: the block pins and the cards travel sideways with the scroll.
// Without motion or below 1024 px the same cards sit in a grid, so nothing depends on the pin.
export function ProofTrack({ achievements }: { achievements: Achievement[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(WIDE_MOTION, () => {
        const pinned = el.querySelector<HTMLElement>("[data-pin]");
        const track = el.querySelector<HTMLElement>("[data-track]");
        const progress = el.querySelector<HTMLElement>("[data-progress]");
        if (!pinned || !track) return;
        el.dataset.horizontal = "true";
        const distance = () => Math.max(0, track.scrollWidth - pinned.clientWidth);
        const tween = gsap.to(track, { x: () => -distance(), ease: "none" });
        ScrollTrigger.create({
          trigger: pinned,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          animation: tween,
          invalidateOnRefresh: true,
          onUpdate: (self) => progress && gsap.set(progress, { scaleX: self.progress }),
        });
        ScrollTrigger.refresh();
        // matchMedia's revert puts the track back at x 0 and removes the pin when the screen narrows;
        // killing the tween by hand here would skip that and leave the grid shifted sideways.
        return () => {
          delete el.dataset.horizontal;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="group/proof mt-28 md:mt-40">
      <div data-pin className="group-data-[horizontal]/proof:flex group-data-[horizontal]/proof:h-svh group-data-[horizontal]/proof:flex-col group-data-[horizontal]/proof:justify-center">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="label mb-6 text-ink/50">(05) Recognition</p>
            <DriftTitle lines={["Proof"]} className="display text-[24vw] md:text-[14vw] group-data-[horizontal]/proof:text-[9vw]" />
          </div>
          <p className="label hidden pb-3 text-ink/50 group-data-[horizontal]/proof:block">Scroll to move sideways →</p>
        </div>

        <ul
          data-track
          className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 group-data-[horizontal]/proof:mt-10 group-data-[horizontal]/proof:flex group-data-[horizontal]/proof:w-max group-data-[horizontal]/proof:gap-6"
        >
          {achievements.map((item, index) => (
            <li key={item.title} className="group-data-[horizontal]/proof:w-[30vw]">
              <Reveal mode="clip" delay={index * 0.06} className="group relative h-full overflow-hidden border border-ink/15">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-y-100"
                />
                <div className="relative flex h-full min-h-[18rem] flex-col justify-between gap-8 p-6 md:p-8 group-data-[horizontal]/proof:min-h-[52vh]">
                  <div className="flex items-start justify-between gap-4">
                    <span className="display text-6xl md:text-7xl">{item.year}</span>
                    <span className="label text-ink/50">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold leading-snug md:text-2xl">{item.title}</h3>
                    <p className="mt-1 text-sm text-ink/60">{item.issuer}</p>
                    {item.note && <p className="statement mt-5 text-xl italic leading-snug text-ink/80 md:text-2xl">{item.note}</p>}
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <div aria-hidden="true" className="mt-8 hidden h-px bg-ink/15 group-data-[horizontal]/proof:block">
          <span data-progress className="block h-px origin-left scale-x-0 bg-ink" />
        </div>
      </div>
    </div>
  );
}
