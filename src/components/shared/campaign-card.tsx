import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Ticket, Users } from "lucide-react";
import type { Campaign } from "@/lib/types/database";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/shared/countdown";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const pct =
    campaign.max_entries && campaign.max_entries > 0
      ? Math.min(100, Math.round((campaign.entries_count / campaign.max_entries) * 100))
      : null;

  return (
    <article className="group card-interactive flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {campaign.prize_image ? (
          <Image
            src={campaign.prize_image}
            alt={campaign.prize_name}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-accent/40 text-muted-foreground">
            <Ticket className="h-10 w-10" />
          </div>
        )}

        {/* Legibility scrim for the overlaid chips */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-foreground/45 to-transparent opacity-80"
        />

        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          {campaign.status === "active" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wide text-success-foreground shadow-soft">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
              </span>
              Live
            </span>
          )}
          {campaign.is_featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-warning px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wide text-warning-foreground shadow-soft">
              <Sparkles className="h-3 w-3" /> Featured
            </span>
          )}
        </div>

        <span className="absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-bold tabular-nums text-foreground shadow-soft backdrop-blur">
          {formatCurrency(campaign.entry_fee)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-1.5">
          <h3 className="line-clamp-1 font-display text-[1.0625rem] font-bold tracking-tight transition-colors duration-200 group-hover:text-primary">
            {campaign.prize_name}
          </h3>
          {campaign.description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {campaign.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span className="tabular-nums">
              {campaign.entries_count.toLocaleString("en-PK")}
            </span>{" "}
            entries
          </span>
          <Countdown target={campaign.end_date} compact />
        </div>

        {pct !== null && (
          <div className="space-y-1.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-brand-gradient transition-[width] duration-700 ease-out-expo"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-[0.6875rem] font-medium text-muted-foreground">
              {pct}% of {campaign.max_entries?.toLocaleString("en-PK")} entries
              filled
            </p>
          </div>
        )}

        <Link href={`/join/${campaign.id}`} className="mt-auto block pt-1">
          <Button className="w-full">
            Join for {formatCurrency(campaign.entry_fee)}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </div>
    </article>
  );
}
