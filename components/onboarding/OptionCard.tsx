"use client";

import { m } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { Ref } from "react";
import { cn } from "@/lib/utils";

export type OptionCardSize = "sm" | "md" | "lg";

export interface OptionCardProps {
  name: string;
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  checked: boolean;
  disabled?: boolean;
  /** Group has a validation error — tint unselected borders. */
  invalid?: boolean;
  size?: OptionCardSize;
  describedBy?: string;
  inputRef?: Ref<HTMLInputElement>;
  onSelect: (value: string) => void;
  onBlur?: () => void;
}

/** Radio indicator: ring + dot, so selection never relies on colour alone. */
function RadioDot({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-[18px] shrink-0 items-center justify-center rounded-full border bg-surface transition-[border-color,border-width] duration-150",
        checked ? "border-[5px] border-ink" : "border-line-strong",
      )}
    />
  );
}

/**
 * Accessible custom radio: a real (visually hidden) radio input handles
 * keyboard (arrow keys / Space), form semantics and screen readers; the card
 * is the visual layer.
 *  - sm: compact row (Yes/No, gender)
 *  - md: row with icon + description (activity, timeline)
 *  - lg: tile with icon on top (goals, workout format)
 */
export function OptionCard({
  name,
  value,
  label,
  description,
  icon: Icon,
  checked,
  disabled = false,
  invalid = false,
  size = "md",
  describedBy,
  inputRef,
  onSelect,
  onBlur,
}: OptionCardProps) {
  return (
    <label className={cn("group/card relative block", disabled ? "cursor-not-allowed" : "cursor-pointer")}>
      <input
        ref={inputRef}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onSelect(value)}
        onBlur={onBlur}
        aria-describedby={describedBy}
        className="peer sr-only"
      />
      <m.div
        animate={{ scale: checked ? [0.985, 1] : 1 }}
        whileTap={disabled ? undefined : { scale: 0.99 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative flex h-full rounded-xl border transition-[border-color,background-color,box-shadow] duration-150 ease-out",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink",
          checked
            ? "border-ink bg-soft shadow-[0_0_0_1px_var(--color-ink)]"
            : invalid
              ? "border-danger/50 bg-surface shadow-control"
              : "border-line bg-surface shadow-control",
          !checked && !disabled && "group-hover/card:border-line-strong group-hover/card:bg-soft/60",
          disabled && "opacity-50",
          size === "sm" && "min-h-11 items-center gap-3 px-3.5 py-2.5",
          size === "md" && "min-h-16 items-center gap-3.5 px-3.5 py-3 sm:px-4",
          size === "lg" && "min-h-32 flex-col justify-between gap-4 p-4",
        )}
      >
        {size === "sm" && <RadioDot checked={checked} />}

        {Icon && size !== "sm" && (
          <span
            aria-hidden
            className={cn(
              "inline-flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors duration-150",
              checked ? "border-ink bg-ink text-white" : "border-line bg-soft text-ink",
            )}
          >
            <Icon className="size-[17px]" strokeWidth={1.75} />
          </span>
        )}

        <span className={cn("flex min-w-0 flex-1 flex-col", size === "md" && "pr-1")}>
          <span className={cn("leading-snug text-ink", size === "sm" ? "text-[15px]" : "text-[15px] font-medium")}>{label}</span>
          {description && <span className="mt-0.5 text-[13px] leading-snug text-muted">{description}</span>}
        </span>

        {size === "md" && <RadioDot checked={checked} />}
        {size === "lg" && (
          <span className="absolute right-4 top-4">
            <RadioDot checked={checked} />
          </span>
        )}
      </m.div>
    </label>
  );
}
