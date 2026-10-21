"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { AnimatePresence, m, useReducedMotion, type Variants } from "framer-motion";
import { CircleAlert, Cloud } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { FormProvider, useForm, useWatch, type Resolver } from "react-hook-form";
import { FormStep } from "./FormStep";
import { OnboardingShell } from "./OnboardingShell";
import { ProgressIndicator } from "./ProgressIndicator";
import { StepCommitment } from "./StepCommitment";
import { StepGoals } from "./StepGoals";
import { StepLifestyle } from "./StepLifestyle";
import { StepNavigation } from "./StepNavigation";
import { StepPersonalInfo } from "./StepPersonalInfo";
import { StepReview } from "./StepReview";
import { clearDraft, saveDraft, type Draft } from "@/lib/draft";
import { STEPS } from "@/lib/steps";
import { submitMemberForm } from "@/lib/submit";
import { EASE_OUT_EXPO } from "@/lib/utils";
import {
  EMPTY_FORM,
  STEP_FIELDS,
  STEP_SCHEMAS,
  firstInvalidStep,
  isStepValid,
  remainingInStep,
  toMemberFormData,
} from "@/lib/validation";
import type { FormValues, MemberFormData, SubmissionResult } from "@/types/form";

const REVIEW_STEP = 4;
/** Ignore submit attempts this soon after landing on review (guards double-Enter / double-tap). */
const REVIEW_SUBMIT_GUARD_MS = 700;

const stepVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 12 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.32, ease: EASE_OUT_EXPO } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -8, transition: { duration: 0.12, ease: "easeIn" } }),
};

interface OnboardingFormProps {
  initialDraft: Draft | null;
  onExit: () => void;
  onSubmitted: (result: SubmissionResult, data: MemberFormData) => void;
}

function resolveInitialStep(draft: Draft | null): number {
  if (!draft) return 0;
  const invalid = firstInvalidStep(draft.values);
  const furthestValid = invalid === -1 ? REVIEW_STEP : invalid;
  return Math.min(Math.max(0, draft.step), furthestValid);
}

