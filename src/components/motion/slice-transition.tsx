"use client";

import { useRef } from "react";

import { jumpToTarget, scrollToTarget } from "@/components/motion/smooth-scroll";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";

type Target = string | number;

let runner: ((target: Target) => void) | null = null;

// Navigates to an in-page target. With motion allowed the slices cover the jump; otherwise it falls back to a
// smooth scroll, and returns false when neither is available so the caller keeps the native anchor behaviour.
export function jumpTo(target: Target) {
  if (runner) {
    runner(target);
    return true;
  }
  return scrollToTarget(target);
}

const SLICES = 5;

function labelFor(target: Target) {
  if (typeof target !== "string") return "Top";
  const section = document.querySelector<HTMLElement>(target);
  return section?.dataset.sectionLabel ?? (target === "#top" ? "Top" : "");
}

export function SliceTransition() {
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const bars = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-slice]"));
      let busy = false;

      runner = (target) => {
        if (busy) return;
        busy = true;
        if (label.current) label.current.textContent = labelFor(target);
        gsap.set(el, { display: "block" });
        gsap
          .timeline({
            defaults: { ease: "power4.inOut" },
            onComplete: () => {
              gsap.set(el, { display: "none" });
              busy = false;
            },
          })
          .fromTo(bars, { yPercent: 101 }, { yPercent: 0, duration: 0.55, stagger: 0.05 })
          .fromTo(label.current, { yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: "expo.out" }, "-=0.25")
          // The jump happens while the screen is covered, then triggers catch up before the slices leave.
          .add(() => {
            jumpToTarget(target);
            ScrollTrigger.update();
          })
          .to(label.current, { yPercent: -110, duration: 0.4, ease: "expo.in" }, "+=0.15")
          .to(bars, { yPercent: -101, duration: 0.6, stagger: 0.05 }, "-=0.1");
      };
      return () => {
        runner = null;
      };
    });
    return () => mm.revert();
  });

  return (
    <div ref={root} aria-hidden="true" className="fixed inset-y-0 left-0 z-[85] hidden w-screen">
      <div className="flex h-full">
        {Array.from({ length: SLICES }, (_, index) => (
          <span key={index} data-slice className="h-full flex-1 bg-accent" style={{ marginLeft: index ? -1 : 0 }} />
        ))}
      </div>
      <span className="absolute inset-0 flex items-center justify-center">
        {/* The label rises through its own line mask while the slices hold. */}
        <span className="block overflow-hidden pb-[0.1em]">
          <span ref={label} className="display block text-[18vw] text-ink md:text-[10vw]" />
        </span>
      </span>
    </div>
  );
}
