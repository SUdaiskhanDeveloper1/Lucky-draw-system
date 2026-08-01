"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Check, Eye, X } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, Textarea, Label } from "@/components/ui/input";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/misc";
import { createClient } from "@/lib/supabase/client";
import { cn, formatCurrency, formatDateTime } from "@/lib/utils";
import { approvePayment, rejectPayment } from "@/app/actions/admin";

type Row = any;

const FILTERS = ["all", "pending", "approved", "rejected"] as const;

export function PaymentsTable({ initial }: { initial: Row[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("pending");
  const [approve, setApprove] = useState<Row | null>(null);
  const [reject, setReject] = useState<Row | null>(null);
  const [reason, setReason] = useState("");
  const [receipt, setReceipt] = useState<{ open: boolean; url?: string; loading: boolean }>({
    open: false,
    loading: false,
  });
  const [pending, startTransition] = useTransition();

  const rows = useMemo(
    () => (filter === "all" ? initial : initial.filter((p) => p.status === filter)),
    [initial, filter]
  );

  const viewReceipt = async (path: string | null) => {
    if (!path) return toast.error("No receipt uploaded");
    setReceipt({ open: true, loading: true });
    // Stored value may be a full URL or a storage object path.
    if (path.startsWith("http")) {
      setReceipt({ open: true, loading: false, url: path });
      return;
    }
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("payment-receipts")
      .createSignedUrl(path, 3600);
    if (error) {
      toast.error("Could not load receipt");
      setReceipt({ open: false, loading: false });
    } else {
      setReceipt({ open: true, loading: false, url: data.signedUrl });
    }
  };

  const doApprove = () =>
    approve &&
    startTransition(async () => {
      const res = await approvePayment(approve.id);
      if (res.ok) {
        toast.success("Payment approved · ticket generated");
        setApprove(null);
        router.refresh();
      } else toast.error(res.error ?? "Failed");
    });

  const doReject = () => {
    if (!reject) return;
    if (!reason.trim()) return toast.error("A rejection reason is required");
    startTransition(async () => {
      const res = await rejectPayment(reject.id, reason.trim());
      if (res.ok) {
        toast.success("Payment rejected");
        setReject(null);
        setReason("");
        router.refresh();
      } else toast.error(res.error ?? "Failed");
    });
  };

  const columns: Column<Row>[] = [
    {
      key: "user",
      label: "User",
      render: (p) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{p.profiles?.full_name ?? "—"}</p>
          <p className="truncate text-xs text-muted-foreground">
            {p.profiles?.phone ?? p.profiles?.email ?? ""}
          </p>
        </div>
      ),
    },
    { key: "campaign", label: "Campaign", render: (p) => p.campaigns?.prize_name ?? "—" },
    {
      key: "amount",
      label: "Amount",
      render: (p) => (
        <span className="whitespace-nowrap font-semibold tabular-nums">
          {formatCurrency(p.amount)}
        </span>
      ),
    },
    { key: "method", label: "Method", render: (p) => <span className="capitalize">{String(p.method).replace("_", " ")}</span> },
    {
      key: "transaction_id",
      label: "Txn ID",
      render: (p) => (
        <span className="font-mono text-xs text-muted-foreground">
          {p.transaction_id ?? "—"}
        </span>
      ),
    },
    { key: "status", label: "Status", render: (p) => <Badge status={p.status} /> },
    {
      key: "created_at",
      label: "Date",
      render: (p) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {formatDateTime(p.created_at)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (p) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" title="View receipt" onClick={() => viewReceipt(p.receipt_url)}>
            <Eye className="h-4 w-4" />
          </Button>
          {p.status === "pending" && (
            <>
              <Button variant="ghost" size="icon" title="Approve" onClick={() => setApprove(p)}>
                <Check className="h-4 w-4 text-success" />
              </Button>
              <Button variant="ghost" size="icon" title="Reject" onClick={() => setReject(p)}>
                <X className="h-4 w-4 text-destructive" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Segmented status filter */}
      <div
        role="tablist"
        aria-label="Filter payments by status"
        className="mb-5 inline-flex flex-wrap gap-1 rounded-xl border border-border/70 bg-card p-1 shadow-xs"
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            className={cn(
              "rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition-all duration-300 ease-out-expo",
              filter === f
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        rows={rows as any}
        searchable
        searchKeys={["transaction_id", "sender_number"]}
        searchPlaceholder="Search by Txn ID / sender number…"
      />

      {/* Receipt viewer */}
      <Modal open={receipt.open} onClose={() => setReceipt({ open: false, loading: false })} title="Payment Receipt">
        {receipt.loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : receipt.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={receipt.url} alt="Receipt" className="mx-auto max-h-[60vh] rounded-lg" />
        ) : (
          <p className="text-sm text-muted-foreground">No receipt available.</p>
        )}
      </Modal>

      <ConfirmDialog
        open={!!approve}
        onClose={() => setApprove(null)}
        onConfirm={doApprove}
        loading={pending}
        variant="success"
        title="Approve payment?"
        message="A unique ticket will be generated and the user notified."
        confirmText="Approve"
      />

      <Modal open={!!reject} onClose={() => setReject(null)} title="Reject payment">
        <div className="space-y-3">
          <div>
            <Label htmlFor="reason">Reason for rejection</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Screenshot unclear / transaction not found"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setReject(null)}>
              Cancel
            </Button>
            <Button variant="destructive" loading={pending} onClick={doReject}>
              Reject payment
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
