"use client";

import { m } from "framer-motion";
import { STEPS, TOTAL_STEPS } from "@/lib/steps";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  /** Index of the active step, or -1 before the form starts. */
  current: number;
  /** Highest step the user has reached; steps up to here can be revisited. */
  maxReached: number;
  onNavigate?: (step: number) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Segmented progress: completed = mid-grey, active = charcoal, upcoming = track.
 * Each segment doubles as a button back to a step the user has already reached.
 */
export function ProgressIndicator({ current, maxReached, onNavigate }: ProgressIndicatorProps) {
  const started = current >= 0;
  const active = STEPS[current];

  return (
    <nav aria-label="Form progress">
      <div className="flex items-baseline justify-between gap-3 text-[13px]">
        <p className="font-medium text-ink" aria-live="polite">
          {started ? (
            <>
              Step {current + 1} <span className="font-normal text-muted">of {TOTAL_STEPS}</span>
            </>
          ) : (
            <>
              {TOTAL_STEPS} steps <span className="font-normal text-muted">· about 3 minutes</span>
            </>
          )}
        </p>
        {active && <p className="truncate text-muted">{active.eyebrow}</p>}
      </div>

      <ol className="mt-2.5 flex gap-1.5">
        {STEPS.map((step, i) => {
          const done = started && i < current;
          const isActive = i === current;
          const reachable = Boolean(onNavigate) && started && i <= maxReached && !isActive;
          const state = done ? "completed" : isActive ? "current" : "upcoming";
          return (
            <li key={step.short} className="flex-1">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onNavigate?.(i)}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Step ${i + 1} of ${TOTAL_STEPS}: ${step.eyebrow} (${state})`}
                className={cn(
                  "group block w-full py-1.5",
                  "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                  reachable ? "cursor-pointer" : "cursor-default",
                )}
              >
                <span aria-hidden className="relative block h-1 overflow-hidden rounded-full bg-track">
                  <m.span
                    className={cn(
                      "absolute inset-0 origin-left rounded-full transition-colors duration-300",
                      isActive ? "bg-ink" : "bg-done",
                      reachable && "group-hover:bg-ink/70",
                    )}
                    initial={false}
                    animate={{ scaleX: done || isActive ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
