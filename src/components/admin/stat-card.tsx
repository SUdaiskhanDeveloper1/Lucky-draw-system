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
    primary: "bg-accent text-accent-foreground",
    success: "bg-success/12 text-success",
    warning: "bg-warning/12 text-warning",
    destructive: "bg-destructive/12 text-destructive",
    muted: "bg-muted text-muted-foreground",
  };

  return (
    <div className="card-surface group flex items-start justify-between gap-3 p-5 transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:shadow-lift">
      <div className="min-w-0">
        <p className="truncate text-[0.8125rem] font-medium text-muted-foreground">
          {label}
        </p>
        <p className="mt-1.5 font-display text-2xl font-extrabold tabular-nums tracking-tight">
          {value}
        </p>
        {(sublabel || trend) && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            {trend && (
              <span
                className={cn(
                  "font-semibold",
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
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 ease-out-expo group-hover:scale-105",
            accentMap[accent]
          )}
        >
          <Icon className="h-[1.15rem] w-[1.15rem]" />
        </span>
      )}
    </div>
  );
}
