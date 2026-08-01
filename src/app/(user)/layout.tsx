import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/shell";
import type { Profile } from "@/lib/types/database";

export default async function UserLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { count: unreadCount } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  const safeProfile: Profile =
    profile ??
    ({
      id: user.id,
      email: user.email ?? null,
      full_name: null,
      phone: null,
      address: null,
      city: null,
      country: null,
      cnic: null,
      avatar_url: null,
      referral_code: null,
      referred_by: null,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Profile);

  return (
    <DashboardShell profile={safeProfile} unreadCount={unreadCount ?? 0}>
      {children}
    </DashboardShell>
  );
}
