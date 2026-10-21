import { Lock } from "lucide-react";
import type { ReactNode } from "react";
import { BrandMark } from "./BrandMark";
import { cn } from "@/lib/utils";

interface OnboardingShellProps {
  children: ReactNode;
  /** Optional right-hand item in the top bar (e.g. a reference number). */
  aside?: ReactNode;
  footnote?: ReactNode;
  /** Vertically centre the content (intro / success screens). */
  centered?: boolean;
  className?: string;
}

/**
 * Page frame shared by every screen: discreet brand bar, a centred column
 * for the form, and a quiet footnote.
 */
export function OnboardingShell({ children, aside, footnote, centered = false, className }: OnboardingShellProps) {
  return (
    <div className={cn("flex min-h-dvh flex-col", className)}>
      <div className="mx-auto flex w-full max-w-[680px] items-center justify-between px-4 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-6 sm:pt-8">
        <BrandMark label="Client onboarding" />
        {aside}
      </div>

      <div
        className={cn(
          "mx-auto w-full max-w-[680px] flex-1 px-4 pb-6 pt-8 sm:px-6 sm:pb-10 sm:pt-14",
          centered && "flex flex-col justify-center sm:pb-20",
        )}
      >
        {children}
      </div>

      <p className="mx-auto flex max-w-[680px] items-center justify-center gap-1.5 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center text-[12px] text-muted sm:pb-8">
        {footnote ?? (
          <>
            <Lock aria-hidden className="size-3" strokeWidth={2} />
            Your answers are private and only seen by Fabil&apos;s team.
          </>
        )}
      </p>
    </div>
  );
}
