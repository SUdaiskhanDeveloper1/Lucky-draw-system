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
          <div
            key={winner.id}
            className="card-surface flex items-center gap-4 p-4"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
              {initials(name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 shrink-0 text-warning" />
                <p className="truncate font-semibold">{name}</p>
              </div>
              <p className="truncate text-sm text-muted-foreground">
                Won {prize}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(winner.announced_at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
