"use client";

import Image from "next/image";
import { useRef } from "react";

import type { ProjectMedia as Media } from "@/content/media";
import { DESKTOP_MOTION, gsap, MOTION_OK, useGSAP } from "@/lib/motion/gsap";

type Props = { media: Media | undefined; title: string; category: string; year: string; href?: string };

export function ProjectMedia({ media, title, category, year, href }: Props) {
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = frame.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          el,
          { clipPath: "inset(18% 8% 18% 8%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: el, start: "top 95%", end: "top 35%", scrub: true } },
        );
      });
      mm.add(DESKTOP_MOTION, () => {
        gsap.fromTo(
          el.querySelector("[data-parallax]"),
          { yPercent: -6, scale: 1.12 },
          { yPercent: 6, scale: 1.12, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: frame },
  );

  const visual = (
    <div
      ref={frame}
      data-cursor-label={href ? "Open ↗" : undefined}
      className="relative aspect-[4/3] w-full overflow-hidden"
      style={{ background: media?.background ?? "var(--color-ink-2)" }}
    >
      <span className="label absolute right-0 top-0 z-10 bg-paper px-2.5 py-1.5 text-ink">{year}</span>
      {media ? (
        <div data-parallax className="absolute inset-0">
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes="(min-width: 768px) 58vw, 100vw"
            placeholder="blur"
            className={media.fit === "cover" ? "object-cover object-left-top" : "object-contain p-[6%]"}
          />
        </div>
      ) : (
        <div data-parallax className="absolute inset-0 flex flex-col justify-between p-6 md:p-10">
          <span className="label text-muted">{category}</span>
          <span className="display text-[18vw] text-transparent [-webkit-text-stroke:1px_var(--color-line)] md:text-[9vw]" aria-hidden="true">
            {title}
          </span>
          <span className="label text-muted">Visual in preparation</span>
        </div>
      )}
    </div>
  );

  if (!href) return visual;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block" aria-label={`${title} (opens in a new tab)`}>
      {visual}
    </a>
  );
}
