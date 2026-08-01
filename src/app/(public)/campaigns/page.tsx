import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Campaign } from "@/lib/types/database";
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          All Campaigns
        </h1>
        <p className="mt-2 text-muted-foreground">
          Pick a draw, enter for as little as Rs.1, and win big.
        </p>
      </div>

      <CampaignsBrowser campaigns={campaigns} />
    </div>
  );
}
