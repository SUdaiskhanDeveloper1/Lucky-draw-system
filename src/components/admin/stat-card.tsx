import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  sublabel,
  trend,
  accent = "primary",
}: {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  sublabel?: string;
  trend?: { value: string; positive?: boolean };
  accent?: "primary" | "success" | "warning" | "destructive" | "muted";
}) {
  const accentMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/15 text-destructive",
    muted: "bg-muted text-muted-foreground",
  };

  return (
    <div className="card-surface flex items-start justify-between gap-3 p-4">
      <div className="min-w-0">
        <p className="truncate text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
        {(sublabel || trend) && (
          <p className="mt-1 text-xs text-muted-foreground">
            {trend && (
              <span
                className={cn(
                  "font-medium",
                  trend.positive ? "text-success" : "text-destructive"
                )}
              >
                {trend.value}
              </span>
            )}
            {trend && sublabel ? " · " : ""}
            {sublabel}
          </p>
        )}
      </div>
      {Icon && (
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            accentMap[accent]
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      )}
    </div>
  );
}
