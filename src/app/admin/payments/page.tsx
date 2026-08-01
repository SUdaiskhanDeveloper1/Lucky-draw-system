import { createClient } from "@/lib/supabase/server";
import { PaymentsTable } from "@/components/admin/payments-table";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("payments")
    .select("*, profiles(full_name,email,phone), campaigns(prize_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Payment Management</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Review, approve or reject payment submissions
        </p>
      </div>
      <PaymentsTable initial={data ?? []} />
    </div>
  );
}
