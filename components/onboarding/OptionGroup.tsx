"use client";

import { useId, type ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { LucideIcon } from "lucide-react";
import { FieldError } from "./FieldError";
import { OptionCard, type OptionCardSize } from "./OptionCard";
import { cn } from "@/lib/utils";
import type { Option } from "@/lib/options";
import type { FormValues } from "@/types/form";

export type ChoiceField =
  | "gender"
  | "mainGoal"
  | "activityLevel"
  | "workoutPreference"
  | "justEnquiry"
  | "seriousProgram"
  | "startTimeline";

interface OptionGroupProps {
  name: ChoiceField;
  legend: ReactNode;
  description?: ReactNode;
  options: Option<string>[];
  icons?: Partial<Record<string, LucideIcon>>;
  size?: OptionCardSize;
  /** Tailwind grid classes for the option layout. */
  gridClassName?: string;
  /** "field" = input-style label; "question" = slightly larger question label. */
  variant?: "field" | "question";
  legendClassName?: string;
}

export function OptionGroup({
  name,
  legend,
  description,
  options,
  icons,
  size = "md",
  gridClassName = "grid-cols-1",
  variant = "question",
  legendClassName,
}: OptionGroupProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const descId = `${id}-desc`;
  const { control, trigger } = useFormContext<FormValues>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedIndex = options.findIndex((o) => o.value === field.value);
        // RHF focuses this ref on validation errors; point it at the selected (or first) option.
        const refIndex = selectedIndex === -1 ? 0 : selectedIndex;
        return (
          <fieldset
            aria-describedby={[description ? descId : null, errorId].filter(Boolean).join(" ")}
            aria-invalid={fieldState.error ? true : undefined}
          >
            <legend
              className={cn(
                variant === "field" ? "text-[14px] font-medium leading-snug text-ink" : "text-[15px] font-medium leading-snug text-ink",
                legendClassName,
              )}
            >
              {legend}
            </legend>
            {description && (
              <p id={descId} className="mt-1 text-[13px] leading-relaxed text-muted">
                {description}
              </p>
            )}

            <div className={cn("grid gap-2", variant === "field" ? "mt-1.5" : "mt-3", gridClassName)}>
              {options.map((option, i) => (
                <OptionCard
                  key={option.value}
                  name={name}
                  value={option.value}
                  label={option.label}
                  description={size === "sm" ? undefined : option.description}
                  icon={icons?.[option.value]}
                  size={size}
                  checked={field.value === option.value}
                  invalid={Boolean(fieldState.error)}
                  inputRef={i === refIndex ? field.ref : undefined}
                  onBlur={field.onBlur}
                  onSelect={(value) => {
                    field.onChange(value);
                    if (fieldState.error) void trigger(name);
                  }}
                />
              ))}
            </div>
            <FieldError id={errorId} message={fieldState.error?.message} />
          </fieldset>
        );
      }}
    />
  );
}
