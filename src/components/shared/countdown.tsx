"use client";

import { useEffect, useState } from "react";
import { getCountdown, cn } from "@/lib/utils";

export function Countdown({
  target,
  className,
  compact,
}: {
  target: string | null |undefined;
  className?: string;
  compact?: boolean;
}) {
  const [c, setC] = useState<ReturnType<typeof getCountdown> | null>(null);

  useEffect(() => {
    const update = () => setC(getCountdown(target));

    update(); // initial calculation after mount

    const id = setInterval(update, 1000);

    return () => clearInterval(id);
  }, [target]);

  if (!c) return null;

  if (c.ended) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive ring-1 ring-inset ring-destructive/20",
          className
        )}
      >
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
        Ended
      </span>
    );
  }

  // Inline variant used inside dense cards and list rows.
  if (compact) {
    const parts = c.days > 0
      ? [
          [c.days, "d"],
          [c.hours, "h"],
          [c.minutes, "m"],
        ]
      : [
          [c.hours, "h"],
          [c.minutes, "m"],
          [c.seconds, "s"],
        ];

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-xs font-semibold tabular-nums text-destructive",
          className
        )}
      >
        {parts.map(([value, label], i) => (
          <span key={label as string} className="inline-flex items-center gap-1">
            {i > 0 && <span className="text-destructive/40">:</span>}
            <span>
              {String(value).padStart(2, "0")}
              <span className="text-[0.65rem] font-medium">{label}</span>
            </span>
          </span>
        ))}
      </span>
    );
  }

  const unit = (v: number, label: string) => (
    <div className="flex flex-col items-center gap-1.5">
      <span className="flex h-12 w-full min-w-[3rem] items-center justify-center rounded-xl border border-border/70 bg-card px-2 font-display text-xl font-bold tabular-nums tracking-tight shadow-xs">
        {String(v).padStart(2, "0")}
      </span>
      <span className="text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
    </div>
  );

  return (
    <div
      className={cn("flex items-start gap-2", className)}
      role="timer"
      aria-label="Time remaining"
    >
      {unit(c.days, "days")}
      {unit(c.hours, "hrs")}
      {unit(c.minutes, "min")}
      {unit(c.seconds, "sec")}
    </div>
  );
}
