import { Receipt } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/misc";
import {
  Table,
  TableWrap,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/ui/table";
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
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-semibold tabular-nums text-foreground">
          {payments.length}
        </span>{" "}
        {payments.length === 1 ? "payment" : "payments"}.
      </p>

      <TableWrap>
        <Table>
          <THead>
            <tr>
              <TH>Date</TH>
              <TH>Campaign</TH>
              <TH>Amount</TH>
              <TH>Method</TH>
              {/* <TH>Txn ID</TH> */}
              <TH>Receipt no</TH>
              <TH className="text-right">Status</TH>
            </tr>
          </THead>
          <TBody>
            {payments.map((p) => (
              <TR key={p.id} className="align-top">
                <TD className="whitespace-nowrap text-muted-foreground">
                  {formatDate(p.created_at)}
                </TD>
                <TD className="font-medium">
                  {p.campaigns?.prize_name ?? "—"}
                </TD>
                <TD className="whitespace-nowrap font-semibold tabular-nums">
                  {formatCurrency(p.amount)}
                  {p.discount > 0 && (
                    <span className="ml-1.5 text-xs font-medium text-success">
                      (-{formatCurrency(p.discount)})
                    </span>
                  )}
                </TD>
                <TD className="capitalize">{p.method.replace("_", " ")}</TD>
                <TD className="font-mono text-xs text-muted-foreground">
                  {p.transaction_id ?? "—"}
                </TD>
                {/* <TD>
                  <ReceiptLink path={p.receipt_url} />
                </TD> */}
                <TD className="text-right">
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge status={p.status} />
                    {p.status === "rejected" && p.admin_note && (
                      <p className="max-w-[220px] text-xs leading-relaxed text-destructive">
                        {p.admin_note}
                      </p>
                    )}
                    {p.status === "approved" && p.admin_note && (
                      <p className="max-w-[220px] text-xs leading-relaxed text-muted-foreground">
                        {p.admin_note}
                      </p>
                    )}
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </TableWrap>
    </div>
  );
}
