"use client";

import { m } from "framer-motion";
import { Clock3, ListChecks, ShieldCheck } from "lucide-react";
import { ActionButton } from "./ActionButton";
import { FormStep } from "./FormStep";
import { OnboardingShell } from "./OnboardingShell";
import { ProgressIndicator } from "./ProgressIndicator";

interface HeroProps {
  /** Hold the entrance until the splash has cleared. */
  play: boolean;
  hasDraft: boolean;
  onStart: () => void;
}

const POINTS = [
  { icon: ListChecks, title: "Five short steps", text: "Your details, your goal, your current lifestyle and your commitment — then a quick review." },
  { icon: Clock3, title: "About 3 minutes", text: "Your answers are kept if the page reloads." },
  { icon: ShieldCheck, title: "Private", text: "Only Fabil's team sees your answers. They're used to plan your program." },
];

/** Welcome screen — the same card layout as the steps, so the flow feels continuous. */
export function Hero({ play, hasDraft, onStart }: HeroProps) {
  return (
    <m.main
      initial={{ opacity: 0, y: 8 }}
      animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <OnboardingShell centered>
        <FormStep
          stepKey="intro"
          headingId="hero-title"
          title="Let's build your transformation."
          description="Tell us a little about yourself, your goals, and where you want to go. This helps Fabil understand what kind of program will work best for you."
          progress={<ProgressIndicator current={-1} maxReached={-1} />}
          footer={
            <div className="rounded-b-2xl border-t border-line px-5 pb-5 pt-4 sm:px-8 sm:pb-7 sm:pt-5">
              <ActionButton onClick={onStart} className="w-full">
                {hasDraft ? "Continue your journey" : "Start your journey"}
              </ActionButton>
              {hasDraft && (
                <p className="mt-3 text-center text-[13px] text-muted">We&apos;ve kept your answers from earlier.</p>
              )}
            </div>
          }
        >
          <ul className="space-y-5 px-5 py-6 sm:px-8 sm:py-7">
            {POINTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3.5">
                <span aria-hidden className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-soft text-ink">
                  <Icon className="size-[17px]" strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block text-[15px] font-medium text-ink">{title}</span>
                  <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </FormStep>
      </OnboardingShell>
    </m.main>
  );
}
