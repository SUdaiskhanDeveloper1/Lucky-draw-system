"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Download, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { downloadCSV } from "@/lib/utils";

const REPORTS = [
  { key: "users", label: "Users", table: "profiles", select: "id,full_name,email,phone,city,country,status,created_at" },
  { key: "payments", label: "Payments", table: "payments", select: "id,amount,method,transaction_id,sender_number,status,created_at" },
  { key: "campaigns", label: "Campaigns", table: "campaigns", select: "id,prize_name,entry_fee,entries_count,winners_count,status,created_at" },
  { key: "tickets", label: "Tickets", table: "tickets", select: "id,ticket_number,status,created_at" },
] as const;

export function ReportsExport() {
  const supabase = createClient();
  const [busy, setBusy] = useState<string | null>(null);

  const exportCsv = async (r: (typeof REPORTS)[number]) => {
    setBusy(r.key);
    const { data, error } = await supabase.from(r.table).select(r.select);
    setBusy(null);
    if (error) return toast.error(error.message);
    if (!data?.length) return toast.error("No data to export");
    downloadCSV(`${r.key}-${new Date().toISOString().slice(0, 10)}.csv`, data as any);
    toast.success(`Exported ${data.length} ${r.label.toLowerCase()}`);
  };

  const exportRevenue = async () => {
    setBusy("revenue");
    const { data, error } = await supabase
      .from("payments")
      .select("amount,created_at")
      .eq("status", "approved");
    setBusy(null);
    if (error) return toast.error(error.message);
    const byMonth: Record<string, number> = {};
    for (const p of data ?? []) {
      const key = new Date(p.created_at).toISOString().slice(0, 7);
      byMonth[key] = (byMonth[key] ?? 0) + Number(p.amount || 0);
    }
    const rows = Object.entries(byMonth).map(([month, revenue]) => ({ month, revenue }));
    if (!rows.length) return toast.error("No revenue yet");
    downloadCSV(`revenue-${new Date().toISOString().slice(0, 10)}.csv`, rows);
    toast.success("Revenue exported");
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {REPORTS.map((r) => (
        <Card key={r.key}>
          <CardContent className="flex items-center justify-between gap-3 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium">{r.label}</p>
                <p className="text-xs text-muted-foreground">Export as CSV</p>
              </div>
            </div>
            <Button size="sm" variant="outline" loading={busy === r.key} onClick={() => exportCsv(r)}>
              <Download className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent className="flex items-center justify-between gap-3 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15 text-success">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium">Revenue</p>
              <p className="text-xs text-muted-foreground">Monthly summary CSV</p>
            </div>
          </div>
          <Button size="sm" variant="outline" loading={busy === "revenue"} onClick={exportRevenue}>
            <Download className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
