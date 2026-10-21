"use client";

import { CalendarClock, CalendarDays, Zap } from "lucide-react";
import { OptionGroup } from "./OptionGroup";
import { QuestionPanel } from "./QuestionPanel";
import { TIMELINE_OPTIONS, YES_NO_OPTIONS } from "@/lib/options";

const TIMELINE_ICONS = { immediately: Zap, "within-1-week": CalendarDays, "within-1-month": CalendarClock };

export function StepCommitment() {
  return (
    <>
      <QuestionPanel>
        <OptionGroup
          name="justEnquiry"
          legend="Just an enquiry?"
          description="Are you only looking for information at this stage?"
          size="sm"
          options={YES_NO_OPTIONS}
          gridClassName="grid-cols-2"
        />
      </QuestionPanel>

      {/* The key question — set on a subtle inset surface */}
      <QuestionPanel tone="feature">
        <OptionGroup
          name="seriousProgram"
          legend="I'm seriously looking for a perfect program"
          legendClassName="text-[17px] font-semibold tracking-[-0.015em]"
          size="sm"
          options={YES_NO_OPTIONS}
          gridClassName="grid-cols-2"
        />
      </QuestionPanel>

      <QuestionPanel>
        <OptionGroup
          name="startTimeline"
          legend="How soon do you want to start?"
          options={TIMELINE_OPTIONS}
          icons={TIMELINE_ICONS}
          gridClassName="grid-cols-1"
        />
      </QuestionPanel>
    </>
  );
}
