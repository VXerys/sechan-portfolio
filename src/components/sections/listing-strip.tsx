"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";

import type { ListingSlide } from "@/content/listings";

const DRAG_THRESHOLD = 6;

// Native horizontal scroll carries touch, trackpad, and keyboard; the pointer drag only adds a grab for mouse users,
// so the strip works without JavaScript and needs no reduced-motion branch. Lenis would swallow a trackpad swipe
// with any vertical drift, so mostly horizontal gestures are left to the strip while vertical wheel stays smooth.
export function ListingStrip({ title, slides, label, notice }: { title: string; slides: ListingSlide[]; label: string | null; notice: string | null }) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const down = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !track.current) return;
    drag.current = { x: event.clientX, left: track.current.scrollLeft, moved: false };
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    const el = track.current;
    if (!state || !el) return;
    const dx = event.clientX - state.x;
    if (!state.moved && Math.abs(dx) < DRAG_THRESHOLD) return;
    if (!state.moved) {
      state.moved = true;
      el.setPointerCapture(event.pointerId);
      el.dataset.dragging = "true";
    }
    el.scrollLeft = state.left - dx;
  };
  const up = (event: PointerEvent<HTMLDivElement>) => {
    const el = track.current;
    if (el?.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
    if (el) delete el.dataset.dragging;
    drag.current = null;
  };

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="label text-muted">
          Screens <span aria-hidden="true">·</span> {String(slides.length).padStart(2, "0")}
        </p>
        {label && <span className="label rounded-full bg-accent px-2.5 py-1 text-ink">{label}</span>}
      </div>
      <div
        ref={track}
        role="region"
        aria-label={`${title} screens`}
        tabIndex={0}
        data-cursor="hide"
        data-lenis-prevent-horizontal
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:thin] data-[dragging]:cursor-grabbing data-[dragging]:snap-none md:cursor-grab focus-visible:outline-offset-[-2px]"
      >
        {slides.map((slide) => (
          <figure key={slide.alt} className="h-[22rem] shrink-0 snap-start overflow-hidden rounded-sm bg-ink-2 md:h-[26rem]">
            <Image
              src={slide.src}
              alt={slide.alt}
              sizes="(min-width: 768px) 26rem, 80vw"
              draggable={false}
              className="h-full w-auto select-none"
            />
          </figure>
        ))}
      </div>
      {notice && <p className="label mt-3 text-muted">{notice}</p>}
    </div>
  );
}
