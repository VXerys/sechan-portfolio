"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/motion/gsap";

// Additive only: the native cursor stays visible, so nothing breaks on blur, touch, or keyboard use.
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = dot.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
      const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
      const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
      gsap.set(el, { autoAlpha: 0 });

      const move = (event: PointerEvent) => {
        gsap.to(el, { autoAlpha: 1, duration: 0.2, overwrite: "auto" });
        x(event.clientX);
        y(event.clientY);
        const interactive = (event.target as Element | null)?.closest("a, button, [data-cursor]");
        gsap.to(el, { scale: interactive ? 3.2 : 1, duration: 0.35, ease: "power3", overwrite: "auto" });
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
      className="pointer-events-none fixed left-0 top-0 z-[70] -ml-1.5 -mt-1.5 size-3 rounded-full bg-accent opacity-0 mix-blend-difference"
    />
  );
}
