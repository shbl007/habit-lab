"use client";

import { m } from "framer-motion";
import type { ReactNode, Ref } from "react";

interface FormStepProps {
  /** Changes on every step so the heading re-animates. */
  stepKey: string | number;
  title: string;
  description?: string;
  headingId: string;
  headingRef?: Ref<HTMLHeadingElement>;
  /** Progress indicator rendered between the heading and the card. */
  progress?: ReactNode;
  /** Card body (the step's fields). */
  children: ReactNode;
  /** Card footer (actions). */
  footer?: ReactNode;
}

/**
 * Step frame: heading + description + progress on the canvas, then a single
 * white form card holding the fields and the actions.
 */
export function FormStep({ stepKey, title, description, headingId, headingRef, progress, children, footer }: FormStepProps) {
  return (
    <section aria-labelledby={headingId}>
      <m.header
        key={stepKey}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="px-0.5"
      >
        <h1
          id={headingId}
          ref={headingRef}
          tabIndex={-1}
          className="text-[clamp(1.5rem,5vw,1.875rem)] font-semibold leading-tight tracking-[-0.025em] text-ink outline-none"
        >
          {title}
        </h1>
        {description && <p className="mt-2 max-w-[34rem] text-[15px] leading-relaxed text-muted">{description}</p>}
      </m.header>

      {progress && <div className="mt-6 px-0.5">{progress}</div>}

      <div className="mt-5 rounded-2xl border border-line bg-surface shadow-card">
        {children}
        {footer}
      </div>
    </section>
  );
}
