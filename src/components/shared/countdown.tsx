"use client";

import { useEffect, useState } from "react";
import { getCountdown } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Countdown({
  target,
  className,
  compact,
}: {
  target: string | null | undefined;
  className?: string;
  compact?: boolean;
}) {
  const [c, setC] = useState(() => getCountdown(target));

  useEffect(() => {
    const id = setInterval(() => setC(getCountdown(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (c.ended) {
    return (
      <span className={cn("text-sm font-medium text-destructive", className)}>
        Ended
      </span>
    );
  }

  const unit = (v: number, label: string) => (
    <div className="flex flex-col items-center">
      <span className="tabular-nums font-bold">
        {String(v).padStart(2, "0")}
      </span>
      {!compact && (
        <span className="text-[10px] uppercase text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      {unit(c.days, "days")}
      <span className="opacity-40">:</span>
      {unit(c.hours, "hrs")}
      <span className="opacity-40">:</span>
      {unit(c.minutes, "min")}
      <span className="opacity-40">:</span>
      {unit(c.seconds, "sec")}
    </div>
  );
}
