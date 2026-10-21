"use client";

import { AnimatePresence, m } from "framer-motion";
import { Activity, Dumbbell, Flame, PenLine, Sparkles, TrendingUp } from "lucide-react";
import { useWatch } from "react-hook-form";
import { FormInput } from "./FormInput";
import { OptionGroup } from "./OptionGroup";
import { QuestionPanel } from "./QuestionPanel";
import { GOAL_OPTIONS } from "@/lib/options";
import type { FormValues } from "@/types/form";

const GOAL_ICONS = {
  "fat-loss": Flame,
  "weight-gain": TrendingUp,
  "muscle-building": Dumbbell,
  "body-toning": Sparkles,
  "general-fitness": Activity,
  other: PenLine,
};

export function StepGoals() {
  const mainGoal = useWatch<FormValues, "mainGoal">({ name: "mainGoal" });

  return (
    <QuestionPanel>
      <OptionGroup
        name="mainGoal"
        legend="Main goal"
        description="Choose one."
        size="lg"
        options={GOAL_OPTIONS}
        icons={GOAL_ICONS}
        gridClassName="grid-cols-2 sm:grid-cols-3"
      />

      <AnimatePresence initial={false}>
        {mainGoal === "other" && (
          <m.div
            key="other-goal"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-5">
              <FormInput
                name="otherGoal"
                label="Tell us your goal"
                placeholder="e.g. Run my first half marathon"
                autoCapitalize="sentences"
                enterKeyHint="go"
                autoFocus
              />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </QuestionPanel>
  );
}
