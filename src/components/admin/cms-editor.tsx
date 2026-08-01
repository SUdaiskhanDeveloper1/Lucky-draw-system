"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import type { CmsPage, Faq } from "@/lib/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const PAGE_SLUGS = ["about", "terms", "privacy", "refund", "contact"] as const;

export function CmsEditor({
  pages,
  faqs,
}: {
  pages: CmsPage[];
  faqs: Faq[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [tab, setTab] = useState<(typeof PAGE_SLUGS)[number]>("about");

  const current = pages.find((p) => p.slug === tab);
  const [title, setTitle] = useState(current?.title ?? "");
  const [content, setContent] = useState(current?.content ?? "");
  const [saving, setSaving] = useState(false);

  const switchTab = (slug: (typeof PAGE_SLUGS)[number]) => {
    setTab(slug);
    const p = pages.find((x) => x.slug === slug);
    setTitle(p?.title ?? slug);
    setContent(p?.content ?? "");
  };

  const savePage = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("cms_pages")
      .upsert({ slug: tab, title, content }, { onConflict: "slug" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Page saved");
    router.refresh();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Content Pages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PAGE_SLUGS.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={tab === s ? "default" : "outline"}
                className="capitalize"
                onClick={() => switchTab(s)}
              >
                {s}
              </Button>
            ))}
          </div>
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Content</Label>
            <Textarea
              className="min-h-[220px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <Button onClick={savePage} loading={saving}>
            Save page
          </Button>
        </CardContent>
      </Card>

      {/* FAQs */}
      <FaqEditor initial={faqs} />
    </div>
  );
}

function FaqEditor({ initial }: { initial: Faq[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [items, setItems] = useState<Partial<Faq>[]>(
    initial.length ? initial : [{ question: "", answer: "", sort_order: 0, is_active: true }]
  );
  const [saving, setSaving] = useState(false);

  const update = (i: number, patch: Partial<Faq>) =>
    setItems((arr) => arr.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  const add = () =>
    setItems((arr) => [...arr, { question: "", answer: "", sort_order: arr.length, is_active: true }]);

  const removeRow = async (i: number) => {
    const row = items[i];
    if (row.id) {
      const { error } = await supabase.from("faqs").delete().eq("id", row.id);
      if (error) return toast.error(error.message);
    }
    setItems((arr) => arr.filter((_, j) => j !== i));
    toast.success("Removed");
    router.refresh();
  };

  const saveAll = async () => {
    setSaving(true);
    for (let i = 0; i < items.length; i++) {
      const row = items[i];
      if (!row.question?.trim()) continue;
      const payload = {
        question: row.question,
        answer: row.answer ?? "",
        sort_order: i,
        is_active: row.is_active ?? true,
      };
      const res = row.id
        ? await supabase.from("faqs").update(payload).eq("id", row.id)
        : await supabase.from("faqs").insert(payload);
      if (res.error) {
        setSaving(false);
        return toast.error(res.error.message);
      }
    }
    setSaving(false);
    toast.success("FAQs saved");
    router.refresh();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">FAQs</CardTitle>
        <Button size="sm" variant="outline" onClick={add}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((f, i) => (
          <div key={f.id ?? i} className="space-y-2 rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <Input
                value={f.question ?? ""}
                onChange={(e) => update(i, { question: e.target.value })}
                placeholder="Question"
              />
              <Button variant="ghost" size="icon" onClick={() => removeRow(i)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <Textarea
              value={f.answer ?? ""}
              onChange={(e) => update(i, { answer: e.target.value })}
              placeholder="Answer"
              className="min-h-[70px]"
            />
          </div>
        ))}
        <Button onClick={saveAll} loading={saving}>
          Save FAQs
        </Button>
      </CardContent>
    </Card>
  );
}
