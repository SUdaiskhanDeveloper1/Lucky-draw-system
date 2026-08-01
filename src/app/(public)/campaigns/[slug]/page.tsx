import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Ticket,
  Trophy,
  Users,
} from "lucide-react";
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
    <>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground"
        >
          <Link
            href="/campaigns"
            className="transition-colors duration-200 hover:text-primary"
          >
            Campaigns
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
          <span className="truncate font-medium text-foreground">
            {campaign.prize_name}
          </span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <CampaignGallery images={gallery} alt={campaign.prize_name} />
          </div>

          <div className="space-y-7">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge status={campaign.status} />
                {campaign.is_featured && (
                  <Badge className="bg-warning/14 text-warning ring-warning/25">
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-[2.5rem] sm:leading-[1.1]">
                {campaign.prize_name}
              </h1>
              {campaign.description && (
                <p className="whitespace-pre-line text-[0.975rem] leading-relaxed text-muted-foreground">
                  {campaign.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card-surface p-5">
                <p className="eyebrow">Entry Fee</p>
                <p className="mt-2 font-display text-2xl font-extrabold tracking-tight text-primary">
                  {formatCurrency(campaign.entry_fee)}
                </p>
              </div>
              <div className="card-surface p-5">
                <p className="eyebrow">Winners</p>
                <p className="mt-2 inline-flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight">
                  <Trophy className="h-5 w-5 text-warning" aria-hidden />
                  {campaign.winners_count}
                </p>
              </div>
            </div>

            <div className="card-surface space-y-3.5 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 font-medium text-muted-foreground">
                  <Users className="h-4 w-4" aria-hidden />
                  <span className="tabular-nums text-foreground">
                    {campaign.entries_count.toLocaleString("en-PK")}
                  </span>{" "}
                  entries
                </span>
                {campaign.max_entries && (
                  <span className="text-sm text-muted-foreground">
                    of {campaign.max_entries.toLocaleString("en-PK")}
                  </span>
                )}
              </div>
              {pct !== null && (
                <>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-brand-gradient transition-[width] duration-700 ease-out-expo"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {pct}% filled
                  </p>
                </>
              )}
            </div>

            <div className="card-surface p-5">
              <p className="eyebrow mb-3">Draw ends in</p>
              <Countdown target={campaign.end_date} />
            </div>

            <div className="space-y-3">
              <Link href={`/join/${campaign.id}`} className="block">
                <Button size="lg" variant="gradient" className="w-full">
                  <Ticket className="h-4 w-4" />
                  Join for {formatCurrency(campaign.entry_fee)}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-success" aria-hidden />
                100% secure payments · Reviewed by our team
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
