"use client";

import { useEffect, useRef, useState } from "react";

import { gsap, MOTION_OK, ScrollTrigger } from "@/lib/motion/gsap";

export type CurrentSection = { id: string; label: string; number: string } | null;

// Reports the chapter whose body crosses the middle of the viewport; chapters opt in with data-section.
export function useCurrentSection() {
  const [current, setCurrent] = useState<CurrentSection>(null);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const triggers = sections.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          if (self.isActive) setCurrent({ id: el.id, label: el.dataset.sectionLabel ?? "", number: el.dataset.section ?? "" });
          else if (sections.indexOf(el) === 0 && self.direction === -1) setCurrent(null);
        },
      }),
    );
    return () => triggers.forEach((trigger) => trigger.kill());
  }, []);

  return current;
}

// The chapter name rises into place when it changes and is announced once; the reading progress beside it updates
// every frame, so it stays out of the live region.
export function SectionIndicator({ current, className }: { current: CurrentSection; className?: string }) {
  const text = useRef<HTMLSpanElement>(null);
  const percent = useRef<HTMLSpanElement>(null);
  const value = current ? `Ch. ${current.number} · ${current.label}` : "";

  useEffect(() => {
    const el = text.current;
    if (!el) return;
    el.textContent = value;
    if (!value || !window.matchMedia(MOTION_OK).matches) return;
    const tween = gsap.fromTo(el, { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "expo.out" });
    return () => {
      tween.kill();
    };
  }, [value]);

  useEffect(() => {
    const el = percent.current;
    if (!el) return;
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        el.textContent = `${String(Math.round(self.progress * 100)).padStart(2, "0")}%`;
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <span className={className}>
      <span className="inline-block overflow-hidden align-bottom" aria-live="polite">
        <span ref={text} className="inline-block" />
      </span>
      <span ref={percent} aria-hidden="true" className={`ml-3 tabular-nums ${value ? "" : "hidden"}`} />
    </span>
  );
}
