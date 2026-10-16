"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

import { Magnetic } from "@/components/motion/magnetic";
import { RollText } from "@/components/motion/roll-text";
import { scrollToTarget } from "@/components/motion/smooth-scroll";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
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
  const bar = useRef<HTMLElement>(null);
  const openRef = useRef(open);

  useEffect(() => {
    openRef.current = open;
    if (open && bar.current) gsap.to(bar.current, { yPercent: 0, duration: 0.4, ease: "expo.out" });
  }, [open]);

  // Hides on scroll down and returns on scroll up, so the blended header never sits on top of body copy while reading.
  useGSAP(() => {
    const el = bar.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const trigger = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const hide = !openRef.current && self.scroll() > 160 && self.direction === 1;
          gsap.to(el, { yPercent: hide ? -110 : 0, duration: 0.6, ease: "expo.out", overwrite: true });
        },
      });
      return () => trigger.kill();
    });
    return () => mm.revert();
  });

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
      <header
        ref={bar}
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 md:px-8 md:py-5 ${open ? "text-ink" : "text-paper mix-blend-difference"}`}
      >
        <a href="#top" onClick={(event) => go(event, "#top")} className="label text-[0.8rem] tracking-[0.12em]" aria-label={`${name}, back to top`}>
          Sechan<span className={open ? "text-ink/50" : "text-muted"}>/</span>Alfarisi
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Magnetic key={item.href} strength={0.45}>
              <a href={item.href} onClick={(event) => go(event, item.href)} className="label link-underline block py-2">
                <Scramble on="hover" text={item.label} />
              </a>
            </Magnetic>
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
          <RollText text={open ? "Close" : "Menu"} />
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
            {NAV.map((item, index) => (
              <li key={item.href} className="overflow-hidden">
                <a data-menu-item href={item.href} onClick={(event) => go(event, item.href)} className="flex items-start gap-3">
                  <span className="label mt-[2vw] text-ink/60">0{index + 1}</span>
                  <span className="display text-[16.5vw]">{item.label}</span>
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
