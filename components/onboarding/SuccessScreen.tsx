"use client";

import { m, type Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import { ActionButton } from "./ActionButton";
import { OnboardingShell } from "./OnboardingShell";
import { EASE_OUT_EXPO } from "@/lib/utils";

interface SuccessScreenProps {
  firstName: string;
  referenceId: string;
  onDone: () => void;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT_EXPO } },
};

export function SuccessScreen({ firstName, referenceId, onDone }: SuccessScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => headingRef.current?.focus({ preventScroll: true }), 300);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <m.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
      aria-labelledby="success-title"
    >
      <OnboardingShell
        centered
        aside={<span className="text-[12px] tabular-nums text-muted">Ref {referenceId}</span>}
      >
        <m.div
          variants={container}
          initial="hidden"
          animate="show"
          className="rounded-2xl border border-line bg-surface px-5 py-10 text-center shadow-card sm:px-10 sm:py-14"
        >
          <m.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
            className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-ink shadow-[0_0_0_8px_rgb(23_25_31/0.05)]"
          >
            <svg viewBox="0 0 24 24" className="size-7" fill="none" aria-hidden>
              <m.path
                d="M5 12.5l4.5 4.5L19 7.5"
                stroke="#ffffff"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              />
            </svg>
          </m.div>

          {firstName && (
            <m.p variants={rise} className="mt-6 text-[14px] text-muted">
              Thank you, {firstName}
            </m.p>
          )}

          <m.h1
            ref={headingRef}
            id="success-title"
            tabIndex={-1}
            variants={rise}
            className="mt-1 text-[clamp(1.75rem,6vw,2.25rem)] font-semibold tracking-[-0.03em] text-ink outline-none"
          >
            You&apos;re in.
          </m.h1>

          <m.p variants={rise} className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted" role="status">
            Your details have been received. Fabil&apos;s team will review your information and get back to you.
          </m.p>

          <m.p
            variants={rise}
            className="mx-auto mt-8 max-w-sm border-t border-line pt-6 text-[15px] font-medium text-ink"
          >
            Welcome to the start of your transformation.
          </m.p>

          <m.div variants={rise} className="mt-8">
            <ActionButton onClick={onDone} showArrow={false} className="w-full sm:w-64">
              Done
            </ActionButton>
          </m.div>
        </m.div>
      </OnboardingShell>
    </m.main>
  );
}
