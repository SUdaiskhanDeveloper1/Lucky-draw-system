import { createClient } from "@/lib/supabase/server";
import { CmsEditor } from "@/components/admin/cms-editor";

export const dynamic = "force-dynamic";

export default async function AdminCmsPage() {
  const supabase = await createClient();
  const [{ data: pages }, { data: faqs }] = await Promise.all([
    supabase.from("cms_pages").select("*"),
    supabase.from("faqs").select("*").order("sort_order", { ascending: true }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Content Management</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Edit site pages and FAQs
        </p>
      </div>
      <CmsEditor pages={pages ?? []} faqs={faqs ?? []} />
    </div>
  );
}
