"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ActionButton } from "./ActionButton";

interface StepNavigationProps {
  step: number;
  isReview: boolean;
  canProceed: boolean;
  submitting: boolean;
  returnToReview: boolean;
  /** Required answers still missing on this step (for the helper text). */
  remaining?: number;
  onBack: () => void;
}

/**
 * Card footer: a full-width primary action with Back and a quiet status line
 * beneath. Sticks to the bottom of the viewport while a long step scrolls.
 * The primary button is the form's submit button, so the form's `onSubmit`
 * decides whether that means "next step" or "send".
 */
export function StepNavigation({
  step,
  isReview,
  canProceed,
  submitting,
  returnToReview,
  remaining = 0,
  onBack,
}: StepNavigationProps) {
  const label = isReview
    ? submitting
      ? "Sending…"
      : "Submit my details"
    : returnToReview
      ? "Save & review"
      : step === 3
        ? "Review answers"
        : "Continue";

  const status = isReview
    ? "You can still edit any section."
    : canProceed
      ? "All required answers complete"
      : `${remaining} required ${remaining === 1 ? "answer" : "answers"} left`;

  return (
    <div className="sticky bottom-0 z-10 rounded-b-2xl border-t border-line bg-surface/95 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur supports-[backdrop-filter]:bg-surface/85 sm:px-8 sm:pb-6 sm:pt-5">
      <ActionButton type="submit" softDisabled={!canProceed && !isReview} loading={submitting} className="w-full">
        {label}
      </ActionButton>

      <div className="mt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          aria-label={step === 0 ? "Back to introduction" : "Previous step"}
          className="group -ml-2 inline-flex h-10 items-center gap-1.5 rounded-lg px-2 text-[14px] font-medium text-muted transition-colors hover:bg-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-40"
        >
          <ArrowLeft aria-hidden className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={2} />
          Back
        </button>

        <div className="min-w-0 text-right" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <m.p
              key={status}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="truncate text-[13px] text-muted"
            >
              {status}
            </m.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
