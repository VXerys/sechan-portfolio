"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { whenIntroDone } from "@/lib/motion/intro-state";
import { gsap, MOTION_OK, ScrollTrigger } from "@/lib/motion/gsap";

let instance: Lenis | null = null;
let lockedBeforeStart = false;

// The intro can ask for a lock before Lenis exists, so the request is remembered and applied on start.
export function setScrollLocked(locked: boolean) {
  lockedBeforeStart = locked;
  document.documentElement.style.overflow = locked ? "hidden" : "";
  if (!instance) return;
  if (locked) instance.stop();
  else instance.start();
}

export function scrollToTarget(target: string | HTMLElement | number) {
  if (instance) {
    instance.scrollTo(target, { duration: 1.4 });
    return true;
  }
  return false;
}

// Instant jump, used behind the slice transition so the visitor never watches a long scroll.
export function jumpToTarget(target: string | HTMLElement | number) {
  if (instance) {
    instance.scrollTo(target, { immediate: true, force: true });
    return;
  }
  if (typeof target === "number") window.scrollTo(0, target);
  else (typeof target === "string" ? document.querySelector(target) : target)?.scrollIntoView();
}

export function SmoothScroll() {
  useEffect(() => {
    // Under reduced motion the browser's native scroll is the final state; Lenis never starts.
    if (!window.matchMedia(MOTION_OK).matches) return;

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    instance = lenis;
    if (lockedBeforeStart) lenis.stop();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    // Lenis wants lag smoothing off so scroll and triggers stay in sync, but only after the intro: during it,
    // smoothing keeps the curtain from skipping frames. The intro also refreshes triggers once fonts have settled.
    const stopWaiting = whenIntroDone(() => gsap.ticker.lagSmoothing(0));

    return () => {
      stopWaiting();
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
