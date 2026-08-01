import { Ticket as TicketIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableWrap,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/ui/table";
import Link from "next/link";
import type { Ticket } from "@/lib/types/database";

type TicketRow = Ticket & {
  campaigns: { prize_name: string | null } | null;
};

export default async function TicketsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("tickets")
    .select("*, campaigns(prize_name)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const tickets = (data ?? []) as unknown as TicketRow[];

  if (tickets.length === 0) {
    return (
      <EmptyState
        title="No tickets yet"
        description="Join a campaign to receive your lucky draw tickets."
        icon={TicketIcon}
        // action={
        //   <Link href="/campaigns">
        //     <Button>Browse Campaigns</Button>
        //   </Link>
        // }
      />
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        You have{" "}
        <span className="font-semibold tabular-nums text-foreground">
          {tickets.length}
        </span>{" "}
        {tickets.length === 1 ? "ticket" : "tickets"} in total.
      </p>

      <TableWrap>
        <Table>
          <THead>
            <tr>
              <TH>Ticket Number</TH>
              <TH>Campaign</TH>
              <TH>Purchase Date</TH>
              <TH className="text-right">Status</TH>
            </tr>
          </THead>
          <TBody>
            {tickets.map((t) => (
              <TR key={t.id}>
                <TD>
                  <span className="inline-flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <TicketIcon className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-mono text-[0.8125rem] font-semibold">
                      {t.ticket_number}
                    </span>
                  </span>
                </TD>
                <TD className="font-medium">
                  {t.campaigns?.prize_name ?? "—"}
                </TD>
                <TD className="whitespace-nowrap text-muted-foreground">
                  {formatDate(t.created_at)}
                </TD>
                <TD className="text-right">
                  <Badge status={t.status} />
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </TableWrap>
    </div>
  );
}
