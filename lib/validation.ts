import { z } from "zod";
import type { FieldName, FormValues, MemberFormData } from "@/types/form";

/* ---------- helpers ---------- */

const requiredText = (message: string, max = 80) =>
  z.string().trim().min(1, message).max(max, `Please keep this under ${max} characters.`);

const numberInRange = (opts: { min: number; max: number; message: string; integer?: boolean }) =>
  z
    .string()
    .trim()
    .min(1, opts.message)
    .refine((v) => {
      const n = Number(v);
      if (!Number.isFinite(n)) return false;
      if (opts.integer && !Number.isInteger(n)) return false;
      return n >= opts.min && n <= opts.max;
    }, opts.message);

const choice = <T extends readonly [string, ...string[]]>(values: T, message: string) =>
  z.string().refine((v) => (values as readonly string[]).includes(v), message);

/* ---------- step schemas ---------- */

export const personalSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80, "Please keep your name under 80 characters."),
  age: numberInRange({ min: 13, max: 100, integer: true, message: "Please enter a valid age." }),
  gender: choice(["male", "female", "prefer-not-to-say", "other"], "Please select an option."),
  profession: requiredText("Please tell us what you do."),
  height: numberInRange({ min: 100, max: 250, message: "Please enter a valid height in cm." }),
  currentWeight: numberInRange({ min: 25, max: 350, message: "Please enter a valid weight." }),
  goalWeight: numberInRange({ min: 25, max: 350, message: "Please enter a valid weight." }),
  place: requiredText("Please enter where you're based."),
});

export const goalSchema = z
  .object({
    mainGoal: choice(
      ["fat-loss", "weight-gain", "muscle-building", "body-toning", "general-fitness", "other"],
      "Please select your main goal.",
    ),
    otherGoal: z.string().trim().max(160, "Please keep this under 160 characters."),
  })
  .superRefine((val, ctx) => {
    if (val.mainGoal === "other" && val.otherGoal.length < 2) {
      ctx.addIssue({ code: "custom", path: ["otherGoal"], message: "Please tell us your goal." });
    }
  });

export const lifestyleSchema = z.object({
  healthIssues: z.string().trim().max(1000, "Please keep this under 1000 characters."),
  activityLevel: choice(["beginner", "intermediate", "advanced"], "Please select your activity level."),
  workoutPreference: choice(["gym", "home"], "Please choose where you prefer to train."),
});

export const commitmentSchema = z.object({
  justEnquiry: choice(["yes", "no"], "Please choose Yes or No."),
  seriousProgram: choice(["yes", "no"], "Please choose Yes or No."),
  startTimeline: choice(["immediately", "within-1-week", "within-1-month"], "Please choose when you'd like to start."),
});

/** Schemas indexed by step (0–3). The review step (4) validates all of them. */
export const STEP_SCHEMAS = [personalSchema, goalSchema, lifestyleSchema, commitmentSchema] as const;

export const STEP_FIELDS: FieldName[][] = [
  ["name", "age", "gender", "profession", "height", "currentWeight", "goalWeight", "place"],
  ["mainGoal", "otherGoal"],
  ["healthIssues", "activityLevel", "workoutPreference"],
  ["justEnquiry", "seriousProgram", "startTimeline"],
];

export function isStepValid(step: number, values: FormValues): boolean {
  const schema = STEP_SCHEMAS[step];
  return schema ? schema.safeParse(values).success : true;
}

/** Returns the first step that fails validation, or -1 if everything is valid. */
export function firstInvalidStep(values: FormValues): number {
  return STEP_SCHEMAS.findIndex((schema) => !schema.safeParse(values).success);
}

export const EMPTY_FORM: FormValues = {
  name: "",
  age: "",
  gender: "",
  profession: "",
  height: "",
  currentWeight: "",
  goalWeight: "",
  place: "",
  mainGoal: "",
  otherGoal: "",
  healthIssues: "",
  activityLevel: "",
  workoutPreference: "",
  justEnquiry: "",
  seriousProgram: "",
  startTimeline: "",
};

/** Convert validated raw form values into the API payload. */
export function toMemberFormData(values: FormValues): MemberFormData {
  if (firstInvalidStep(values) !== -1) {
    throw new Error("Cannot convert incomplete form values.");
  }
  const otherGoal = values.otherGoal.trim();
  const healthIssues = values.healthIssues.trim();

  return {
    name: values.name.trim(),
    age: Number(values.age),
    gender: values.gender as MemberFormData["gender"],
    profession: values.profession.trim(),
    height: Number(values.height),
    currentWeight: Number(values.currentWeight),
    goalWeight: Number(values.goalWeight),
    place: values.place.trim(),
    mainGoal: values.mainGoal as MemberFormData["mainGoal"],
    ...(values.mainGoal === "other" && otherGoal ? { otherGoal } : {}),
    ...(healthIssues ? { healthIssues } : {}),
    activityLevel: values.activityLevel as MemberFormData["activityLevel"],
    workoutPreference: values.workoutPreference as MemberFormData["workoutPreference"],
    justEnquiry: values.justEnquiry === "yes",
    seriousProgram: values.seriousProgram === "yes",
    startTimeline: values.startTimeline as MemberFormData["startTimeline"],
  };
}

/** How many distinct fields on a step still fail validation (for helper text only). */
export function remainingInStep(step: number, values: FormValues): number {
  const schema = STEP_SCHEMAS[step];
  if (!schema) return 0;
  const result = schema.safeParse(values);
  if (result.success) return 0;
  return new Set(result.error.issues.map((issue) => String(issue.path[0]))).size;
}
