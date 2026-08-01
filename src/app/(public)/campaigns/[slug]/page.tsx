import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Campaign } from "@/lib/types/database";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Countdown } from "@/components/shared/countdown";
import { CampaignGallery } from "@/components/campaigns/campaign-gallery";

export const dynamic = "force-dynamic";

async function getCampaign(slug: string): Promise<Campaign | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("campaigns")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Campaign | null) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaign(slug);
  if (!campaign) return { title: "Campaign not found" };
  return {
    title: `${campaign.prize_name} — Rs.1 Lucky Draw`,
    description: campaign.description ?? undefined,
  };
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign = await getCampaign(slug);

  if (!campaign) notFound();

  const gallery = [
    campaign.prize_image,
    ...(campaign.images ?? []),
  ].filter((v): v is string => Boolean(v));

  const pct =
    campaign.max_entries && campaign.max_entries > 0
      ? Math.min(
          100,
          Math.round((campaign.entries_count / campaign.max_entries) * 100)
        )
      : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/campaigns" className="hover:text-primary">
          Campaigns
        </Link>{" "}
        / <span className="text-foreground">{campaign.prize_name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <CampaignGallery images={gallery} alt={campaign.prize_name} />

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge status={campaign.status} />
              {campaign.is_featured && (
                <Badge className="bg-primary/15 text-primary">Featured</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {campaign.prize_name}
            </h1>
            {campaign.description && (
              <p className="whitespace-pre-line text-muted-foreground">
                {campaign.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="card-surface p-4">
              <p className="text-xs uppercase text-muted-foreground">
                Entry Fee
              </p>
              <p className="mt-1 text-xl font-bold text-primary">
                {formatCurrency(campaign.entry_fee)}
              </p>
            </div>
            <div className="card-surface p-4">
              <p className="text-xs uppercase text-muted-foreground">Winners</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-xl font-bold">
                <Trophy className="h-5 w-5 text-warning" />
                {campaign.winners_count}
              </p>
            </div>
          </div>

          <div className="card-surface space-y-3 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Users className="h-4 w-4" /> {campaign.entries_count} entries
              </span>
              {campaign.max_entries && (
                <span className="text-muted-foreground">
                  of {campaign.max_entries}
                </span>
              )}
            </div>
            {pct !== null && (
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            )}
          </div>

          <div className="card-surface p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Draw ends in
            </p>
            <Countdown target={campaign.end_date} />
          </div>

          <Link href={`/join/${campaign.id}`} className="block">
            <Button size="lg" className="w-full">
              Join for {formatCurrency(campaign.entry_fee)}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
