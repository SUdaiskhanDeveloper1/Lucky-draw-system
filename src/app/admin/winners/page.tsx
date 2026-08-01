import { createClient } from "@/lib/supabase/server";
import { WinnersManager } from "@/components/admin/winners-manager";

export const dynamic = "force-dynamic";

export default async function AdminWinnersPage() {
  const supabase = await createClient();

  const [{ data: campaigns }, { data: winners }] = await Promise.all([
    supabase
      .from("campaigns")
      .select("*")
      .in("status", ["active", "completed"])
      .order("created_at", { ascending: false }),
    supabase
      .from("winners")
      .select("*, profiles(full_name,email), campaigns(prize_name), tickets(ticket_number)")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Winner Management</h1>
        <p className="text-sm text-muted-foreground">
          Draw winners automatically or record them manually
        </p>
      </div>
      <WinnersManager campaigns={campaigns ?? []} winners={winners ?? []} />
    </div>
  );
}
