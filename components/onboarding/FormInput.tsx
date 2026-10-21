"use client";

import { AnimatePresence, m } from "framer-motion";
import { Check } from "lucide-react";
import { useId, type InputHTMLAttributes } from "react";
import { FieldError } from "./FieldError";
import { useValidatedField } from "./useValidatedField";
import { cn } from "@/lib/utils";
import type { FieldName } from "@/types/form";

interface FormInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "id" | "onChange" | "onBlur" | "value" | "defaultValue"> {
  name: FieldName;
  label: string;
  suffix?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
}

export function FormInput({ name, label, suffix, hint, optional, className, type = "text", ...inputProps }: FormInputProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const { error, isConfirmed, registration } = useValidatedField(name);

  return (
    <div className={cn("flex flex-col justify-end", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[14px] font-medium leading-snug text-ink">
          {label}
        </label>
        {optional && <span className="text-[12px] text-muted">Optional</span>}
      </div>

      <div
        className={cn(
          "relative mt-1.5 flex h-11 items-center rounded-[10px] border bg-surface px-3.5 shadow-control",
          "transition-[border-color,box-shadow] duration-150 ease-out",
          error
            ? "border-danger shadow-[0_0_0_3px_rgb(196_55_43/0.10)]"
            : "border-line hover:border-line-strong focus-within:border-ink focus-within:shadow-[0_0_0_3px_rgb(23_25_31/0.08)] focus-within:hover:border-ink",
        )}
      >
        <input
          id={id}
          type={type}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hint ? hintId : null, errorId].filter(Boolean).join(" ")}
          onWheel={type === "number" ? (e) => e.currentTarget.blur() : undefined}
          className="h-full w-full min-w-0 bg-transparent text-[16px] text-ink outline-none placeholder:text-faint sm:text-[15px]"
          {...inputProps}
          {...registration}
        />
        <AnimatePresence initial={false}>
          {isConfirmed && (
            <m.span
              aria-hidden
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              className="ml-2 inline-flex shrink-0 text-positive"
            >
              <Check className="size-4" strokeWidth={2.25} />
            </m.span>
          )}
        </AnimatePresence>
        {suffix && (
          <span aria-hidden className="ml-2 shrink-0 text-[13px] text-muted">
            {suffix}
          </span>
        )}
      </div>

      {hint && !error && (
        <p id={hintId} className="pt-1.5 text-[13px] text-muted">
          {hint}
        </p>
      )}
      <FieldError id={errorId} message={error} />
    </div>
  );
}
