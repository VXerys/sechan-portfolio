"use client";

import { useRef, type ComponentPropsWithoutRef, type ReactNode, type Ref } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/motion/gsap";

const BASE =
  "pill group relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-5 py-3 label transition-[scale,border-color] duration-300 active:scale-[0.97]";
const TONES = { default: "border-line text-paper hover:border-accent", accent: "border-accent/60 text-accent hover:border-accent" };
type Tone = keyof typeof TONES;

// Lime floods the pill from the point the pointer entered and drains toward the point it left; three ink dots trail
// the pointer inside, so the button itself becomes the cursor (the global ring hides over it).
function usePill() {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
      const fill = el.querySelector<HTMLElement>("[data-fill]");
      const dots = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-trail]"));
      if (!fill) return;
      el.dataset.animated = "true";
      gsap.set(dots, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      const movers = dots.map((dot, index) => ({
        x: gsap.quickTo(dot, "x", { duration: 0.18 + index * 0.12, ease: "power3" }),
        y: gsap.quickTo(dot, "y", { duration: 0.18 + index * 0.12, ease: "power3" }),
      }));

      const point = (event: PointerEvent) => {
        const box = el.getBoundingClientRect();
        return { x: event.clientX - box.left, y: event.clientY - box.top, w: box.width, h: box.height };
      };
      const enter = (event: PointerEvent) => {
        const p = point(event);
        const at = `${(p.x / p.w) * 100}% ${(p.y / p.h) * 100}%`;
        gsap.fromTo(fill, { clipPath: `circle(0% at ${at})` }, { clipPath: `circle(150% at ${at})`, duration: 0.55, ease: "power3.out", overwrite: true });
        movers.forEach((mover, index) => {
          gsap.set(dots[index], { x: p.x, y: p.y });
        });
        gsap.to(dots, { autoAlpha: 1, duration: 0.2 });
      };
      const move = (event: PointerEvent) => {
        const p = point(event);
        movers.forEach((mover) => {
          mover.x(p.x);
          mover.y(p.y);
        });
      };
      const leave = (event: PointerEvent) => {
        const p = point(event);
        const at = `${Math.min(100, Math.max(0, (p.x / p.w) * 100))}% ${Math.min(100, Math.max(0, (p.y / p.h) * 100))}%`;
        gsap.to(fill, { clipPath: `circle(0% at ${at})`, duration: 0.45, ease: "power3.in", overwrite: true });
        gsap.to(dots, { autoAlpha: 0, duration: 0.2 });
      };
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        delete el.dataset.animated;
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    });
    return () => mm.revert();
  });

  return ref;
}

function Inner({ children }: { children: ReactNode }) {
  return (
    <>
      <span data-fill aria-hidden="true" className="pill-fill absolute inset-0 rounded-full bg-accent" style={{ clipPath: "circle(0% at 50% 50%)" }} />
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          data-trail
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-10 rounded-full bg-ink opacity-0"
          style={{ width: 6 - index * 1.5, height: 6 - index * 1.5 }}
        />
      ))}
      <span className="pill-label relative z-[5] flex items-center gap-2 transition-colors duration-300">{children}</span>
    </>
  );
}

type PillLinkProps = ComponentPropsWithoutRef<"a"> & { children: ReactNode; tone?: Tone };

export function PillLink({ children, className, tone = "default", ...props }: PillLinkProps) {
  const ref = usePill();
  return (
    <a ref={ref as Ref<HTMLAnchorElement>} data-cursor="hide" className={`${BASE} ${TONES[tone]} ${className ?? ""}`} {...props}>
      <Inner>{children}</Inner>
    </a>
  );
}

type PillButtonProps = ComponentPropsWithoutRef<"button"> & { children: ReactNode; tone?: Tone };

export function PillButton({ children, className, tone = "default", type = "button", ...props }: PillButtonProps) {
  const ref = usePill();
  return (
    <button ref={ref as Ref<HTMLButtonElement>} type={type} data-cursor="hide" className={`${BASE} ${TONES[tone]} ${className ?? ""}`} {...props}>
      <Inner>{children}</Inner>
    </button>
  );
}
