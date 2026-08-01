"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, User as UserIcon, LogOut, ChevronDown } from "lucide-react";
import type { Profile } from "@/lib/types/database";
import { cn, initials } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/misc";
import { NotificationBell } from "@/components/dashboard/notification-bell";

export function Topbar({
  profile,
  unreadCount = 0,
  title,
  onMenuClick,
}: {
  profile: Profile;
  unreadCount?: number;
  title?: string;
  onMenuClick?: () => void;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="glass-surface sticky top-0 z-30 flex h-[4.5rem] items-center gap-3 border-b px-4 md:px-7">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open menu"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="min-w-0 flex-1">
        <p className="hidden text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:block">
          My Account
        </p>
        <h1 className="truncate font-display text-lg font-bold leading-tight tracking-tight">
          {title ?? "Dashboard"}
        </h1>
      </div>

      <NotificationBell userId={profile.id} initialCount={unreadCount} />
      <ThemeToggle />

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          className="flex items-center gap-2 rounded-full border border-border/70 bg-card p-1 pr-2.5 shadow-xs transition-all duration-300 ease-out-expo hover:border-primary/25 hover:shadow-soft"
        >
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.full_name ?? "Avatar"}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-primary-foreground">
              {initials(profile.full_name)}
            </span>
          )}
          <ChevronDown
            className={cn(
              "hidden h-4 w-4 text-muted-foreground transition-transform duration-300 ease-out-expo sm:block",
              menuOpen && "rotate-180"
            )}
          />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 mt-2.5 w-60 animate-scale-in overflow-hidden rounded-2xl border border-border/80 bg-card p-1.5 shadow-pop"
          >
            <div className="mb-1.5 flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-3">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-primary-foreground">
                  {initials(profile.full_name)}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {profile.full_name ?? "User"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {profile.email}
                </p>
              </div>
            </div>
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 hover:bg-secondary"
            >
              <UserIcon className="h-4 w-4 text-muted-foreground" /> Profile
            </Link>
            <button
              role="menuitem"
              onClick={handleLogout}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors duration-200 hover:bg-destructive/10"
              )}
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
