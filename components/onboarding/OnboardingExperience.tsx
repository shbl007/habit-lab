"use client";

import { AnimatePresence, LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { Background } from "./Background";
import { Hero } from "./Hero";
import { OnboardingForm } from "./OnboardingForm";
import { SplashScreen } from "./SplashScreen";
import { loadDraft, type Draft } from "@/lib/draft";
import type { MemberFormData, SubmissionResult } from "@/types/form";

// Only needed at the very end — keep it out of the initial bundle.
const SuccessScreen = dynamic(() => import("./SuccessScreen").then((mod) => mod.SuccessScreen));

type Phase = "boot" | "intro" | "form" | "success";

const INTRO_SEEN_KEY = "fabil:intro-seen-at";
/** Replay the splash at most once every 6 hours. */
const INTRO_COOLDOWN_MS = 6 * 60 * 60 * 1000;

function shouldPlayIntro(): boolean {
  try {
    const last = Number(window.localStorage.getItem(INTRO_SEEN_KEY));
    window.localStorage.setItem(INTRO_SEEN_KEY, String(Date.now()));
    return !last || Date.now() - last > INTRO_COOLDOWN_MS;
  } catch {
    return true;
  }
}

export function OnboardingExperience() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [showSplash, setShowSplash] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [result, setResult] = useState<{ referenceId: string; firstName: string } | null>(null);

  // Decide client-side (storage isn't available during SSR).
  useEffect(() => {
    setShowSplash(shouldPlayIntro());
    setDraft(loadDraft());
    setPhase("intro");
  }, []);

  useEffect(() => {
    if (phase !== "boot") window.scrollTo({ top: 0 });
  }, [phase]);

  const start = useCallback(() => {
    setDraft(loadDraft());
    setPhase("form");
  }, []);

  const exitToIntro = useCallback(() => {
    setDraft(loadDraft());
    setPhase("intro");
  }, []);

  const handleSubmitted = useCallback((res: SubmissionResult, data: MemberFormData) => {
    setResult({ referenceId: res.referenceId, firstName: data.name.split(/\s+/)[0] ?? "" });
    setDraft(null);
    setPhase("success");
  }, []);

  const done = useCallback(() => {
    setResult(null);
    setDraft(null);
    setPhase("intro");
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Background />

        <AnimatePresence>
          {showSplash && <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {phase === "intro" && <Hero key="intro" play={!showSplash} hasDraft={!!draft} onStart={start} />}
          {phase === "form" && (
            <OnboardingForm key="form" initialDraft={draft} onExit={exitToIntro} onSubmitted={handleSubmitted} />
          )}
          {phase === "success" && result && (
            <SuccessScreen key="success" firstName={result.firstName} referenceId={result.referenceId} onDone={done} />
          )}
        </AnimatePresence>
      </MotionConfig>
    </LazyMotion>
  );
}
