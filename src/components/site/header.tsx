"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

import { scrollToTarget } from "@/components/motion/smooth-scroll";
import { gsap, MOTION_OK, useGSAP } from "@/lib/motion/gsap";
import { LocalTime } from "@/components/site/local-time";
import { Scramble } from "@/components/motion/scramble";

const NAV = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export function Header({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  const go = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (scrollToTarget(href)) event.preventDefault();
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useGSAP(
    () => {
      const el = panel.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (open) {
          gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.out" });
          gsap.from(el.querySelectorAll("[data-menu-item]"), { yPercent: 110, duration: 0.9, ease: "expo.out", stagger: 0.06, delay: 0.1 });
        }
      });
      return () => mm.revert();
    },
    { dependencies: [open] },
  );

  return (
    <>
      {/* Blend mode sits on the fixed element itself; on a child it would only blend inside the header's own stacking context. */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 text-paper mix-blend-difference md:px-8 md:py-5">
        <a href="#top" onClick={(event) => go(event, "#top")} className="label text-[0.8rem] tracking-[0.12em]" aria-label={`${name}, back to top`}>
          Sechan<span className="text-muted">/</span>Alfarisi
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={(event) => go(event, item.href)} className="label link-underline">
              <Scramble on="hover" text={item.label} />
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
          <LocalTime className="label text-muted" />
        </div>
        <button
          ref={toggle}
          type="button"
          className="label md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      <div
        id="mobile-menu"
        ref={panel}
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col justify-end bg-accent px-4 pb-10 text-ink md:hidden"
      >
        <nav aria-label="Mobile">
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.href} className="overflow-hidden">
                <a data-menu-item href={item.href} onClick={(event) => go(event, item.href)} className="display block text-[22vw]">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <LocalTime className="label mt-8 block" />
      </div>
    </>
  );
}