export function OnboardingForm({ initialDraft, onExit, onSubmitted }: OnboardingFormProps) {
  const reduceMotion = useReducedMotion();
  const initialStep = resolveInitialStep(initialDraft);

  const [step, setStep] = useState(initialStep);
  const [maxReached, setMaxReached] = useState(Math.max(initialStep, initialDraft?.maxReached ?? 0));
  const [direction, setDirection] = useState(1);
  const [returnToReview, setReturnToReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const stepRef = useRef(initialStep);
  const reviewArrivedAt = useRef(initialStep === REVIEW_STEP ? Date.now() : 0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Validate only the active step's schema — keeps errors scoped to what's on screen.
  const resolver = useMemo<Resolver<FormValues>>(() => {
    const stepResolvers: Resolver<FormValues>[] = STEP_SCHEMAS.map((schema) =>
      zodResolver(schema as unknown as z.ZodType<FormValues, FormValues>, undefined, { raw: true }),
    );
    return async (values, context, options) => {
      const run = stepResolvers[stepRef.current];
      return run ? run(values, context, options) : { values, errors: {} };
    };
  }, []);

  const methods = useForm<FormValues>({
    defaultValues: initialDraft?.values ?? EMPTY_FORM,
    resolver,
    mode: "onTouched",
    shouldFocusError: true,
  });
  const { control, trigger, getValues, clearErrors, setFocus } = methods;

  const values = useWatch({ control }) as FormValues;
  const canProceed = step === REVIEW_STEP ? firstInvalidStep(values) === -1 : isStepValid(step, values);
  const remaining = step === REVIEW_STEP ? 0 : remainingInStep(step, values);

  /* ---------- draft persistence (survives in-app browser reloads) ---------- */
  useEffect(() => {
    const t = window.setTimeout(() => saveDraft({ values, step, maxReached }), 250);
    return () => window.clearTimeout(t);
  }, [values, step, maxReached]);

  /* ---------- focus management on step change ---------- */
  useEffect(() => {
    const t = window.setTimeout(
      () => {
        const target = STEPS[step]?.autoFocus;
        const finePointer = window.matchMedia("(pointer: fine)").matches;
        if (target && finePointer) {
          setFocus(target);
        } else {
          headingRef.current?.focus({ preventScroll: true });
        }
      },
      reduceMotion ? 30 : 380,
    );
    return () => window.clearTimeout(t);
  }, [step, reduceMotion, setFocus]);

  const goTo = useCallback(
    (next: number) => {
      setDirection(next >= stepRef.current ? 1 : -1);
      stepRef.current = next;
      clearErrors();
      setSubmitError(null);
      setStep(next);
      setMaxReached((m) => Math.max(m, next));
      if (next === REVIEW_STEP) reviewArrivedAt.current = Date.now();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    },
    [clearErrors, reduceMotion],
  );

  const goToAndValidate = useCallback(
    (target: number) => {
      goTo(target);
      window.setTimeout(() => void trigger(STEP_FIELDS[target], { shouldFocus: true }), 450);
    },
    [goTo, trigger],
  );

  const submit = useCallback(async () => {
    if (submitting) return;
    if (Date.now() - reviewArrivedAt.current < REVIEW_SUBMIT_GUARD_MS) return;

    const current = getValues();
    const invalid = firstInvalidStep(current);
    if (invalid !== -1) {
      goToAndValidate(invalid);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = toMemberFormData(current);
      const result = await submitMemberForm(payload);
      clearDraft();
      onSubmitted(result, payload);
    } catch {
      setSubmitError("Something went wrong while sending your details. Please try again.");
      setSubmitting(false);
    }
  }, [submitting, getValues, goToAndValidate, onSubmitted]);

  const advance = useCallback(async () => {
    if (step === REVIEW_STEP) {
      await submit();
      return;
    }
    const valid = await trigger(STEP_FIELDS[step], { shouldFocus: true });
    if (!valid) return;

    if (returnToReview) {
      const invalid = firstInvalidStep(getValues());
      if (invalid === -1) {
        setReturnToReview(false);
        goTo(REVIEW_STEP);
      } else if (invalid !== step) {
        goToAndValidate(invalid);
      }
      return;
    }
    goTo(step + 1);
  }, [step, submit, trigger, returnToReview, getValues, goTo, goToAndValidate]);

  const back = useCallback(() => {
    if (submitting) return;
    if (step === 0) onExit();
    else goTo(step - 1);
  }, [step, submitting, onExit, goTo]);

  const edit = useCallback(
    (target: number) => {
      setReturnToReview(true);
      goTo(target);
    },
    [goTo],
  );

  const navigateFromProgress = useCallback(
    (target: number) => {
      if (target === step || target > maxReached) return;
      if (target > step) {
        // Only jump forward across steps that are already complete.
        const invalid = firstInvalidStep(getValues());
        const limit = invalid === -1 ? REVIEW_STEP : invalid;
        if (target > limit) {
          goToAndValidate(limit);
          return;
        }
      }
      goTo(target);
    },
    [step, maxReached, getValues, goTo, goToAndValidate],
  );

  /* ---------- form events ---------- */
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void advance();
  };

  // Enter moves to the next field; on the last field (or a complete step) it advances.
  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return; // textareas & buttons behave natively
    e.preventDefault();
    if (step === REVIEW_STEP) return;

    if (target.type !== "radio" && !canProceed) {
      const inputs = Array.from(
        formRef.current?.querySelectorAll<HTMLInputElement>(`[data-step="${step}"] input:not([type="radio"])`) ?? [],
      );
      const nextInput = inputs[inputs.indexOf(target) + 1];
      if (nextInput) {
        nextInput.focus();
        return;
      }
    }
    void advance();
  };

  // Warm up the success screen chunk while the user reviews.
  useEffect(() => {
    if (step === REVIEW_STEP) void import("./SuccessScreen");
  }, [step]);

  const meta = STEPS[step] ?? STEPS[0];

  return (
    <FormProvider {...methods}>
      <m.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.35 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      >
        <OnboardingShell
          aside={
            <span className="inline-flex items-center gap-1.5 text-[12px] text-muted">
              <Cloud aria-hidden className="size-3.5" strokeWidth={2} />
              Auto-saved
            </span>
          }
        >
          <form ref={formRef} noValidate onSubmit={onSubmit} onKeyDown={onKeyDown} aria-label="Client onboarding">
            <FormStep
              stepKey={step}
              title={meta.title}
              description={meta.description}
              headingId={`step-${step}-title`}
              headingRef={headingRef}
              progress={<ProgressIndicator current={step} maxReached={maxReached} onNavigate={navigateFromProgress} />}
              footer={
                <>
                  <AnimatePresence>
                    {submitError && (
                      <m.p
                        role="alert"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden px-5 sm:px-8"
                      >
                        <span className="mb-4 flex items-center gap-2 rounded-[10px] border border-danger/25 bg-danger-wash px-3.5 py-3 text-[14px] text-danger">
                          <CircleAlert aria-hidden className="size-4 shrink-0" />
                          {submitError}
                        </span>
                      </m.p>
                    )}
                  </AnimatePresence>
                  <StepNavigation
                    step={step}
                    isReview={step === REVIEW_STEP}
                    canProceed={canProceed}
                    submitting={submitting}
                    returnToReview={returnToReview && step !== REVIEW_STEP}
                    remaining={remaining}
                    onBack={back}
                  />
                </>
              }
            >
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <m.div
                  key={step}
                  data-step={step}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {step === 0 && <StepPersonalInfo />}
                  {step === 1 && <StepGoals />}
                  {step === 2 && <StepLifestyle />}
                  {step === 3 && <StepCommitment />}
                  {step === 4 && <StepReview onEdit={edit} />}
                </m.div>
              </AnimatePresence>
            </FormStep>
          </form>
        </OnboardingShell>
      </m.main>
    </FormProvider>
  );
}
