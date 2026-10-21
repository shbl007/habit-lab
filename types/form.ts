/**
 * The clean, API-ready payload. This is what gets sent to a backend later.
 */
export interface MemberFormData {
  name: string;
  age: number;
  gender: Gender;
  profession: string;
  height: number; // cm
  currentWeight: number; // kg
  goalWeight: number; // kg
  place: string;
  mainGoal: MainGoal;
  otherGoal?: string;
  healthIssues?: string;
  activityLevel: ActivityLevel;
  workoutPreference: WorkoutPreference;
  justEnquiry: boolean;
  seriousProgram: boolean;
  startTimeline: StartTimeline;
}

export type Gender = "male" | "female" | "prefer-not-to-say" | "other";
export type MainGoal =
  | "fat-loss"
  | "weight-gain"
  | "muscle-building"
  | "body-toning"
  | "general-fitness"
  | "other";
export type ActivityLevel = "beginner" | "intermediate" | "advanced";
export type WorkoutPreference = "gym" | "home";
export type StartTimeline = "immediately" | "within-1-week" | "within-1-month";
export type YesNo = "yes" | "no";

/**
 * Raw values held by React Hook Form while the user is filling in the form.
 * Inputs work with strings (an empty string means "not answered yet");
 * they are converted to `MemberFormData` on submission.
 */
export interface FormValues {
  name: string;
  age: string;
  gender: Gender | "";
  profession: string;
  height: string;
  currentWeight: string;
  goalWeight: string;
  place: string;
  mainGoal: MainGoal | "";
  otherGoal: string;
  healthIssues: string;
  activityLevel: ActivityLevel | "";
  workoutPreference: WorkoutPreference | "";
  justEnquiry: YesNo | "";
  seriousProgram: YesNo | "";
  startTimeline: StartTimeline | "";
}

export type FieldName = keyof FormValues;

/** 0–3 are input steps, 4 is the review step. */
export type StepIndex = 0 | 1 | 2 | 3 | 4;

export interface SubmissionResult {
  ok: true;
  referenceId: string;
  receivedAt: string;
}
