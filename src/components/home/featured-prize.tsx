import Link from "next/link";
import Image from "next/image";
import { Gift, Sparkles, Ticket, Users } from "lucide-react";
import type { Campaign } from "@/lib/types/database";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/shared/countdown";

export function FeaturedPrize({ campaign }: { campaign: Campaign | null }) {
  if (!campaign) return null;

  const pct =
    campaign.max_entries && campaign.max_entries > 0
      ? Math.min(
          100,
          Math.round((campaign.entries_count / campaign.max_entries) * 100)
        )
      : null;

  return (
    <div className="card-surface overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted lg:aspect-auto">
          {campaign.prize_image ? (
            <Image
              src={campaign.prize_image}
              alt={campaign.prize_name}
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full min-h-64 items-center justify-center text-muted-foreground">
              <Gift className="h-16 w-16" />
            </div>
          )}
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Featured Draw
          </span>
        </div>

        <div className="flex flex-col justify-center gap-5 p-6 sm:p-10">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {campaign.prize_name}
            </h3>
            {campaign.description && (
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {campaign.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 font-semibold text-accent-foreground">
              <Ticket className="h-4 w-4" /> Entry {formatCurrency(campaign.entry_fee)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4" /> {campaign.entries_count} entries
            </span>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Draw ends in
            </p>
            <Countdown target={campaign.end_date} />
          </div>

          {pct !== null && (
            <div className="space-y-1.5">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {campaign.entries_count} of {campaign.max_entries} entries filled
              </p>
            </div>
          )}

          <Link href={`/join/${campaign.id}`}>
            <Button size="lg" className="w-full sm:w-auto">
              Join for {formatCurrency(campaign.entry_fee)}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
