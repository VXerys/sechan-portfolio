"use client";

import { useRef, type MouseEvent } from "react";

import { Reveal } from "@/components/motion/reveal";
import { scrollToTarget } from "@/components/motion/smooth-scroll";
import { LocalTime } from "@/components/site/local-time";
import type { Profile } from "@/content/portfolio";
import { gsap, MOTION_OK, useGSAP } from "@/lib/motion/gsap";

export function Contact({ profile }: { profile: Profile }) {
  const magnet = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    const el = magnet.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
      const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
      const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
      const move = (event: PointerEvent) => {
        const box = el.getBoundingClientRect();
        x((event.clientX - (box.left + box.width / 2)) * 0.35);
        y((event.clientY - (box.top + box.height / 2)) * 0.35);
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

  const toTop = (event: MouseEvent<HTMLAnchorElement>) => {
    if (scrollToTarget(0)) event.preventDefault();
  };

  return (
    <footer id="contact" aria-labelledby="contact-title" className="relative overflow-hidden px-4 pb-8 pt-28 md:px-8 md:pt-40">
      <p className="label text-muted">(06) Contact</p>
      <Reveal as="h2" id="contact-title" mode="words" className="display mt-6 text-[21vw] md:text-[15vw]">
        Let&apos;s build
      </Reveal>

      <div className="mt-12 grid items-end gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="max-w-lg font-serif text-3xl italic leading-tight text-paper/90">{profile.availability}</p>
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="link-underline mt-8 inline-block break-all text-2xl font-medium tracking-tight md:text-4xl">
              {profile.email}
            </a>
          )}
        </div>
        <div className="flex md:col-span-5 md:justify-end">
          {profile.email && (
            <a
              ref={magnet}
              href={`mailto:${profile.email}`}
              className="label flex size-40 items-center justify-center rounded-full bg-accent text-center text-ink transition-colors hover:bg-paper md:size-48"
            >
              Start a
              <br />
              conversation
            </a>
          )}
        </div>
      </div>

      <div className="mt-24 flex flex-col gap-6 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
        <ul className="flex flex-wrap gap-6">
          {profile.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="label link-underline">
                {link.label} <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
        <LocalTime className="label text-muted" />
        <div className="label flex items-center gap-6 text-muted">
          <span>© 2026 {profile.name}</span>
          <a href="#top" onClick={toTop} className="link-underline text-paper">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
