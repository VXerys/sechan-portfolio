"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { gsap, MOTION_OK, ScrollTrigger } from "@/lib/motion/gsap";

let instance: Lenis | null = null;

export function scrollToTarget(target: string | HTMLElement | number) {
  if (instance) {
    instance.scrollTo(target, { duration: 1.4 });
    return true;
  }
  return false;
}

export function SmoothScroll() {
  useEffect(() => {
    // Under reduced motion the browser's native scroll is the final state; Lenis never starts.
    if (!window.matchMedia(MOTION_OK).matches) return;

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    instance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Webfonts change line heights after first paint, which shifts every trigger position.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
