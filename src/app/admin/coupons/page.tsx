import { createClient } from "@/lib/supabase/server";
import { CouponsManager } from "@/components/admin/coupons-manager";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Coupon Management</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Discount codes for checkout</p>
      </div>
      <CouponsManager initial={data ?? []} />
    </div>
  );
}
