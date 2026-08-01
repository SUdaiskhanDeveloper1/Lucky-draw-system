"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function NotificationBell({
  userId,
  initialCount = 0,
}: {
  userId: string;
  initialCount?: number;
}) {
  const router = useRouter();
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const supabase = createClient();

    async function refetch() {
      const { count: c } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false);
      setCount(c ?? 0);
    }

    refetch();

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Notifications"
      className="relative"
      onClick={() => router.push("/notifications")}
    >
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Button>
  );
}
