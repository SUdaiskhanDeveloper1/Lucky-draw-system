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

/** Tone the icon chip by notification type so the list scans quickly. */
function toneFor(type: string) {
  switch (type) {
    case "payment_approved":
    case "approved":
      return "bg-success/12 text-success";
    case "payment_rejected":
    case "rejected":
      return "bg-destructive/12 text-destructive";
    case "winner":
    case "win":
      return "bg-warning/12 text-warning";
    case "payment":
    case "payment_submitted":
      return "bg-info/12 text-info";
    default:
      return "bg-accent text-accent-foreground";
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
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {unread > 0 ? (
            <>
              <span className="font-semibold tabular-nums text-foreground">
                {unread}
              </span>{" "}
              unread
            </>
          ) : (
            "All caught up"
          )}
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

      <ul className="space-y-2.5">
        {items.map((n) => {
          const Icon = iconFor(n.type);
          const body = (
            <div
              className={cn(
                "flex gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ease-out-expo hover:shadow-soft sm:p-5",
                n.is_read
                  ? "border-border/70 bg-card"
                  : "border-primary/25 bg-accent/50"
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  n.is_read
                    ? "bg-muted text-muted-foreground"
                    : toneFor(n.type)
                )}
              >
                <Icon className="h-[1.15rem] w-[1.15rem]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p
                    className={cn(
                      "text-[0.9375rem] leading-snug",
                      n.is_read ? "font-medium" : "font-semibold"
                    )}
                  >
                    {n.title}
                  </p>
                  {!n.is_read && (
                    <span
                      aria-label="Unread"
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                    />
                  )}
                </div>
                {n.body && (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {n.body}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDateTime(n.created_at)}
                </p>
              </div>
            </div>
          );

          return (
            <li key={n.id}>
              {n.link ? (
                <Link href={n.link} onClick={() => markOne(n)} className="block">
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
