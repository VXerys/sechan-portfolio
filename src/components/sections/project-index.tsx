"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { LineRows } from "@/components/motion/line-rows";
import { ProjectPoster } from "@/components/sections/project-poster";
import { ProjectQuote } from "@/components/sections/project-quote";
import { projectMedia } from "@/content/media";
import type { Project } from "@/content/portfolio";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { quoteForProject, type TestimonialView } from "@/lib/testimonials";

const pad = (n: number) => String(n).padStart(2, "0");

type Props = { projects: Project[]; offset: number; quotes: TestimonialView[] };

export function ProjectIndex({ projects, offset, quotes }: Props) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);

  // Opening a row changes the page height, so every trigger below it is measured again once the panel settles.
  // Skipped on mount: a refresh then would land in the middle of the intro and stall it.
  const toggled = useRef(false);
  useEffect(() => {
    if (!toggled.current) {
      toggled.current = true;
      return;
    }
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 750);
    return () => window.clearTimeout(id);
  }, [openSlug]);

  useGSAP(
    () => {
      const area = list.current;
      const card = preview.current;
      if (!area || !card) return;
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (pointer: fine) and (min-width: 768px)`, () => {
        gsap.set(card, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0, rotate: 0 });
        const x = gsap.quickTo(card, "x", { duration: 0.7, ease: "power3" });
        const y = gsap.quickTo(card, "y", { duration: 0.7, ease: "power3" });
        const tilt = gsap.quickTo(card, "rotate", { duration: 0.9, ease: "power3" });
        let lastX = 0;

        const move = (event: PointerEvent) => {
          x(event.clientX);
          y(event.clientY);
          // Horizontal speed tilts the card, so it swings like something carried rather than glued to the pointer.
          tilt(gsap.utils.clamp(-14, 14, (event.clientX - lastX) * 0.6));
          lastX = event.clientX;
        };
        const enter = (event: PointerEvent) => {
          lastX = event.clientX;
          gsap.set(card, { x: event.clientX, y: event.clientY });
          gsap.to(card, { scale: 1, autoAlpha: 1, duration: 0.6, ease: "expo.out", overwrite: "auto" });
        };
        const leave = () => {
          gsap.to(card, { scale: 0.6, autoAlpha: 0, rotate: 0, duration: 0.4, ease: "power3.in", overwrite: "auto" });
          setActiveSlug(null);
        };

        area.addEventListener("pointermove", move);
        area.addEventListener("pointerenter", enter);
        area.addEventListener("pointerleave", leave);
        return () => {
          area.removeEventListener("pointermove", move);
          area.removeEventListener("pointerenter", enter);
          area.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: list },
  );

  return (
    <div ref={list} data-cursor="hide" className="relative">
      <LineRows as="ul">
        {projects.map((project, index) => {
          const open = openSlug === project.slug;
          const panelId = `${project.slug}-panel`;
          const quote = quoteForProject(quotes, project.slug);
          return (
            <li key={project.slug} data-row className="relative overflow-hidden" onPointerEnter={() => setActiveSlug(project.slug)}>
              <span data-line className="absolute inset-x-0 top-0 h-px bg-line" />
              <div data-row-content>
                <h4>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenSlug(open ? null : project.slug)}
                    className="group grid w-full origin-left grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-6 text-left transition-transform duration-200 active:scale-[0.985] md:grid-cols-[3.5rem_1fr_12rem_4rem_2rem] md:py-8"
                  >
                    <span className="label text-muted transition-colors duration-300 group-hover:text-accent">{pad(offset + index + 1)}</span>
                    <span className="display text-[11vw] transition-[color,translate] duration-500 ease-[var(--ease-expo)] group-hover:translate-x-3 group-hover:text-accent md:text-[4.4vw]">
                      {project.title}
                    </span>
                    <span className="label hidden text-muted md:block">{project.category}</span>
                    <span className="label hidden text-muted md:block">{project.year}</span>
                    <span
                      aria-hidden="true"
                      className={`text-2xl leading-none transition-transform duration-500 ease-[var(--ease-expo)] ${open ? "rotate-45 text-accent" : ""}`}
                    >
                      +
                    </span>
                  </button>
                </h4>
                <div
                  id={panelId}
                  className={`grid transition-[grid-template-rows] duration-700 ease-[var(--ease-expo)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden" inert={!open}>
                    <div className="grid gap-8 pb-10 md:grid-cols-[3.5rem_1fr_1fr] md:gap-10">
                      <div className="hidden md:block" />
                      {/* Touch screens never see the floating preview, so the visual sits inside the open panel. */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden md:hidden" aria-hidden="true">
                        {projectMedia[project.slug] ? (
                          <Image src={projectMedia[project.slug]!.src} alt="" fill sizes="100vw" className="object-cover" />
                        ) : (
                          <ProjectPoster project={project} size="sm" />
                        )}
                      </div>
                      <div>
                        <p className="statement text-[1.7rem]">{project.summary}</p>
                        <p className="mt-4 text-[1.0625rem] leading-relaxed text-paper/75">{project.problem}</p>
                        <p className="label mt-6 text-muted">
                          {project.role} <span aria-hidden="true">·</span> {project.status}
                        </p>
                      </div>
                      <div>
                        <ol className="text-[1.0625rem] leading-relaxed text-paper/80">
                          {project.contribution.map((item, itemIndex) => (
                            <li key={item} className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-line py-3 first:border-t-0 first:pt-0">
                              <span className="label pt-1 text-muted">{pad(itemIndex + 1)}</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ol>
                        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Stack">
                          {project.stack.map((tool) => (
                            <li key={tool} className="label rounded-full border border-line px-3 py-1.5 text-paper/80">
                              {tool}
                            </li>
                          ))}
                        </ul>
                        {quote && <ProjectQuote quote={quote} className="mt-8 border-t border-line pt-6" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </LineRows>
      <span aria-hidden="true" className="block h-px bg-line" />

      {/* Floating preview: every project's visual is stacked, and the hovered one wipes in from below. */}
      <div
        ref={preview}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden aspect-[4/3] w-[22rem] overflow-hidden rounded-sm opacity-0 shadow-2xl shadow-black/60 md:block"
      >
        {projects.map((project) => {
          const media = projectMedia[project.slug];
          const active = activeSlug === project.slug;
          return (
            <div
              key={project.slug}
              className="absolute inset-0 transition-[clip-path] duration-700 ease-[var(--ease-expo)]"
              style={{ clipPath: active ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)", zIndex: active ? 2 : 1 }}
            >
              {media ? (
                <Image src={media.src} alt="" fill sizes="22rem" className="object-cover" style={{ background: media.background }} />
              ) : (
                <ProjectPoster project={project} size="sm" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
