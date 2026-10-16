"use client";

import { useRef } from "react";

import { Reveal } from "@/components/motion/reveal";
import { Scramble } from "@/components/motion/scramble";
import type { Profile } from "@/content/portfolio";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/motion/gsap";

export function About({ profile }: { profile: Profile }) {
  const section = useRef<HTMLElement>(null);
  const statement = useRef<HTMLParagraphElement>(null);
  const glyph = useRef<HTMLSpanElement>(null);
  const [education, roles, ai] = profile.about;

  useGSAP(
    () => {
      const el = statement.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Scrubbed reading pace: each word lights up as the paragraph crosses the viewport.
        const split = SplitText.create(el, { type: "words", aria: "auto" });
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true } },
        );
        gsap.fromTo(
          glyph.current,
          { rotate: -30, scale: 0.85 },
          { rotate: 150, scale: 1.05, ease: "none", scrollTrigger: { trigger: section.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  const facts = [
    { label: "Now", body: roles },
    { label: "Study", body: education },
    { label: "Applied AI", body: ai },
  ];

  return (
    <section ref={section} id="about" aria-labelledby="about-title" className="relative overflow-hidden px-4 py-16 md:px-8 md:py-24">
      <span
        ref={glyph}
        aria-hidden="true"
        className="pointer-events-none absolute -right-[18vw] top-0 select-none font-serif text-[95vw] leading-none text-ink-2 md:-right-[8vw] md:text-[62vw]"
      >
        ✳
      </span>
      <div className="relative grid gap-10 md:grid-cols-12">
        <h2 id="about-title" className="label text-muted md:col-span-3">
          <Scramble text="(01) How I work" />
        </h2>
        <p ref={statement} className="statement text-[2.6rem] md:col-span-9 md:text-[5.2vw]">
          {profile.manifesto.text} <em>{profile.manifesto.accent}</em>
        </p>
      </div>

      <div className="relative mt-20 grid gap-px overflow-hidden border border-line bg-line md:mt-28 md:grid-cols-3">
        {facts.map((fact, index) => (
          <Reveal key={fact.label} mode="clip" delay={index * 0.1} className="group relative bg-ink p-6 transition-colors duration-500 hover:bg-ink-2 md:p-8">
            <h3 className="label flex items-center justify-between text-accent">
              {fact.label}
              <span aria-hidden="true" className="text-muted transition-transform duration-500 ease-[var(--ease-expo)] group-hover:rotate-90">
                +
              </span>
            </h3>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-paper/80">{fact.body}</p>
          </Reveal>
        ))}
      </div>

      <dl className="label relative mt-10 grid gap-4 text-muted sm:grid-cols-2">
        <div>
          <dt className="sr-only">Location</dt>
          <dd>{profile.location}</dd>
        </div>
        <div className="sm:text-right">
          <dt className="sr-only">Availability</dt>
          <dd className="normal-case tracking-normal">{profile.availability}</dd>
        </div>
      </dl>
    </section>
  );
}
