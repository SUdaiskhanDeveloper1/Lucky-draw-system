import { cn } from "@/lib/utils";

type Status = string;

const map: Record<string, string> = {
  active: "bg-success/15 text-success",
  approved: "bg-success/15 text-success",
  won: "bg-success/15 text-success",
  rewarded: "bg-success/15 text-success",
  pending: "bg-warning/15 text-warning",
  open: "bg-warning/15 text-warning",
  draft: "bg-muted text-muted-foreground",
  rejected: "bg-destructive/15 text-destructive",
  suspended: "bg-destructive/15 text-destructive",
  banned: "bg-destructive/15 text-destructive",
  lost: "bg-muted text-muted-foreground",
  void: "bg-muted text-muted-foreground",
  completed: "bg-primary/15 text-primary",
  cancelled: "bg-muted text-muted-foreground",
};

export function Badge({
  children,
  status,
  className,
}: {
  children?: React.ReactNode;
  status?: Status;
  className?: string;
}) {
  const key = String(status ?? children ?? "").toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        map[key] ?? "bg-secondary text-secondary-foreground",
        className
      )}
    >
      {children ?? status}
    </span>
  );
}
