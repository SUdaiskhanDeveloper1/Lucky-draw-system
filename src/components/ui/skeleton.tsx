import { cn } from "@/lib/utils";

export function Skeleton({
  className,
}: {
  className?: string;
}) {
  return <div className={cn("skeleton", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="card-surface p-5 space-y-3">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
