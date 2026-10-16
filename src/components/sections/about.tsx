"use client";

import { useRef } from "react";

import { Reveal } from "@/components/motion/reveal";
import type { Profile } from "@/content/portfolio";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/motion/gsap";

export function About({ profile }: { profile: Profile }) {
  const statement = useRef<HTMLParagraphElement>(null);
  const [education, roles, ai, approach] = profile.about;

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
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: statement },
  );

  const facts = [
    { label: "Now", body: roles },
    { label: "Study", body: education },
    { label: "Applied AI", body: ai },
  ];

  return (
    <section id="about" aria-labelledby="about-title" className="px-4 py-28 md:px-8 md:py-40">
      <div className="grid gap-10 md:grid-cols-12">
        <h2 id="about-title" className="label text-muted md:col-span-3">
          (01) About
        </h2>
        <p ref={statement} className="text-[2rem] font-medium leading-[1.08] tracking-tight md:col-span-9 md:text-[3.6vw]">
          {approach}
        </p>
      </div>

      <div className="mt-20 grid gap-px overflow-hidden border border-line bg-line md:mt-28 md:grid-cols-3">
        {facts.map((fact, index) => (
          <Reveal key={fact.label} delay={index * 0.08} className="bg-ink p-6 md:p-8">
            <h3 className="label text-accent">{fact.label}</h3>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-paper/80">{fact.body}</p>
          </Reveal>
        ))}
      </div>

      <dl className="label mt-10 grid gap-4 text-muted sm:grid-cols-2">
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
