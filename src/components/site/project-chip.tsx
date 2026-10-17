"use client";

import type { MouseEvent } from "react";

import { jumpTo } from "@/components/motion/slice-transition";

// A window event lets More work open its own row without Experience reaching into that section's state.
export const PROJECT_OPEN = "project:open";

type Props = { slug: string; title: string; context: string | null };

export function ProjectChip({ slug, title, context }: Props) {
  const href = `#${slug}`;

  const open = (event: MouseEvent<HTMLAnchorElement>) => {
    // Sent before the jump so a More work row is already expanding while the slices cover the screen.
    window.dispatchEvent(new CustomEvent(PROJECT_OPEN, { detail: slug }));
    if (jumpTo(href)) event.preventDefault();
  };

  return (
    <a
      href={href}
      onClick={open}
      className="label flex flex-wrap items-baseline gap-x-2 rounded-2xl border border-line px-4 py-2 text-paper/80 transition-colors duration-300 hover:border-accent hover:text-accent sm:rounded-full"
    >
      <span>{title}</span>
      {/* The flex gap only spaces the layout; the space keeps title and context apart in the link's text and name. */}
      {context && (
        <>
          {" "}
          <span className="text-muted">{context}</span>
        </>
      )}
    </a>
  );
}
