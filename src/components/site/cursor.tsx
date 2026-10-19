"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/motion/gsap";

type CursorState = "idle" | "link" | "label" | "hidden";

const RING_SIZE: Record<CursorState, number> = { idle: 38, link: 64, label: 104, hidden: 0 };

// Additive only: the native cursor stays visible, so nothing breaks on blur, touch, or keyboard use.
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const dotEl = dot.current;
    const ringEl = ring.current;
    const text = label.current;
    if (!dotEl || !ringEl || !text) return;
    const mm = gsap.matchMedia();
    mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
      gsap.set([dotEl, ringEl], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      const dotX = gsap.quickTo(dotEl, "x", { duration: 0.12, ease: "power3" });
      const dotY = gsap.quickTo(dotEl, "y", { duration: 0.12, ease: "power3" });
      // The ring trails the dot; the lag is what makes the cursor feel physical.
      const ringX = gsap.quickTo(ringEl, "x", { duration: 0.55, ease: "power3" });
      const ringY = gsap.quickTo(ringEl, "y", { duration: 0.55, ease: "power3" });
      let state: CursorState | null = null;

      const setState = (next: CursorState, nextLabel: string) => {
        if (next === state && text.textContent === nextLabel) return;
        state = next;
        text.textContent = nextLabel;
        ringEl.dataset.state = next;
        const size = RING_SIZE[next];
        gsap.to(ringEl, { width: size, height: size, autoAlpha: next === "hidden" ? 0 : 1, duration: 0.5, ease: "expo.out", overwrite: "auto" });
        gsap.to(dotEl, { scale: next === "idle" ? 1 : 0, autoAlpha: next === "hidden" ? 0 : 1, duration: 0.3, overwrite: "auto" });
        gsap.fromTo(text, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: "expo.out", delay: 0.05 });
      };

      const move = (event: PointerEvent) => {
        dotX(event.clientX);
        dotY(event.clientY);
        ringX(event.clientX);
        ringY(event.clientY);
        const target = event.target as Element | null;
        if (target?.closest("[data-cursor='hide']")) return setState("hidden", "");
        const labelled = target?.closest<HTMLElement>("[data-cursor-label]");
        if (labelled) return setState("label", labelled.dataset.cursorLabel ?? "");
        if (target?.closest("a, button, [role='button']")) return setState("link", "");
        setState("idle", "");
      };
      const press = () => gsap.to(ringEl, { scale: 0.82, duration: 0.2, ease: "power3.out" });
      const release = () => gsap.to(ringEl, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const hide = () => {
        gsap.to([dotEl, ringEl], { autoAlpha: 0, duration: 0.2 });
        state = null;
      };

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerdown", press);
      window.addEventListener("pointerup", release);
      document.addEventListener("pointerleave", hide);
      window.addEventListener("blur", hide);
      return () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerdown", press);
        window.removeEventListener("pointerup", release);
        document.removeEventListener("pointerleave", hide);
        window.removeEventListener("blur", hide);
      };
    });
    return () => mm.revert();
  });

  return (
    <>
      <div
        ref={ring}
        aria-hidden="true"
        data-site-cursor
        data-state="idle"
        className="pointer-events-none fixed left-0 top-0 z-[70] flex size-[38px] items-center justify-center overflow-hidden rounded-full border border-paper/50 opacity-0 mix-blend-difference transition-[background-color,border-color] duration-300 data-[state=label]:border-transparent data-[state=label]:bg-accent data-[state=label]:mix-blend-normal data-[state=link]:border-transparent data-[state=link]:bg-paper"
      >
        <span ref={label} className="label whitespace-nowrap text-[0.65rem] text-ink" />
      </div>
      <div
        ref={dot}
        aria-hidden="true"
        data-site-cursor
        className="pointer-events-none fixed left-0 top-0 z-[71] size-1.5 rounded-full bg-accent opacity-0"
      />
    </>
  );
}
