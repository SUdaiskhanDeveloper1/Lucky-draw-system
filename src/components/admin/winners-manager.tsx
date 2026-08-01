"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Crown, Dice5, Hand } from "lucide-react";
import type { Campaign } from "@/lib/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
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
import { createClient } from "@/lib/supabase/client";
import { formatDateTime } from "@/lib/utils";
import { drawWinners } from "@/app/actions/admin";

type WinnerRow = any;

export function WinnersManager({
  campaigns,
  winners,
}: {
  campaigns: Campaign[];
  winners: WinnerRow[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [auto, setAuto] = useState<Campaign | null>(null);
  const [manual, setManual] = useState<Campaign | null>(null);
  const [ticketNo, setTicketNo] = useState("");
  const [busy, setBusy] = useState(false);
  const [pending, startTransition] = useTransition();

  const runAuto = () =>
    auto &&
    startTransition(async () => {
      const res = await drawWinners(auto.id, auto.winners_count);
      if (res.ok) {
        toast.success("Winners drawn!");
        setAuto(null);
        router.refresh();
      } else toast.error(res.error ?? "Failed");
    });

  const runManual = async () => {
    if (!manual) return;
    if (!ticketNo.trim()) return toast.error("Enter a ticket number");
    setBusy(true);
    const { data: ticket } = await supabase
      .from("tickets")
      .select("*")
      .eq("campaign_id", manual.id)
      .eq("ticket_number", ticketNo.trim())
      .maybeSingle();

    if (!ticket) {
      setBusy(false);
      return toast.error("Ticket not found for this campaign");
    }

    const { error: wErr } = await supabase.from("winners").insert({
      campaign_id: manual.id,
      user_id: ticket.user_id,
      ticket_id: ticket.id,
      prize_name: manual.prize_name,
    });
    if (wErr) {
      setBusy(false);
      return toast.error(wErr.message);
    }
    await supabase.from("tickets").update({ status: "won" }).eq("id", ticket.id);
    await supabase.from("notifications").insert({
      user_id: ticket.user_id,
      title: "Congratulations — You Won!",
      body: `You won "${manual.prize_name}". We will contact you shortly.`,
      type: "winner",
      link: "/dashboard",
    });

    setBusy(false);
    setManual(null);
    setTicketNo("");
    toast.success("Winner recorded");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Campaigns to draw */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Draw Winners</h2>
        {campaigns.length === 0 ? (
          <EmptyState title="No campaigns yet" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <Card key={c.id}>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{c.prize_name}</p>
                    <Badge status={c.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {c.entries_count} entries · {c.winners_count} winner(s)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      disabled={c.status === "completed"}
                      onClick={() => setAuto(c)}
                    >
                      <Dice5 className="h-4 w-4" /> Auto
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setManual(c)}
                    >
                      <Hand className="h-4 w-4" /> Manual
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Existing winners */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Crown className="h-5 w-5 text-warning" /> Winner History
        </h2>
        {winners.length === 0 ? (
          <EmptyState title="No winners drawn yet" />
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <tr>
                  <TH>Winner</TH>
                  <TH>Prize</TH>
                  <TH>Ticket</TH>
                  <TH>Date</TH>
                </tr>
              </THead>
              <TBody>
                {winners.map((w) => (
                  <TR key={w.id}>
                    <TD>
                      <span className="inline-flex items-center gap-2 font-medium">
                        <Crown
                          className="h-3.5 w-3.5 shrink-0 text-warning"
                          aria-hidden
                        />
                        {w.profiles?.full_name ?? w.profiles?.email ?? "—"}
                      </span>
                    </TD>
                    <TD className="text-muted-foreground">
                      {w.prize_name ?? w.campaigns?.prize_name ?? "—"}
                    </TD>
                    <TD className="font-mono text-xs">
                      {w.tickets?.ticket_number ?? "—"}
                    </TD>
                    <TD className="whitespace-nowrap text-muted-foreground">
                      {formatDateTime(w.announced_at ?? w.created_at)}
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>
        )}
      </div>

      <ConfirmDialog
        open={!!auto}
        onClose={() => setAuto(null)}
        onConfirm={runAuto}
        loading={pending}
        variant="default"
        title="Run automatic draw?"
        message={`This randomly selects ${auto?.winners_count ?? 1} winner(s) from approved tickets, marks the rest as lost, and completes the campaign.`}
        confirmText="Draw winners"
      />

      <Modal open={!!manual} onClose={() => setManual(null)} title="Manual draw">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Enter the winning ticket number for <b>{manual?.prize_name}</b>.
          </p>
          <div>
            <Label>Ticket number</Label>
            <Input
              value={ticketNo}
              onChange={(e) => setTicketNo(e.target.value)}
              placeholder="DRAW-2026-000001"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setManual(null)}>
              Cancel
            </Button>
            <Button onClick={runManual} loading={busy}>
              Record winner
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
