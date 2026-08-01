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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open menu"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <h1 className="flex-1 truncate text-lg font-semibold">
        {title ?? "Dashboard"}
      </h1>

      <NotificationBell userId={profile.id} initialCount={unreadCount} />
      <ThemeToggle />

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-secondary"
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
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {initials(profile.full_name)}
            </span>
          )}
          <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border bg-card shadow-xl animate-fade-in">
            <div className="border-b px-4 py-3">
              <p className="truncate text-sm font-medium">
                {profile.full_name ?? "User"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {profile.email}
              </p>
            </div>
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary"
            >
              <UserIcon className="h-4 w-4" /> Profile
            </Link>
            <button
              onClick={handleLogout}
              className={cn(
                "flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-secondary"
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
