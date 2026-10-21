"use client";

import { Building2, House, Info, Signal, SignalHigh, SignalLow } from "lucide-react";
import { FormTextarea } from "./FormTextarea";
import { OptionGroup } from "./OptionGroup";
import { QuestionPanel } from "./QuestionPanel";
import { ACTIVITY_OPTIONS, WORKOUT_OPTIONS } from "@/lib/options";

const ACTIVITY_ICONS = { beginner: SignalLow, intermediate: SignalHigh, advanced: Signal };
const WORKOUT_ICONS = { gym: Building2, home: House };

export function StepLifestyle() {
  return (
    <>
      <QuestionPanel>
        <FormTextarea
          name="healthIssues"
          label="Any health issues / medical conditions?"
          description="Please mention any existing medical conditions, injuries, medications, or other health concerns that may be relevant to your training."
          placeholder="e.g. Mild lower-back pain, no medications. Or simply “None”."
          optional
        />
        <p className="mt-3 flex items-start gap-2 text-[13px] leading-relaxed text-muted">
          <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
          Please provide accurate information so your program can be planned responsibly.
        </p>
      </QuestionPanel>

      <QuestionPanel>
        <OptionGroup
          name="activityLevel"
          legend="How active are you currently?"
          options={ACTIVITY_OPTIONS}
          icons={ACTIVITY_ICONS}
          gridClassName="grid-cols-1"
        />
      </QuestionPanel>

      <QuestionPanel>
        <OptionGroup
          name="workoutPreference"
          legend="Where do you prefer to train?"
          size="lg"
          options={WORKOUT_OPTIONS}
          icons={WORKOUT_ICONS}
          gridClassName="grid-cols-2"
        />
      </QuestionPanel>
    </>
  );
}
