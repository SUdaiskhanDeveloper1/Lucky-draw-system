import { createClient } from "@/lib/supabase/server";
import { BannersManager } from "@/components/admin/banners-manager";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Banner Management</h1>
        <p className="text-sm text-muted-foreground">
          Homepage hero banners
        </p>
      </div>
      <BannersManager initial={data ?? []} />
    </div>
  );
}
