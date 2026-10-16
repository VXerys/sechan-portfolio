"use client";

import { useRef, type ReactNode } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/motion/gsap";

type MagneticProps = { children: ReactNode; strength?: number; className?: string };

// Pulls its child toward the pointer and springs back on leave; fine pointers only, never on touch.
export function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
      const x = gsap.quickTo(el, "x", { duration: 0.9, ease: "elastic.out(1, 0.35)" });
      const y = gsap.quickTo(el, "y", { duration: 0.9, ease: "elastic.out(1, 0.35)" });
      const move = (event: PointerEvent) => {
        const box = el.getBoundingClientRect();
        x((event.clientX - (box.left + box.width / 2)) * strength);
        y((event.clientY - (box.top + box.height / 2)) * strength);
      };
      const reset = () => {
        x(0);
        y(0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", reset);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", reset);
      };
    });
    return () => mm.revert();
  });

  return (
    <span ref={ref} className={`inline-block ${className ?? ""}`}>
      {children}
    </span>
  );
}
