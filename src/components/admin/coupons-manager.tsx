"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Coupon } from "@/lib/types/database";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select, Label } from "@/components/ui/input";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate } from "@/lib/utils";

const empty = {
  code: "",
  type: "percentage" as Coupon["type"],
  value: 10,
  expiry_date: "",
  usage_limit: "" as number | "",
  is_active: true,
};

export function CouponsManager({ initial }: { initial: Coupon[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Coupon | null>(null);

  const openNew = () => {
    setEditing(null);
    setForm({ ...empty });
    setOpen(true);
  };
  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      type: c.type,
      value: Number(c.value),
      expiry_date: c.expiry_date ? c.expiry_date.slice(0, 10) : "",
      usage_limit: c.usage_limit ?? "",
      is_active: c.is_active,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.code.trim()) return toast.error("Coupon code is required");
    setSaving(true);
    const payload = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value) || 0,
      expiry_date: form.expiry_date ? new Date(form.expiry_date).toISOString() : null,
      usage_limit: form.usage_limit === "" ? null : Number(form.usage_limit),
      is_active: form.is_active,
    };
    const res = editing
      ? await supabase.from("coupons").update(payload).eq("id", editing.id)
      : await supabase.from("coupons").insert(payload);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? "Coupon updated" : "Coupon created");
    setOpen(false);
    router.refresh();
  };

  const remove = async () => {
    if (!toDelete) return;
    const { error } = await supabase.from("coupons").delete().eq("id", toDelete.id);
    if (error) return toast.error(error.message);
    toast.success("Coupon deleted");
    setToDelete(null);
    router.refresh();
  };

  const columns: Column<any>[] = [
    { key: "code", label: "Code", render: (c) => <span className="font-mono font-semibold">{c.code}</span> },
    {
      key: "value",
      label: "Discount",
      render: (c) => (c.type === "percentage" ? `${c.value}%` : formatCurrency(c.value)),
    },
    { key: "used_count", label: "Used", render: (c) => `${c.used_count}${c.usage_limit ? ` / ${c.usage_limit}` : ""}` },
    { key: "expiry_date", label: "Expires", render: (c) => (c.expiry_date ? formatDate(c.expiry_date) : "Never") },
    {
      key: "is_active",
      label: "Status",
      render: (c) => <Badge status={c.is_active ? "active" : "draft"}>{c.is_active ? "Active" : "Disabled"}</Badge>,
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (c) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setToDelete(c)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={initial as any}
        searchable
        searchKeys={["code"]}
        searchPlaceholder="Search coupons…"
        toolbar={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> New Coupon
          </Button>
        }
      />

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit coupon" : "New coupon"}>
        <div className="space-y-4">
          <div>
            <Label>Code</Label>
            <Input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="SAVE10"
              className="font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <Select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as Coupon["type"] })}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat (Rs.)</option>
              </Select>
            </div>
            <div>
              <Label>Value</Label>
              <Input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Expiry date</Label>
              <Input
                type="date"
                value={form.expiry_date}
                onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
              />
            </div>
            <div>
              <Label>Usage limit (blank = ∞)</Label>
              <Input
                type="number"
                value={form.usage_limit}
                onChange={(e) =>
                  setForm({ ...form, usage_limit: e.target.value === "" ? "" : Number(e.target.value) })
                }
              />
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/70 bg-muted/40 px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-muted/70">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Active
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} loading={saving}>
              {editing ? "Save" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={remove}
        title="Delete coupon?"
        message={`"${toDelete?.code}" will be removed.`}
        confirmText="Delete"
      />
    </>
  );
}
