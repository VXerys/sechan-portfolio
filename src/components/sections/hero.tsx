"use client";

import Image from "next/image";
import { useRef, type MouseEvent } from "react";

import { scrollToTarget } from "@/components/motion/smooth-scroll";
import type { Profile } from "@/content/portfolio";
import { portraitImage } from "@/content/media";
import { DESKTOP_MOTION, EASE_OUT, gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/motion/gsap";

export function Hero({ profile }: { profile: Profile }) {
  const root = useRef<HTMLElement>(null);
  const [first, ...rest] = profile.name.replace(/^M\s/, "").split(" ");

  useGSAP(
    () => {
      document.documentElement.dataset.intro = "started";
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        gsap.set(q("[data-intro]"), { autoAlpha: 1 });

        const split = SplitText.create(q("[data-name-line]"), { type: "chars", mask: "lines", aria: "none" });
        const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
        tl.from(split.chars, { yPercent: 110, duration: 1.4, stagger: 0.035 }, 0.15)
          .fromTo(q("[data-portrait]"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5 }, 0.35)
          .from(q("[data-portrait] img"), { scale: 1.35, duration: 1.8 }, 0.35)
          .from(q("[data-rise]"), { y: 24, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.8);

        return () => split.revert();
      });

      mm.add(DESKTOP_MOTION, () => {
        const q = gsap.utils.selector(root);
        const scroll = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(q("[data-drift='left']"), { xPercent: -8, ease: "none", scrollTrigger: scroll });
        gsap.to(q("[data-drift='right']"), { xPercent: 6, ease: "none", scrollTrigger: scroll });
        gsap.to(q("[data-portrait] img"), { yPercent: 12, ease: "none", scrollTrigger: scroll });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const toWork = (event: MouseEvent<HTMLAnchorElement>) => {
    if (scrollToTarget("#work")) event.preventDefault();
  };

  return (
    <section id="top" ref={root} className="relative flex min-h-svh flex-col overflow-hidden px-4 pb-8 pt-20 md:px-8 md:pt-24">
      <div className="label flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-muted" data-intro>
        <span data-rise>Portfolio 2026</span>
        <span data-rise className="hidden sm:inline">{profile.role}</span>
        <span data-rise className="flex items-center gap-2 text-paper">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          Open to internships
        </span>
      </div>

      <h1 className="sr-only">
        {profile.name}, {profile.role}
      </h1>

      <div className="relative mt-6 flex flex-1 flex-col justify-center md:mt-4" aria-hidden="true">
        <div className="flex items-end justify-between gap-4">
          <span data-intro data-name-line data-drift="left" className="display block text-[25vw] md:text-[20vw]">
            {first}
          </span>
          <div
            data-intro
            data-portrait
            className="relative mb-[2vw] hidden aspect-[4/5] w-[15vw] shrink-0 overflow-hidden bg-ink-2 md:block"
          >
            <Image
              src={portraitImage.src}
              alt=""
              fill
              priority
              sizes="15vw"
              placeholder="blur"
              className="object-cover grayscale transition-[filter] duration-700 hover:grayscale-0"
            />
          </div>
        </div>
        <span data-intro data-name-line data-drift="right" className="display block text-right text-[25vw] text-accent md:text-[20vw]">
          {rest.join(" ")}
        </span>
      </div>

      <div className="relative mt-4 aspect-[4/5] w-2/3 max-w-xs self-end overflow-hidden bg-ink-2 md:hidden" data-intro data-portrait>
        <Image src={portraitImage.src} alt={portraitImage.alt} fill priority sizes="66vw" placeholder="blur" className="object-cover grayscale" />
      </div>

      <div className="mt-8 grid gap-6 border-t border-line pt-6 md:grid-cols-12 md:gap-8" data-intro>
        <p data-rise className="font-serif text-3xl italic leading-[1.05] md:col-span-5 md:text-[2.6rem]">
          {profile.headline}
        </p>
        <p data-rise className="max-w-md text-[0.95rem] leading-relaxed text-paper/75 md:col-span-4 md:col-start-7">
          {profile.intro}
        </p>
        <div data-rise className="flex items-end gap-6 md:col-span-2 md:col-start-11 md:flex-col md:items-end md:justify-between">
          <a href="#work" onClick={toWork} className="label link-underline">
            Selected work <span aria-hidden="true">↓</span>
          </a>
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="label link-underline text-accent">
              Email me <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
