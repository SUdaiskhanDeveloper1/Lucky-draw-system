import { Trophy } from "lucide-react";
import type { Winner } from "@/lib/types/database";
import { formatDate, initials } from "@/lib/utils";
import { EmptyState } from "@/components/ui/misc";

export type WinnerWithRelations = Winner & {
  profiles?: { full_name: string | null } | null;
  campaigns?: { prize_name: string | null } | null;
};

export function WinnersSection({
  winners,
}: {
  winners: WinnerWithRelations[];
}) {
  if (!winners || winners.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="No winners yet"
        description="Winners will appear here as soon as draws are completed."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {winners.map((winner) => {
        const name = winner.profiles?.full_name || "Winner";
        const prize =
          winner.prize_name || winner.campaigns?.prize_name || "a prize";
        return (
          <article
            key={winner.id}
            className="group card-surface relative flex items-center gap-4 overflow-hidden p-5 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-warning/30 hover:shadow-lift"
          >
            {/* Soft gold wash that warms up on hover */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-warning/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 sm:opacity-60"
            />

            <div className="relative shrink-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent font-display text-base font-bold text-accent-foreground ring-1 ring-inset ring-primary/10">
                {initials(name)}
              </div>
              <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-warning text-warning-foreground shadow-soft">
                <Trophy className="h-3.5 w-3.5" aria-hidden />
              </span>
            </div>

            <div className="relative min-w-0 flex-1">
              <p className="truncate font-display text-[0.975rem] font-bold tracking-tight">
                {name}
              </p>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                Won <span className="font-medium text-foreground">{prize}</span>
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {formatDate(winner.announced_at)}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
