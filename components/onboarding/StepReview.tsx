"use client";

import { Pencil } from "lucide-react";
import { useWatch } from "react-hook-form";
import { QuestionPanel } from "./QuestionPanel";
import {
  ACTIVITY_OPTIONS,
  GENDER_OPTIONS,
  GOAL_OPTIONS,
  TIMELINE_OPTIONS,
  WORKOUT_OPTIONS,
  YES_NO_OPTIONS,
  labelFor,
} from "@/lib/options";
import { cn } from "@/lib/utils";
import type { FormValues } from "@/types/form";

interface StepReviewProps {
  onEdit: (step: number) => void;
}

interface Row {
  label: string;
  value: string;
  wide?: boolean;
  prose?: boolean;
}

interface Section {
  title: string;
  step: number;
  rows: Row[];
}

function buildSections(v: FormValues): Section[] {
  const withUnit = (value: string, unit: string) => (value ? `${Number(value)} ${unit}` : "—");
  const goal = v.mainGoal === "other" && v.otherGoal.trim() ? `Other — ${v.otherGoal.trim()}` : labelFor(GOAL_OPTIONS, v.mainGoal);

  return [
    {
      title: "Personal information",
      step: 0,
      rows: [
        { label: "Name", value: v.name.trim() || "—", wide: true },
        { label: "Age", value: v.age || "—" },
        { label: "Gender", value: labelFor(GENDER_OPTIONS, v.gender) },
        { label: "Profession", value: v.profession.trim() || "—" },
        { label: "Place", value: v.place.trim() || "—" },
        { label: "Height", value: withUnit(v.height, "cm") },
        { label: "Current weight", value: withUnit(v.currentWeight, "kg") },
        { label: "Goal weight", value: withUnit(v.goalWeight, "kg") },
      ],
    },
    {
      title: "Goal",
      step: 1,
      rows: [{ label: "Main goal", value: goal, wide: true }],
    },
    {
      title: "Health & activity",
      step: 2,
      rows: [
        { label: "Health notes", value: v.healthIssues.trim() || "None mentioned", wide: true, prose: true },
        { label: "Activity", value: labelFor(ACTIVITY_OPTIONS, v.activityLevel) },
        { label: "Workout", value: labelFor(WORKOUT_OPTIONS, v.workoutPreference) },
      ],
    },
    {
      title: "Commitment",
      step: 3,
      rows: [
        { label: "Just an enquiry", value: labelFor(YES_NO_OPTIONS, v.justEnquiry) },
        { label: "Serious about a program", value: labelFor(YES_NO_OPTIONS, v.seriousProgram) },
        { label: "Start date", value: labelFor(TIMELINE_OPTIONS, v.startTimeline), wide: true },
      ],
    },
  ];
}

export function StepReview({ onEdit }: StepReviewProps) {
  const values = useWatch<FormValues>() as FormValues;
  const sections = buildSections(values);

  return (
    <>
      {sections.map((section) => (
        <QuestionPanel key={section.title}>
          <section aria-labelledby={`review-${section.step}`}>
            <div className="flex items-center justify-between gap-4">
              <h2 id={`review-${section.step}`} className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
                {section.title}
              </h2>
              <button
                type="button"
                onClick={() => onEdit(section.step)}
                aria-label={`Edit ${section.title.toLowerCase()}`}
                className="-mr-2 inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-muted transition-colors hover:bg-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <Pencil aria-hidden className="size-3.5" strokeWidth={2} />
                Edit
              </button>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3.5">
              {section.rows.map((row) => (
                <div key={row.label} className={cn("min-w-0", row.wide && "col-span-2")}>
                  <dt className="text-[13px] text-muted">{row.label}</dt>
                  <dd
                    className={cn(
                      "mt-0.5 break-words text-[15px] text-ink",
                      row.prose ? "whitespace-pre-line leading-relaxed" : "font-medium",
                    )}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </QuestionPanel>
      ))}

      <QuestionPanel tone="feature">
        <p className="text-[15px] font-semibold tracking-[-0.01em] text-ink">Ready to start?</p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          By submitting, you&apos;re happy for Fabil&apos;s team to contact you about coaching. Your details are only used
          to plan your program.
        </p>
      </QuestionPanel>
    </>
  );
}
