"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import type { Banner } from "@/lib/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/misc";
import { createClient } from "@/lib/supabase/client";

const empty = {
  title: "",
  subtitle: "",
  image_url: "",
  link_url: "",
  sort_order: 0,
  is_active: true,
};

export function BannersManager({ initial }: { initial: Banner[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toDelete, setToDelete] = useState<Banner | null>(null);

  const openNew = () => {
    setEditing(null);
    setForm({ ...empty });
    setOpen(true);
  };
  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm({
      title: b.title,
      subtitle: b.subtitle ?? "",
      image_url: b.image_url,
      link_url: b.link_url ?? "",
      sort_order: b.sort_order,
      is_active: b.is_active,
    });
    setOpen(true);
  };

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage.from("banners").upload(path, file);
    if (error) {
      toast.error(error.message);
    } else {
      const { data } = supabase.storage.from("banners").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
    }
    setUploading(false);
  };

  const save = async () => {
    if (!form.title.trim() || !form.image_url) return toast.error("Title and image are required");
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle || null,
      image_url: form.image_url,
      link_url: form.link_url || null,
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
    };
    const res = editing
      ? await supabase.from("banners").update(payload).eq("id", editing.id)
      : await supabase.from("banners").insert(payload);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? "Banner updated" : "Banner added");
    setOpen(false);
    router.refresh();
  };

  const toggle = async (b: Banner) => {
    const { error } = await supabase
      .from("banners")
      .update({ is_active: !b.is_active })
      .eq("id", b.id);
    if (error) return toast.error(error.message);
    router.refresh();
  };

  const remove = async () => {
    if (!toDelete) return;
    const { error } = await supabase.from("banners").delete().eq("id", toDelete.id);
    if (error) return toast.error(error.message);
    toast.success("Banner deleted");
    setToDelete(null);
    router.refresh();
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> Add Banner
        </Button>
      </div>

      {initial.length === 0 ? (
        <EmptyState title="No banners" description="Add a banner to show on the homepage." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {initial.map((b) => (
            <Card key={b.id} className="overflow-hidden">
              <div className="relative aspect-[3/1] w-full bg-muted">
                {b.image_url && <Image src={b.image_url} alt={b.title} fill className="object-cover" />}
                <span className="absolute right-2 top-2">
                  <Badge status={b.is_active ? "active" : "draft"}>
                    {b.is_active ? "Active" : "Hidden"}
                  </Badge>
                </span>
              </div>
              <CardContent className="flex items-center justify-between gap-2 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{b.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{b.subtitle}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button variant="outline" size="sm" onClick={() => toggle(b)}>
                    {b.is_active ? "Disable" : "Enable"}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(b)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setToDelete(b)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit banner" : "Add banner"}>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          </div>
          <div>
            <Label>Image</Label>
            {form.image_url && (
              <div className="relative mb-2 aspect-[3/1] w-full overflow-hidden rounded-md border">
                <Image src={form.image_url} alt="" fill className="object-cover" />
              </div>
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted">
              {uploading ? <Upload className="h-4 w-4 animate-pulse" /> : <Upload className="h-4 w-4" />}
              {uploading ? "Uploading…" : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => upload(e.target.files?.[0])}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Link URL (optional)</Label>
              <Input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} />
            </div>
            <div>
              <Label>Sort order</Label>
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
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
              {editing ? "Save" : "Add banner"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={remove}
        title="Delete banner?"
        message={`"${toDelete?.title}" will be removed.`}
        confirmText="Delete"
      />
    </>
  );
}
