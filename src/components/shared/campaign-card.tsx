import Link from "next/link";
import Image from "next/image";
import { Star, Ticket, Users } from "lucide-react";
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
    <div className="group card-surface overflow-hidden transition hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {campaign.prize_image ? (
          <Image
            src={campaign.prize_image}
            alt={campaign.prize_name}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Ticket className="h-10 w-10" />
          </div>
        )}
        {campaign.is_featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
            <Star className="h-3 w-3" /> Featured
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white">
          {formatCurrency(campaign.entry_fee)}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <h3 className="line-clamp-1 text-base font-semibold">
          {campaign.prize_name}
        </h3>

        {campaign.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {campaign.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {campaign.entries_count} entries
          </span>
          <Countdown target={campaign.end_date} compact />
        </div>

        {pct !== null && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}

        <Link href={`/join/${campaign.id}`} className="block">
          <Button className="w-full">
            Join for {formatCurrency(campaign.entry_fee)}
          </Button>
        </Link>
      </div>
    </div>
  );
}
