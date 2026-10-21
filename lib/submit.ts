import type { MemberFormData, SubmissionResult } from "@/types/form";

/**
 * Mock submission. Swap the body for a real `fetch("/api/...")` call later —
 * the signature is already shaped for it.
 */
export async function submitMemberForm(data: MemberFormData): Promise<SubmissionResult> {
  await new Promise((resolve) => setTimeout(resolve, 1400));

  if (process.env.NODE_ENV !== "production") {
    console.info("[mock submit] MemberFormData", data);
  }

  return {
    ok: true,
    referenceId: `FBL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    receivedAt: new Date().toISOString(),
  };
}
