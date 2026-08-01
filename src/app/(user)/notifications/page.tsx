import { createClient } from "@/lib/supabase/server";
import { NotificationsList } from "@/components/dashboard/notifications-list";
import type { Notification } from "@/lib/types/database";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return <NotificationsList initial={(data ?? []) as Notification[]} />;
}
