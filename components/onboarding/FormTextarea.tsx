"use client";

import { useId, type TextareaHTMLAttributes } from "react";
import { useWatch } from "react-hook-form";
import { FieldError } from "./FieldError";
import { useValidatedField } from "./useValidatedField";
import { cn } from "@/lib/utils";
import type { FieldName, FormValues } from "@/types/form";

interface FormTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "id" | "onChange" | "onBlur" | "value" | "defaultValue"> {
  name: FieldName;
  label: string;
  description?: string;
  optional?: boolean;
  maxChars?: number;
}

export function FormTextarea({ name, label, description, optional, maxChars = 1000, ...props }: FormTextareaProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const descId = `${id}-desc`;
  const { error, registration } = useValidatedField(name);
  const value = useWatch<FormValues>({ name }) as string;
  const count = value?.length ?? 0;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[15px] font-medium leading-snug text-ink">
          {label}
        </label>
        {optional && <span className="shrink-0 text-[12px] text-muted">Optional</span>}
      </div>
      {description && (
        <p id={descId} className="mt-1 text-[13px] leading-relaxed text-muted">
          {description}
        </p>
      )}

      <div
        className={cn(
          "relative mt-3 rounded-[10px] border bg-surface shadow-control transition-[border-color,box-shadow] duration-150",
          error
            ? "border-danger shadow-[0_0_0_3px_rgb(196_55_43/0.10)]"
            : "border-line hover:border-line-strong focus-within:border-ink focus-within:shadow-[0_0_0_3px_rgb(23_25_31/0.08)] focus-within:hover:border-ink",
        )}
      >
        <textarea
          id={id}
          rows={4}
          maxLength={maxChars}
          aria-invalid={error ? true : undefined}
          aria-describedby={[description ? descId : null, errorId].filter(Boolean).join(" ")}
          className="field-sizing-content block max-h-[18rem] min-h-28 w-full resize-none bg-transparent px-3.5 pb-8 pt-3 text-[16px] leading-relaxed text-ink outline-none placeholder:text-faint sm:text-[15px]"
          {...props}
          {...registration}
        />
        <span aria-hidden className="pointer-events-none absolute bottom-2.5 right-3.5 text-[12px] tabular-nums text-faint">
          {count}/{maxChars}
        </span>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}
