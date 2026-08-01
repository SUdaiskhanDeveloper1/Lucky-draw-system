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
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Content Management</h1>
        <p className="text-sm text-muted-foreground">
          Edit site pages and FAQs
        </p>
      </div>
      <CmsEditor pages={pages ?? []} faqs={faqs ?? []} />
    </div>
  );
}
