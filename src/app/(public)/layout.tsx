import { createClient } from "@/lib/supabase/server";
import type { Setting } from "@/lib/types/database";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("*");

  const settings = (data ?? []) as Setting[];
  const byKey = (key: string) =>
    (settings.find((s) => s.key === key)?.value ?? {}) as Record<
      string,
      unknown
    >;

  const general = byKey("general");
  const social = byKey("social");

  const siteName =
    typeof general.site_name === "string" ? general.site_name : undefined;

  const str = (v: unknown) => (typeof v === "string" ? v : null);

  return (
    <div className="page-wash flex min-h-screen flex-col">
      <Navbar siteName={siteName} />
      <main className="flex-1">{children}</main>
      <Footer
        siteName={siteName}
        facebook={str(social.facebook)}
        instagram={str(social.instagram)}
        youtube={str(social.youtube)}
      />
    </div>
  );
}
