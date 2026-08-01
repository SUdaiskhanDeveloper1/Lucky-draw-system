"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Bell,
  CheckCheck,
  CircleCheck,
  CircleX,
  Info,
  Trophy,
  CreditCard,
} from "lucide-react";
import type { Notification } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";

function iconFor(type: string) {
  switch (type) {
    case "payment_approved":
    case "approved":
      return CircleCheck;
    case "payment_rejected":
    case "rejected":
      return CircleX;
    case "payment":
    case "payment_submitted":
      return CreditCard;
    case "winner":
    case "win":
      return Trophy;
    case "info":
      return Info;
    default:
      return Bell;
  }
}

export function NotificationsList({
  initial,
}: {
  initial: Notification[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [items, setItems] = useState<Notification[]>(initial);
  const [busy, setBusy] = useState(false);

  const unread = items.filter((n) => !n.is_read).length;

  async function markAll() {
    if (unread === 0) return;
    setBusy(true);
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("is_read", false);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    toast.success("All notifications marked as read");
    router.refresh();
  }

  async function markOne(n: Notification) {
    if (n.is_read) return;
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", n.id);
    setItems((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x))
    );
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="No notifications"
        description="You're all caught up. New alerts will show up here."
        icon={Bell}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {unread > 0 ? `${unread} unread` : "All caught up"}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={markAll}
          loading={busy}
          disabled={unread === 0}
        >
          <CheckCheck className="h-4 w-4" /> Mark all as read
        </Button>
      </div>

      <ul className="space-y-2">
        {items.map((n) => {
          const Icon = iconFor(n.type);
          const body = (
            <div
              className={cn(
                "flex gap-3 rounded-xl border p-4 transition-colors",
                n.is_read ? "bg-card" : "border-primary/30 bg-accent/40"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  n.is_read
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary/10 text-primary"
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{n.title}</p>
                  {!n.is_read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </div>
                {n.body && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {n.body}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDateTime(n.created_at)}
                </p>
              </div>
            </div>
          );

          return (
            <li key={n.id}>
              {n.link ? (
                <Link href={n.link} onClick={() => markOne(n)}>
                  {body}
                </Link>
              ) : (
                <button
                  className="block w-full text-left"
                  onClick={() => markOne(n)}
                >
                  {body}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
