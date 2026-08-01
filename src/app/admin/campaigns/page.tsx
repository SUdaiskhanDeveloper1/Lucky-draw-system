import { createClient } from "@/lib/supabase/server";
import { CampaignsManager } from "@/components/admin/campaigns-manager";

export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Campaign Management</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage lucky-draw campaigns
        </p>
      </div>
      <CampaignsManager initial={data ?? []} />
    </div>
  );
}
