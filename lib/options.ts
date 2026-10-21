import type {
  ActivityLevel,
  Gender,
  MainGoal,
  StartTimeline,
  WorkoutPreference,
  YesNo,
} from "@/types/form";

export interface Option<T extends string> {
  value: T;
  label: string;
  description?: string;
}

export const GENDER_OPTIONS: Option<Gender>[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
  { value: "other", label: "Other" },
];

export const GOAL_OPTIONS: Option<MainGoal>[] = [
  { value: "fat-loss", label: "Fat Loss", description: "Lose fat, feel lighter, move better." },
  { value: "weight-gain", label: "Weight Gain", description: "Build healthy mass and appetite." },
  { value: "muscle-building", label: "Muscle Building", description: "Get stronger and add size." },
  { value: "body-toning", label: "Body Toning", description: "Lean out and define your shape." },
  { value: "general-fitness", label: "General Fitness", description: "More energy, better habits." },
  { value: "other", label: "Other", description: "Something more specific." },
];

export const ACTIVITY_OPTIONS: Option<ActivityLevel>[] = [
  { value: "beginner", label: "Beginner", description: "New to training, or returning after a long break." },
  { value: "intermediate", label: "Intermediate", description: "Training on and off, comfortable with the basics." },
  { value: "advanced", label: "Advanced", description: "Training consistently for a year or more." },
];

export const WORKOUT_OPTIONS: Option<WorkoutPreference>[] = [
  { value: "gym", label: "Gym", description: "Full equipment access." },
  { value: "home", label: "Home", description: "Minimal equipment, your space." },
];

export const YES_NO_OPTIONS: Option<YesNo>[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const TIMELINE_OPTIONS: Option<StartTimeline>[] = [
  { value: "immediately", label: "Immediately", description: "I'm ready now." },
  { value: "within-1-week", label: "Within 1 Week", description: "Getting things in place." },
  { value: "within-1-month", label: "Within 1 Month", description: "Planning ahead." },
];

export function labelFor<T extends string>(options: Option<T>[], value: T | "" | undefined): string {
  return options.find((o) => o.value === value)?.label ?? "—";
}
