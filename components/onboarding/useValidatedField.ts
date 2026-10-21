"use client";

import { useFormContext, useFormState, useWatch } from "react-hook-form";
import type { FieldName, FormValues } from "@/types/form";

/**
 * Registers a field and re-validates it on change once it is showing an
 * error, so messages clear the moment the input becomes valid.
 * `isConfirmed` is true once a touched field has a value and no error
 * (validation runs on blur), which drives the subtle "done" tick.
 */
export function useValidatedField(name: FieldName) {
  const { register, trigger } = useFormContext<FormValues>();
  const { errors, touchedFields } = useFormState<FormValues>({ name });
  const value = useWatch<FormValues>({ name }) as string | undefined;
  const error = errors[name]?.message;
  const registration = register(name);

  return {
    error: typeof error === "string" ? error : undefined,
    isConfirmed: Boolean(touchedFields[name] && !error && value && value.trim() !== ""),
    registration: {
      ...registration,
      onChange: async (event: { target: unknown; type?: unknown }) => {
        await registration.onChange(event);
        if (error) void trigger(name);
      },
    },
  };
}
