"use client";

import { m, useReducedMotion, type Variants } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { BrandMark } from "./BrandMark";
import { EASE_OUT_EXPO } from "@/lib/utils";

interface SplashScreenProps {
  onComplete: () => void;
}

const HOLD_MS = 1400;
const REDUCED_HOLD_MS = 500;

const overlay: Variants = {
  show: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const stack: Variants = {
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.05 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: "easeIn" } },
};

const word: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
};

/** Brief, quiet intro ("Ready for transformation"). Skippable; shown at most every few hours. */
export function SplashScreen({ onComplete }: SplashScreenProps) {
  const reduce = useReducedMotion();
  const done = useRef(false);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const t = window.setTimeout(finish, reduce ? REDUCED_HOLD_MS : HOLD_MS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [finish, reduce]);

  return (
    <m.div
      variants={overlay}
      initial="show"
      animate="show"
      exit="exit"
      onClick={finish}
      className="fixed inset-0 z-50 flex cursor-pointer select-none flex-col items-center justify-center bg-canvas"
      role="status"
      aria-label="Ready for transformation"
    >
      <div aria-hidden className="canvas-grid absolute inset-0" />

      <m.div variants={stack} initial={reduce ? "show" : "hidden"} animate="show" exit="exit" aria-hidden className="relative flex flex-col items-center px-6">
        <m.span variants={word}>
          <BrandMark />
        </m.span>
        <m.p variants={word} className="mt-6 text-center text-[clamp(1.75rem,6vw,2.75rem)] font-semibold leading-tight tracking-[-0.03em] text-ink">
          Ready for transformation.
        </m.p>
        <m.div variants={word} className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-track">
          <m.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: (reduce ? REDUCED_HOLD_MS : HOLD_MS) / 1000, ease: [0.65, 0, 0.35, 1] }}
            className="h-full origin-left rounded-full bg-ink"
          />
        </m.div>
      </m.div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
        className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] rounded-lg px-3 py-2 text-[13px] text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        Skip
      </button>
    </m.div>
  );
}
