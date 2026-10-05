import { cn } from "@/lib/utils";

/** Editorial form field: small-caps label, hairline input, inline error. */
export function Field({
  id,
  label,
  error,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="eyebrow flex items-baseline justify-between gap-4 text-foreground/75">
        <span>{label}</span>
        {optional && <span className="shrink-0 tracking-[0.12em] text-muted-foreground normal-case">Optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputEditorial =
  "h-12 w-full rounded-[var(--radius)] border border-input bg-background/70 px-4 text-base transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/20 aria-invalid:border-destructive";

export const textareaEditorial =
  "min-h-24 w-full resize-none rounded-[var(--radius)] border border-input bg-background/70 px-4 py-3 text-base transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/20 aria-invalid:border-destructive";

/** Selectable chip / option button. */
export const choiceEditorial =
  "rounded-[var(--radius)] border px-4 py-3 text-left text-sm transition-[border-color,background-color,color] duration-300 hover:border-foreground/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background";
