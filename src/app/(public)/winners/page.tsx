import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/misc";
import {
  WinnersSection,
  type WinnerWithRelations,
} from "@/components/home/winners-section";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Winners — Rs.1 Lucky Draw",
  description: "See everyone who has won prizes in our lucky draws.",
};

export default async function WinnersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("winners")
    .select("*, profiles(full_name), campaigns(prize_name)")
    .order("announced_at", { ascending: false });

  const winners = (data ?? []) as unknown as WinnerWithRelations[];

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <PageHeader
          eyebrow="Hall of fame"
          title="Our Winners"
          subtitle="Real people winning real prizes for just Rs.1."
        />
        <WinnersSection winners={winners} />
      </div>
    </>
  );
}
