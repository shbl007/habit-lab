"use client";

import { ArrowRight } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  showArrow?: boolean;
  loading?: boolean;
  /** Visually disabled but still clickable, so a click can explain what's missing. */
  softDisabled?: boolean;
}

export function ActionButton({
  children,
  className,
  variant = "primary",
  showArrow = true,
  loading = false,
  softDisabled = false,
  type = "button",
  ...props
}: ActionButtonProps) {
  const quiet = softDisabled || loading;

  return (
    <button
      type={type}
      aria-disabled={quiet || undefined}
      aria-busy={loading || undefined}
      className={cn(
        "group/btn relative inline-flex h-12 select-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-[10px] px-5 text-[15px] font-medium tracking-[-0.01em]",
        "transition-[background-color,color,box-shadow,border-color,transform] duration-150 ease-out active:scale-[0.99]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        variant === "primary" && "bg-ink text-white shadow-button hover:bg-ink-hover",
        variant === "secondary" && "border border-line bg-surface text-ink shadow-control hover:border-line-strong hover:bg-soft",
        variant === "ghost" && "h-10 text-muted hover:bg-soft hover:text-ink",
        softDisabled && !loading && "cursor-not-allowed bg-[#e6e8eb] text-[#8a8f98] shadow-none hover:bg-[#e6e8eb] active:scale-100",
        loading && "cursor-progress",
        className,
      )}
      {...props}
    >
      {loading && (
        <span aria-hidden className="absolute inset-0 overflow-hidden">
          <span className="animate-shimmer absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        </span>
      )}
      <span className="relative">{children}</span>
      {showArrow && (
        <ArrowRight
          aria-hidden
          strokeWidth={2}
          className={cn("relative size-4 transition-transform duration-200 ease-out", !quiet && "group-hover/btn:translate-x-0.5")}
        />
      )}
    </button>
  );
}
