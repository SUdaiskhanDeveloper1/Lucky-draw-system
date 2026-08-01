import { createClient } from "@/lib/supabase/server";
import { UsersTable } from "@/components/admin/users-table";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">User Management</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {data?.length ?? 0} registered users
        </p>
      </div>
      <UsersTable initial={data ?? []} />
    </div>
  );
}
