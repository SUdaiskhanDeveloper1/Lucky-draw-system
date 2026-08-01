import { Receipt } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/misc";
import { ReceiptLink } from "@/components/dashboard/receipt-link";
import type { Payment } from "@/lib/types/database";

type PaymentRow = Payment & {
  campaigns: { prize_name: string | null } | null;
};

export default async function PaymentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("payments")
    .select("*, campaigns(prize_name)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const payments = (data ?? []) as unknown as PaymentRow[];

  if (payments.length === 0) {
    return (
      <EmptyState
        title="No payments yet"
        description="Your payment submissions and their review status will appear here."
        icon={Receipt}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Campaign</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Method</th>
                  {/* <th className="px-4 py-3 font-medium">Txn ID</th> */}
                  <th className="px-4 py-3 font-medium">Receipt no</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((p) => (
                  <tr key={p.id} className="align-top hover:bg-secondary/50">
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(p.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      {p.campaigns?.prize_name ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatCurrency(p.amount)}
                      {p.discount > 0 && (
                        <span className="ml-1 text-xs text-success">
                          (-{formatCurrency(p.discount)})
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {p.method.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {p.transaction_id ?? "—"}
                    </td>
                    {/* <td className="px-4 py-3">
                      <ReceiptLink path={p.receipt_url} />
                    </td> */}
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <Badge status={p.status} />
                        {p.status === "rejected" && p.admin_note && (
                          <p className="max-w-[200px] text-xs text-destructive">
                            {p.admin_note}
                          </p>
                        )}
                        {p.status === "approved" && p.admin_note && (
                          <p className="max-w-[200px] text-xs text-muted-foreground">
                            {p.admin_note}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
