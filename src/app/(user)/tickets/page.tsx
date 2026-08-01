import { Ticket as TicketIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
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
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Ticket Number</th>
                <th className="px-4 py-3 font-medium">Campaign</th>
                <th className="px-4 py-3 font-medium">Purchase Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-secondary/50">
                  <td className="px-4 py-3 font-mono font-medium">
                    {t.ticket_number}
                  </td>
                  <td className="px-4 py-3">
                    {t.campaigns?.prize_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(t.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={t.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
