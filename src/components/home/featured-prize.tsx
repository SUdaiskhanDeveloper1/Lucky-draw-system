import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Gift, Sparkles, Ticket, Trophy, Users } from "lucide-react";
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
    <div className="card-surface overflow-hidden shadow-card">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="group relative aspect-[4/3] w-full overflow-hidden bg-muted lg:aspect-auto lg:min-h-[26rem]">
          {campaign.prize_image ? (
            <Image
              src={campaign.prize_image}
              alt={campaign.prize_name}
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full min-h-64 items-center justify-center bg-gradient-to-br from-accent to-muted text-muted-foreground">
              <Gift className="h-16 w-16" />
            </div>
          )}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-foreground/40 to-transparent"
          />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-primary-foreground shadow-soft">
            <Sparkles className="h-3.5 w-3.5" /> Featured Draw
          </span>
        </div>

        <div className="flex flex-col justify-center gap-6 p-6 sm:p-10">
          <div className="space-y-3">
            <h3 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              {campaign.prize_name}
            </h3>
            {campaign.description && (
              <p className="line-clamp-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                {campaign.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 divide-x divide-border/70 rounded-xl border border-border/70 bg-muted/40">
            <Stat
              icon={Ticket}
              value={formatCurrency(campaign.entry_fee)}
              label="Entry fee"
              highlight
            />
            <Stat
              icon={Users}
              value={campaign.entries_count.toLocaleString("en-PK")}
              label="Entries"
            />
            <Stat
              icon={Trophy}
              value={String(campaign.winners_count)}
              label="Winners"
            />
          </div>

          <div>
            <p className="eyebrow mb-3">Draw ends in</p>
            <Countdown target={campaign.end_date} />
          </div>

          {pct !== null && (
            <div className="space-y-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-brand-gradient transition-[width] duration-700 ease-out-expo"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                {campaign.entries_count.toLocaleString("en-PK")} of{" "}
                {campaign.max_entries?.toLocaleString("en-PK")} entries filled
              </p>
            </div>
          )}

          <Link href={`/join/${campaign.id}`} className="block">
            <Button size="lg" variant="gradient" className="w-full sm:w-auto">
              Join for {formatCurrency(campaign.entry_fee)}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 py-4 text-center">
      <Icon className="mb-0.5 h-4 w-4 text-muted-foreground" aria-hidden />
      <p
        className={`font-display text-base font-bold tabular-nums tracking-tight ${
          highlight ? "text-primary" : ""
        }`}
      >
        {value}
      </p>
      <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
