import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Campaign } from "@/lib/types/database";
import { PageHeader } from "@/components/ui/misc";
import { CampaignsBrowser } from "@/components/campaigns/campaigns-browser";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Campaigns — Rs.1 Lucky Draw",
  description: "Browse all active Rs.1 lucky draw campaigns.",
};

export default async function CampaignsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("campaigns")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const campaigns = (data ?? []) as Campaign[];

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <PageHeader
          eyebrow="Live draws"
          title="All Campaigns"
          subtitle="Pick a draw, enter for as little as Rs.1, and win big."
        />
        <CampaignsBrowser campaigns={campaigns} />
      </div>
    </>
  );
}
