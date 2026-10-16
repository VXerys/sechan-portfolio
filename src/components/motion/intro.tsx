"use client";

import { useRef } from "react";

import { setScrollLocked } from "@/components/motion/smooth-scroll";
import { finishIntro } from "@/lib/motion/intro-state";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";

// Greets whoever opened the link, cycling through who that might be, then introduces Sehan by name.
const GREETING = "HELLO,";
const LOADING_WORDS = ["client", "recruiter", "founder", "friend"];
const FINAL_WORD = "I'm Sehan.";
const CHARS = "abcdefghijklmnopqrstuvwxyz";
// The loading phase always lasts at least this long so the morph reads as intentional, and never longer than the cap.
const MIN_LOADING_MS = 2600;
const MAX_LOADING_MS = 4500;
const SAFETY_MS = 10000;

const delay = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

// Resolves once fonts, images, and the hydration burst have settled, so the curtain moves on a quiet main thread.
function pageSettled() {
  const fonts = document.fonts?.ready.then(() => undefined) ?? Promise.resolve();
  const loaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true }));
  const idle = new Promise<void>((resolve) => {
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(() => resolve(), { timeout: 1200 });
    else setTimeout(resolve, 300);
  });
  return Promise.race([Promise.all([fonts, loaded, idle, delay(MIN_LOADING_MS)]), delay(MAX_LOADING_MS)]);
}

export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = root.current;
    document.documentElement.dataset.intro = "started";
    if (!el || !window.matchMedia(MOTION_OK).matches) {
      finishIntro();
      return;
    }

    window.scrollTo(0, 0);
    setScrollLocked(true);
    // Lag smoothing slows the timeline through long frames instead of skipping ahead; Lenis turns it off after the intro.
    gsap.ticker.lagSmoothing(500, 33);

    let ended = false;
    let cancelled = false;
    const end = () => {
      if (ended) return;
      ended = true;
      gsap.set(el, { display: "none" });
      setScrollLocked(false);
      // Layout settles while the overlay is up (fonts, images), so trigger positions are measured again once it is gone.
      ScrollTrigger.refresh();
    };
    const safety = window.setTimeout(() => {
      finishIntro();
      end();
    }, SAFETY_MS);

    const q = gsap.utils.selector(el);
    const word = q("[data-intro-word]");
    const progress = { value: 0 };
    const renderCount = () => {
      if (counter.current) counter.current.textContent = String(Math.round(progress.value)).padStart(3, "0");
    };

    // Loading phase: the greeting already rose in CSS before hydration; here the word cycles and the counter creeps
    // toward 90 for as long as the page needs.
    const counting = gsap.to(progress, { value: 90, duration: MAX_LOADING_MS / 1000, ease: "power2.out", onUpdate: renderCount });
    const morph = gsap.timeline({ repeat: -1, delay: 0.5 });
    // Starts from the word already on screen, so the first change is visible right away.
    [...LOADING_WORDS.slice(1), LOADING_WORDS[0]].forEach((text) => {
      morph.to(word, { duration: 0.5, ease: "none", scrambleText: { text, chars: CHARS, speed: 0.7 } }).to({}, { duration: 0.25 });
    });

    const finish = () => {
      if (cancelled) return;
      counting.kill();
      morph.kill();
      const tl = gsap.timeline({
        defaults: { ease: "expo.inOut" },
        onComplete: () => {
          window.clearTimeout(safety);
          end();
        },
      });
      tl.to(progress, { value: 100, duration: 0.5, ease: "power2.out", onUpdate: renderCount }, 0)
        .to(word, { duration: 0.7, ease: "none", scrambleText: { text: FINAL_WORD, chars: CHARS, speed: 0.7 } }, 0)
        .addLabel("wipe", 0.8)
        .fromTo(q("[data-curtain]"), { y: 0, yPercent: 130 }, { yPercent: 0, duration: 1.1 }, "wipe")
        .fromTo(q("[data-curtain-lip]"), { scaleY: 1 }, { scaleY: 0, duration: 1.1 }, "wipe")
        .addLabel("lift", "wipe+=0.85")
        .to(q("[data-intro-text]"), { yPercent: -40, autoAlpha: 0, duration: 0.8, ease: "power3.in" }, "lift")
        .to(el, { yPercent: -100, duration: 1.1 }, "lift")
        .fromTo(q("[data-exit-lip]"), { scaleY: 1 }, { scaleY: 0, duration: 1.1 }, "lift")
        .call(finishIntro, [], "lift+=0.35");
    };
    pageSettled().then(finish);

    // Cleanup only releases what this run holds, so a remount (React Strict Mode runs effects twice in development)
    // replays the intro cleanly.
    return () => {
      cancelled = true;
      window.clearTimeout(safety);
      setScrollLocked(false);
    };
  });

  return (
    <div ref={root} className="intro-overlay fixed inset-y-0 left-0 z-[90] w-screen" aria-hidden="true">
      <div className="absolute inset-0 bg-paper" />
      <div data-curtain className="absolute inset-0 bg-accent will-change-transform" style={{ transform: "translateY(130%)" }}>
        <div data-curtain-lip className="absolute -top-[14vh] left-[-15%] h-[28vh] w-[130%] origin-bottom rounded-[50%] bg-accent" />
      </div>
      {/* Hangs fully below the overlay as a half ellipse, so it is off screen until the overlay lifts and it trails as a curve. */}
      <div data-exit-lip className="absolute left-[-15%] top-full h-[14vh] w-[130%] origin-top rounded-b-[50%_100%] bg-accent" />

      <div data-intro-text className="relative z-10 flex h-full flex-col items-center justify-center text-ink">
        {/* The greeting and labels animate in pure CSS, so text is on screen from the first paint, before JavaScript runs. */}
        <p className="display flex overflow-hidden text-[26vw] md:text-[15vw]">
          {GREETING.split("").map((char, index) => (
            <span key={`${char}-${index}`} className="intro-char inline-block" style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
              {char}
            </span>
          ))}
        </p>
        <p className="statement intro-fade mt-[1vw] h-[1.1em] text-[11vw] italic md:text-[4.6vw]" style={{ animationDelay: "0.45s" }}>
          <span data-intro-word>{LOADING_WORDS[0]}</span>
        </p>
        <div className="label intro-fade absolute inset-x-4 bottom-6 flex justify-between md:inset-x-8 md:bottom-8" style={{ animationDelay: "0.6s" }}>
          <span>Portfolio 2026</span>
          <span ref={counter}>000</span>
          <span>Sukabumi, ID</span>
        </div>
      </div>
    </div>
  );
}
