"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/motion/gsap";

// Additive only: the native cursor stays visible, so nothing breaks on blur, touch, or keyboard use.
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = dot.current;
    const text = label.current;
    if (!el || !text) return;
    const mm = gsap.matchMedia();
    mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
      gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
      const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
      let current = "";

      const move = (event: PointerEvent) => {
        x(event.clientX);
        y(event.clientY);
        const target = event.target as Element | null;
        const labelled = target?.closest<HTMLElement>("[data-cursor-label]");
        const next = labelled?.dataset.cursorLabel ?? "";
        const interactive = !next && target?.closest("a, button, [data-cursor]");
        if (next !== current) {
          current = next;
          text.textContent = next;
          el.dataset.state = next ? "label" : "dot";
        }
        const size = next ? 96 : interactive ? 36 : 12;
        gsap.to(el, { autoAlpha: 1, width: size, height: size, duration: 0.4, ease: "power3", overwrite: "auto" });
      };
      const hide = () => gsap.to(el, { autoAlpha: 0, duration: 0.2 });

      window.addEventListener("pointermove", move);
      document.addEventListener("pointerleave", hide);
      window.addEventListener("blur", hide);
      return () => {
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerleave", hide);
        window.removeEventListener("blur", hide);
      };
    });
    return () => mm.revert();
  });

  return (
    <div
      ref={dot}
      aria-hidden="true"
      data-state="dot"
      className="pointer-events-none fixed left-0 top-0 z-[70] flex size-3 items-center justify-center overflow-hidden rounded-full bg-accent opacity-0 mix-blend-difference data-[state=label]:mix-blend-normal"
    >
      <span ref={label} className="label whitespace-nowrap text-[0.65rem] text-ink" />
    </div>
  );
}
