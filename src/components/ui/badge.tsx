import { cn } from "@/lib/utils";

type Status = string;

/** Tone per known status: tinted surface + readable text + matching hairline. */
const map: Record<string, string> = {
  active: "bg-success/12 text-success ring-success/20",
  approved: "bg-success/12 text-success ring-success/20",
  won: "bg-success/12 text-success ring-success/20",
  rewarded: "bg-success/12 text-success ring-success/20",
  pending: "bg-warning/14 text-warning ring-warning/25",
  open: "bg-warning/14 text-warning ring-warning/25",
  draft: "bg-muted text-muted-foreground ring-border",
  rejected: "bg-destructive/12 text-destructive ring-destructive/20",
  suspended: "bg-destructive/12 text-destructive ring-destructive/20",
  banned: "bg-destructive/12 text-destructive ring-destructive/20",
  lost: "bg-muted text-muted-foreground ring-border",
  void: "bg-muted text-muted-foreground ring-border",
  completed: "bg-info/12 text-info ring-info/20",
  cancelled: "bg-muted text-muted-foreground ring-border",
};

export function Badge({
  children,
  status,
  className,
  dot = true,
}: {
  children?: React.ReactNode;
  status?: Status;
  className?: string;
  dot?: boolean;
}) {
  const key = String(status ?? children ?? "").toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize leading-none ring-1 ring-inset",
        map[key] ?? "bg-secondary text-secondary-foreground ring-border",
        className
      )}
    >
      {dot && (
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-current opacity-75"
        />
      )}
      {children ?? status}
    </span>
  );
}
