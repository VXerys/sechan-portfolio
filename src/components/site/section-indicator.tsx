"use client";

import { useEffect, useRef, useState } from "react";

import { gsap, MOTION_OK, ScrollTrigger } from "@/lib/motion/gsap";

export type CurrentSection = { id: string; label: string; number: string } | null;

// Reports the section whose body crosses the middle of the viewport; sections opt in with data-section.
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

// The label decodes into the new section name, the same scramble the section labels use.
export function SectionIndicator({ current, className }: { current: CurrentSection; className?: string }) {
  const text = useRef<HTMLSpanElement>(null);
  const value = current ? `(${current.number}) ${current.label}` : "";

  useEffect(() => {
    const el = text.current;
    if (!el) return;
    if (!window.matchMedia(MOTION_OK).matches) {
      el.textContent = value;
      return;
    }
    const tween = gsap.to(el, {
      duration: 0.6,
      ease: "none",
      scrambleText: { text: value || " ", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", speed: 0.6 },
    });
    return () => {
      tween.kill();
    };
  }, [value]);

  return (
    <span className={className} aria-live="polite">
      <span ref={text} />
    </span>
  );
}
