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
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Coupon Management</h1>
        <p className="text-sm text-muted-foreground">Discount codes for checkout</p>
      </div>
      <CouponsManager initial={data ?? []} />
    </div>
  );
}
