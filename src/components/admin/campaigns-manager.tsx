"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Pencil, Plus, Trash2, Star, Upload, X } from "lucide-react";
import type { Campaign } from "@/lib/types/database";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select, Label } from "@/components/ui/input";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate, slugify } from "@/lib/utils";

type Row = any;

const empty = {
  prize_name: "",
  description: "",
  entry_fee: 1,
  max_entries: "" as number | "",
  winners_count: 1,
  start_date: "",
  end_date: "",
  status: "active" as Campaign["status"],
  is_featured: false,
  images: [] as string[],
};

export function CampaignsManager({ initial }: { initial: Campaign[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toDelete, setToDelete] = useState<Campaign | null>(null);

  const openNew = () => {
    setEditing(null);
    setForm({ ...empty });
    setOpenForm(true);
  };

  const openEdit = (c: Campaign) => {
    setEditing(c);
    setForm({
      prize_name: c.prize_name,
      description: c.description ?? "",
      entry_fee: Number(c.entry_fee),
      max_entries: c.max_entries ?? "",
      winners_count: c.winners_count,
      start_date: c.start_date ? c.start_date.slice(0, 16) : "",
      end_date: c.end_date ? c.end_date.slice(0, 16) : "",
      status: c.status,
      is_featured: c.is_featured,
      images: c.images ?? [],
    });
    setOpenForm(true);
  };

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error } = await supabase.storage.from("campaign-images").upload(path, file);
      if (error) {
        toast.error(`Upload failed: ${file.name}`);
        continue;
      }
      const { data } = supabase.storage.from("campaign-images").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    setUploading(false);
  };

  const save = async () => {
    if (!form.prize_name.trim()) return toast.error("Prize name is required");
    setSaving(true);
    const payload = {
      prize_name: form.prize_name.trim(),
      slug: slugify(form.prize_name),
      description: form.description || null,
      prize_image: form.images[0] ?? null,
      images: form.images,
      entry_fee: Number(form.entry_fee) || 1,
      max_entries: form.max_entries === "" ? null : Number(form.max_entries),
      winners_count: Number(form.winners_count) || 1,
      start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
      end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
      status: form.status,
      is_featured: form.is_featured,
    };

    const res = editing
      ? await supabase.from("campaigns").update(payload).eq("id", editing.id)
      : await supabase.from("campaigns").insert(payload);

    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? "Campaign updated" : "Campaign created");
    setOpenForm(false);
    router.refresh();
  };

  const remove = async () => {
    if (!toDelete) return;
    const { error } = await supabase.from("campaigns").delete().eq("id", toDelete.id);
    if (error) return toast.error(error.message);
    toast.success("Campaign deleted");
    setToDelete(null);
    router.refresh();
  };

  const columns: Column<Row>[] = [
    {
      key: "prize_name",
      label: "Campaign",
      render: (c) => (
        <div className="flex items-center gap-3">
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
            {c.prize_image && (
              <Image src={c.prize_image} alt="" fill className="object-cover" />
            )}
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-1 truncate font-medium">
              {c.prize_name}
              {c.is_featured && <Star className="h-3 w-3 text-primary" />}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {formatCurrency(c.entry_fee)} · {c.winners_count} winner(s)
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "entries",
      label: "Entries",
      render: (c) => `${c.entries_count}${c.max_entries ? ` / ${c.max_entries}` : ""}`,
    },
    { key: "status", label: "Status", render: (c) => <Badge status={c.status} /> },
    { key: "end_date", label: "Ends", render: (c) => formatDate(c.end_date) },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (c) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" title="Edit" onClick={() => openEdit(c)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Delete" onClick={() => setToDelete(c)}>
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
        searchKeys={["prize_name"]}
        searchPlaceholder="Search campaigns…"
        toolbar={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> New Campaign
          </Button>
        }
      />

      <Modal
        open={openForm}
        onClose={() => setOpenForm(false)}
        title={editing ? "Edit campaign" : "New campaign"}
        className="max-w-2xl"
      >
        <div className="space-y-4">
          <div>
            <Label>Prize name</Label>
            <Input
              value={form.prize_name}
              onChange={(e) => setForm({ ...form, prize_name: e.target.value })}
              placeholder="e.g. iPhone 15 Pro Max"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Entry fee (Rs.)</Label>
              <Input
                type="number"
                min={1}
                value={form.entry_fee}
                onChange={(e) => setForm({ ...form, entry_fee: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Max entries (blank = unlimited)</Label>
              <Input
                type="number"
                value={form.max_entries}
                onChange={(e) =>
                  setForm({ ...form, max_entries: e.target.value === "" ? "" : Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Number of winners</Label>
              <Input
                type="number"
                min={1}
                value={form.winners_count}
                onChange={(e) => setForm({ ...form, winners_count: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Campaign["status"] })}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>
            <div>
              <Label>Start date</Label>
              <Input
                type="datetime-local"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              />
            </div>
            <div>
              <Label>End date</Label>
              <Input
                type="datetime-local"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
            />
            Featured campaign
          </label>

          <div>
            <Label>Prize images</Label>
            <div className="flex flex-wrap gap-2">
              {form.images.map((url, i) => (
                <span key={url} className="relative h-16 w-16 overflow-hidden rounded-md border">
                  <Image src={url} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })}
                    className="absolute right-0 top-0 bg-black/60 p-0.5 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-md border border-dashed text-muted-foreground hover:bg-muted">
                {uploading ? <Upload className="h-5 w-5 animate-pulse" /> : <Plus className="h-5 w-5" />}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => upload(e.target.files)}
                />
              </label>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              The first image is used as the main prize image.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpenForm(false)}>
              Cancel
            </Button>
            <Button onClick={save} loading={saving}>
              {editing ? "Save changes" : "Create campaign"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={remove}
        title="Delete campaign?"
        message={`"${toDelete?.prize_name}" and its data will be removed.`}
        confirmText="Delete"
      />
    </>
  );
}
