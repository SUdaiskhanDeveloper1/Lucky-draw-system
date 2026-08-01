import { CalendarClock } from "lucide-react";
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
    <>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <header className="border-b border-border/70 pb-8">
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-[2.5rem] sm:leading-[1.1]">
            {title}
          </h1>
          {page?.updated_at && (
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarClock className="h-4 w-4" aria-hidden />
              Last updated {formatDate(page.updated_at)}
            </p>
          )}
        </header>

        <div className="rich-text mt-8">
          {content
            .split(/\n{2,}/)
            .filter((p) => p.trim())
            .map((para, i) => (
              <p key={i} className="whitespace-pre-line">
                {para}
              </p>
            ))}
        </div>
      </article>
    </>
  );
}
