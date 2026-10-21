import type { FieldName } from "@/types/form";

export interface StepMeta {
  short: string;
  eyebrow: string;
  title: string;
  description: string;
  /** Field to focus on entry (pointer devices only, to avoid popping mobile keyboards). */
  autoFocus?: FieldName;
}

export const STEPS: StepMeta[] = [
  {
    short: "Details",
    eyebrow: "Member Information",
    title: "Let's start with you",
    description: "First, tell us a little about yourself.",
    autoFocus: "name",
  },
  {
    short: "Goal",
    eyebrow: "Your Main Goal",
    title: "What are you working towards?",
    description: "Choose the outcome that matters most to you right now.",
  },
  {
    short: "Lifestyle",
    eyebrow: "Health & Current Activity",
    title: "Where you are right now",
    description: "A quick look at your health and routine, so your plan fits your life.",
  },
  {
    short: "Commitment",
    eyebrow: "Your Commitment",
    title: "How serious are you about this?",
    description: "Be honest. There's no right answer — this simply helps us understand where you're at.",
  },
  {
    short: "Review",
    eyebrow: "Review & Submit",
    title: "Check your details",
    description: "Make sure everything looks right before it goes to Fabil.",
  },
];

export const TOTAL_STEPS = STEPS.length;

export const pad = (n: number) => String(n).padStart(2, "0");
