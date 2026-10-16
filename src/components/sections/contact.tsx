"use client";

import { useRef, type MouseEvent } from "react";

import { DriftTitle } from "@/components/motion/drift-title";
import { Magnetic } from "@/components/motion/magnetic";
import { RollText } from "@/components/motion/roll-text";
import { scrollToTarget } from "@/components/motion/smooth-scroll";
import { LocalTime } from "@/components/site/local-time";
import { CopyEmail } from "@/components/site/copy-email";
import { contact, type Profile } from "@/content/portfolio";
import { mailtoHref } from "@/lib/mailto";
import { gsap, MOTION_OK, useGSAP } from "@/lib/motion/gsap";

const RING = "Available for freelance · Open to work · 2026 · ";

function CircleText({ text }: { text: string }) {
  const chars = text.split("");
  const step = 360 / chars.length;
  return (
    <span aria-hidden="true" className="spin-slow pointer-events-none absolute inset-0">
      {chars.map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="label absolute left-1/2 top-0 h-1/2 w-4 -ml-2 origin-bottom text-center text-paper/70"
          style={{ transform: `rotate(${index * step}deg)` }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

export function Contact({ profile, number }: { profile: Profile; number: string }) {
  const footer = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = footer.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // The footer content starts lower and catches up, so it looks uncovered from beneath the page above.
        gsap.fromTo(
          el.querySelector("[data-footer-inner]"),
          { yPercent: -30 },
          { yPercent: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: footer },
  );

  const mailto = profile.email ? mailtoHref(profile.email, contact.subject, contact.body) : null;
  const linkedIn = profile.links.find((link) => link.label === "LinkedIn");

  const toTop = (event: MouseEvent<HTMLAnchorElement>) => {
    if (scrollToTarget(0)) event.preventDefault();
  };

  return (
    <footer ref={footer} id="contact" aria-labelledby="contact-title" className="relative z-0 -mt-16 overflow-hidden bg-ink-2 md:-mt-24">
      <div data-footer-inner className="px-4 pb-8 pt-44 md:px-8 md:pt-56">
        <p className="label mb-6 text-muted">({number}) Contact</p>
        <DriftTitle id="contact-title" lines={["Let's", "build"]} accentLine={1} className="display text-[26vw] md:text-[17vw]" />

        <div className="mt-16 grid items-end gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="statement max-w-xl text-3xl italic text-paper/90 md:text-4xl">{profile.availability}</p>
            {profile.email && mailto && (
              <>
                <a href={mailto} className="mt-10 inline-block text-2xl font-medium tracking-tight md:text-4xl">
                  <RollText text={profile.email} />
                </a>
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted">
                  <CopyEmail email={profile.email} className="text-paper" />
                  {linkedIn && (
                    <a href={linkedIn.href} target="_blank" rel="noopener noreferrer" className="label flex items-center gap-1.5 py-2">
                      <RollText text={contact.hiringLabel} /> <span aria-hidden="true">↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex md:col-span-5 md:justify-end">
            {mailto && (
              <div className="relative grid size-64 place-items-center md:size-72">
                <CircleText text={RING} />
                <Magnetic strength={0.4}>
                  {/* The big button already reacts to the pointer, so the cursor ring hides instead of covering its label. */}
                  <a
                    href={mailto}
                    data-cursor="hide"
                    aria-label={`${contact.ctaLabel}: email ${profile.email}`}
                    className="label flex size-40 items-center justify-center rounded-full bg-accent text-center text-ink transition-[background-color,scale] duration-500 ease-[var(--ease-expo)] hover:scale-110 hover:bg-paper md:size-44"
                  >
                    {contact.ctaLabel}
                    <span aria-hidden="true" className="ml-1">↗</span>
                  </a>
                </Magnetic>
              </div>
            )}
          </div>
        </div>

        <div className="mt-24 flex flex-col gap-6 border-t border-line pt-6 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-6">
            {profile.links.map((link) => (
              <li key={link.href}>
                <Magnetic>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="label flex items-center gap-1.5 py-2">
                    <RollText text={link.label} /> <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </Magnetic>
              </li>
            ))}
          </ul>
          <LocalTime className="label text-muted" />
          <div className="label flex items-center gap-6 text-muted">
            <span>© 2026 {profile.name}</span>
            <Magnetic>
              <a href="#top" onClick={toTop} className="flex items-center gap-1.5 py-2 text-paper">
                <RollText text="Back to top" /> <span aria-hidden="true">↑</span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </footer>
  );
}
