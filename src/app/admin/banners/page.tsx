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
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Banner Management</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Homepage hero banners
        </p>
      </div>
      <BannersManager initial={data ?? []} />
    </div>
  );
}
