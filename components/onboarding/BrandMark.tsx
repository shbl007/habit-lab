import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  label,
  labelClassName,
}: {
  className?: string;
  label?: string;
  labelClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="inline-flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-ink">
        <span aria-hidden className="relative inline-flex size-5 items-center justify-center">
          <span className="absolute inset-[2.5px] rotate-45 rounded-[4px] bg-ink" />
          <span className="relative size-1 rounded-full bg-surface" />
        </span>
        Fabil
      </span>
      {label && (
        <span className={cn("inline-flex items-center gap-2.5", labelClassName)}>
          <span aria-hidden className="h-3.5 w-px bg-line-strong" />
          <span className="text-[13px] text-muted">{label}</span>
        </span>
      )}
    </span>
  );
}
