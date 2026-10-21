import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface QuestionPanelProps {
  /** Optional quiet label for a related group of fields. */
  kicker?: string;
  /** "feature" gives one key question a subtle inset surface. */
  tone?: "default" | "feature";
  className?: string;
  children: ReactNode;
}

/**
 * A section inside the form card. Sections are separated by a hairline rather
 * than boxed individually, so the form reads as one surface.
 */
export function QuestionPanel({ kicker, tone = "default", className, children }: QuestionPanelProps) {
  return (
    <section
      className={cn(
        "border-t border-line px-5 py-6 first:border-t-0 sm:px-8 sm:py-7",
        tone === "feature" && "bg-soft",
        className,
      )}
    >
      {kicker && <p className="mb-4 text-[13px] font-medium text-muted">{kicker}</p>}
      {children}
    </section>
  );
}
