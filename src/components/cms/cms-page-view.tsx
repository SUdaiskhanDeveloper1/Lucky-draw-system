import { createClient } from "@/lib/supabase/server";
import type { CmsPage } from "@/lib/types/database";
import { formatDate } from "@/lib/utils";

export async function CmsPageView({
  slug,
  fallbackTitle,
  fallbackContent,
}: {
  slug: string;
  fallbackTitle: string;
  fallbackContent: string;
}) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cms_pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  const page = (data as CmsPage | null) ?? null;
  const title = page?.title || fallbackTitle;
  const content = page?.content || fallbackContent;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {page?.updated_at && (
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated {formatDate(page.updated_at)}
        </p>
      )}
      <div className="mt-8 space-y-4 leading-relaxed text-muted-foreground">
        {content
          .split(/\n{2,}/)
          .filter((p) => p.trim())
          .map((para, i) => (
            <p key={i} className="whitespace-pre-line">
              {para}
            </p>
          ))}
      </div>
    </div>
  );
}
