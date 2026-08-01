import { AlertTriangle, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

// ThemeToggle is a client component; re-export so existing imports from
// "@/components/ui/misc" keep working.
export { ThemeToggle } from "./theme-toggle";

// The components below have no hooks, so they are "shared" components: they
// render on the server when used by Server Components (allowing icon
// components to be passed directly) and on the client when used by Client
// Components. This is why they must NOT be marked "use client".

export function EmptyState({
  title = "Nothing here yet",
  description,
  icon: Icon = Inbox,
  action,
  className,
}: {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center",
        className
      )}
    >
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-card text-muted-foreground shadow-xs ring-1 ring-border">
        <Icon className="h-6 w-6" />
      </span>
      <p className="font-display text-base font-semibold">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again in a moment.",
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-destructive/25 bg-destructive/5 px-6 py-12 text-center",
        className
      )}
    >
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </span>
      <p className="font-display text-base font-semibold">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** Compact page-count window: 1 … 4 [5] 6 … 20 */
function pageWindow(page: number, pageCount: number): (number | "…")[] {
  if (pageCount <= 7)
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);
  if (start > 2) out.push("…");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < pageCount - 1) out.push("…");
  out.push(pageCount);
  return out;
}

export function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-1.5 pt-5"
    >
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="hidden items-center gap-1.5 sm:flex">
        {pageWindow(page, pageCount).map((p, i) =>
          p === "…" ? (
            <span
              key={`gap-${i}`}
              className="px-1 text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "h-9 min-w-9 rounded-md px-2.5 text-sm font-semibold transition-colors duration-200",
                p === page
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {p}
            </button>
          )
        )}
      </div>

      <span className="px-2 text-sm text-muted-foreground sm:hidden">
        Page {page} of {pageCount}
      </span>

      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Next page"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary",
        className
      )}
    />
  );
}

/** Section title + optional subtitle and trailing action. */
export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-[1.75rem]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** Large page-level header used at the top of public pages. */
export function PageHeader({
  title,
  subtitle,
  eyebrow,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <span className="chip-brand mb-4">{eyebrow}</span>
        )}
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-[2.5rem] sm:leading-[1.1]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
