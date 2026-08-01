import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Our Winners
        </h1>
        <p className="mt-2 text-muted-foreground">
          Real people winning real prizes for just Rs.1.
        </p>
      </div>

      <WinnersSection winners={winners} />
    </div>
  );
}
