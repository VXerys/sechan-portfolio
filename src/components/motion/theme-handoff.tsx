"use client";

import { blendThemes, isThemeName, TOKENS, type ThemeName } from "@/lib/themes";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";

// Blends the palette while a chapter's top travels from 85% to 35% of the viewport; 0.7 is where it crosses the middle.
const WINDOW = { start: "top 85%", end: "top 35%" };
const MIDDLE = 0.7;
// Phones and reduced motion switch at the middle instead of blending: cheaper, and no long low-contrast stretch.
const BLEND = "(prefers-reduced-motion: no-preference) and (min-width: 768px)";

// Chapters are read in document order, so a nested sub-chapter hands over from whatever was showing before it.
export function ThemeHandoff() {
  useGSAP(() => {
    const root = document.documentElement;
    const chapters = gsap.utils
      .toArray<HTMLElement>("[data-theme]")
      .map((el) => ({ el, theme: el.dataset.theme }))
      .filter((chapter): chapter is { el: HTMLElement; theme: ThemeName } => isThemeName(chapter.theme));
    if (chapters.length === 0) return;

    const blend = window.matchMedia(BLEND);
    const edges = chapters.slice(1).map(({ el }) => ScrollTrigger.create({ trigger: el, ...WINDOW }));
    let applied = "";

    // Progress is read from each edge's range and the live scroll position, not edge.progress: the tracker can update
    // before the edges in the same frame, and after a long jump that left the palette one chapter behind.
    const progressOf = (edge: ScrollTrigger, scroll: number) =>
      edge.end > edge.start ? Math.min(1, Math.max(0, (scroll - edge.start) / (edge.end - edge.start))) : scroll >= edge.start ? 1 : 0;

    const update = () => {
      const scroll = window.scrollY;
      let index = 0;
      edges.forEach((edge, i) => {
        if (progressOf(edge, scroll) > 0) index = i + 1;
      });
      const to = chapters[index].theme;
      const from = index > 0 ? chapters[index - 1].theme : to;
      const raw = index > 0 ? progressOf(edges[index - 1], scroll) : 1;
      const progress = blend.matches ? raw : raw >= MIDDLE ? 1 : 0;
      const key = `${from}:${to}:${progress.toFixed(3)}`;
      if (key === applied) return;
      applied = key;
      const palette = blendThemes(from, to, progress);
      for (const token of TOKENS) root.style.setProperty(`--color-${token}`, palette[token]);
      // The cursor follows the theme that has taken over the screen.
      root.dataset.activeTheme = progress >= 0.5 ? to : from;
    };

    root.classList.add("theme-live");
    const tracker = ScrollTrigger.create({ start: 0, end: "max", onUpdate: update, onRefresh: update });
    blend.addEventListener("change", update);
    update();

    return () => {
      blend.removeEventListener("change", update);
      tracker.kill();
      edges.forEach((edge) => edge.kill());
      root.classList.remove("theme-live");
      for (const token of TOKENS) root.style.removeProperty(`--color-${token}`);
      delete root.dataset.activeTheme;
    };
  });

  return null;
}
