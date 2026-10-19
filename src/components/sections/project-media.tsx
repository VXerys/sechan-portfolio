"use client";

import Image from "next/image";
import { useRef } from "react";

import { ListingStrip } from "@/components/sections/listing-strip";
import { ProjectPoster } from "@/components/sections/project-poster";
import { listingNotice } from "@/content/listing-copy";
import { listings } from "@/content/listings";
import type { Project } from "@/content/portfolio";
import { projectMedia } from "@/content/media";
import { DESKTOP_MOTION, gsap, MOTION_OK, useGSAP } from "@/lib/motion/gsap";

export function ProjectMedia({ project }: { project: Project }) {
  const frame = useRef<HTMLDivElement>(null);
  const media = projectMedia[project.slug];
  const link = project.links[0];
  const listing = listings[project.slug];

  useGSAP(
    () => {
      const el = frame.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // The frame opens from a rounded window to full bleed while it travels up the viewport.
        gsap.fromTo(
          el,
          { clipPath: "inset(22% 14% 22% 14% round 28px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: el, start: "top 98%", end: "top 30%", scrub: true } },
        );
        gsap.from(el.querySelector("[data-year]"), {
          yPercent: -100,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 60%", once: true },
        });
      });
      mm.add(DESKTOP_MOTION, () => {
        const layer = el.querySelector("[data-parallax='image']");
        // Listing covers are composed edge to edge (title, sample-data tag), so they skip the scaled parallax that would crop them.
        if (!layer || listing) return;
        gsap.fromTo(
          layer,
          { yPercent: -7, scale: 1.14 },
          { yPercent: 7, scale: 1.14, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: frame, dependencies: [listing] },
  );

  const visual = (
    <div
      ref={frame}
      data-cursor-label={link ? "Open ↗" : undefined}
      className="group relative aspect-[16/10] w-full overflow-hidden"
      style={{ background: media?.background ?? "var(--color-ink-2)" }}
    >
      <span className="absolute right-0 top-0 z-10 overflow-hidden">
        <span data-year className="label block bg-paper px-2.5 py-1.5 text-ink">
          {project.year}
        </span>
      </span>
      {media ? (
        <div data-parallax="image" className="absolute inset-0">
          <div className={`absolute inset-0 ${listing ? "" : "transition-transform duration-1000 ease-[var(--ease-expo)] group-hover:scale-[1.05]"}`}>
            <Image
              src={media.src}
              alt={media.alt}
              fill
              sizes="(min-width: 768px) 58vw, 100vw"
              placeholder="blur"
              className={media.fit === "cover" ? "object-cover object-left-top" : "object-contain p-[6%]"}
            />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 transition-transform duration-1000 ease-[var(--ease-expo)] group-hover:scale-[1.03]" aria-hidden="true">
          <ProjectPoster project={project} />
        </div>
      )}
    </div>
  );

  const linked = link ? (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className="block" aria-label={`${project.title}: ${link.label} (opens in a new tab)`}>
      {visual}
    </a>
  ) : (
    visual
  );
  if (!listing) return linked;
  return (
    <div>
      {linked}
      <ListingStrip title={project.title} slides={listing.slides} label={listing.label} notice={listingNotice(listing, project.client !== null)} />
    </div>
  );
}
