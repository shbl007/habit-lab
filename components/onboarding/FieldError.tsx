"use client";

import { AnimatePresence, m } from "framer-motion";
import { CircleAlert } from "lucide-react";

export function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <div id={id} aria-live="polite">
      <AnimatePresence initial={false}>
        {message && (
          <m.p
            key={message}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <span className="flex items-center gap-1.5 pt-1.5 text-[13px] text-danger">
              <CircleAlert aria-hidden className="size-3.5 shrink-0" strokeWidth={2} />
              {message}
            </span>
          </m.p>
        )}
      </AnimatePresence>
    </div>
  );
}
