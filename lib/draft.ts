import { EMPTY_FORM } from "@/lib/validation";
import { safeStorage } from "@/lib/utils";
import type { FormValues } from "@/types/form";

const DRAFT_KEY = "fabil:onboarding-draft:v1";

export interface Draft {
  values: FormValues;
  step: number;
  maxReached: number;
}

function isEmpty(values: FormValues) {
  return (Object.keys(EMPTY_FORM) as (keyof FormValues)[]).every((k) => !values[k]);
}

export function loadDraft(): Draft | null {
  const raw = safeStorage.get(DRAFT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<Draft>;
    if (!parsed || typeof parsed !== "object" || !parsed.values) return null;
    // Merge onto the empty shape so unknown/missing keys can't break the form.
    const values = { ...EMPTY_FORM };
    for (const key of Object.keys(EMPTY_FORM) as (keyof FormValues)[]) {
      const v = (parsed.values as unknown as Record<string, unknown>)[key];
      if (typeof v === "string") (values as Record<string, string>)[key] = v;
    }
    if (isEmpty(values)) return null;
    return {
      values,
      step: typeof parsed.step === "number" ? parsed.step : 0,
      maxReached: typeof parsed.maxReached === "number" ? parsed.maxReached : 0,
    };
  } catch {
    return null;
  }
}

export function saveDraft(draft: Draft) {
  if (isEmpty(draft.values)) {
    safeStorage.remove(DRAFT_KEY);
    return;
  }
  safeStorage.set(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft() {
  safeStorage.remove(DRAFT_KEY);
}
