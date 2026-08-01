"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { cn, initials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/misc";

const titles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/users": "Users",
  "/admin/campaigns": "Campaigns",
  "/admin/payments": "Payments",
  "/admin/winners": "Winners",
  "/admin/banners": "Banners",
  "/admin/coupons": "Coupons",
  "/admin/cms": "CMS Pages",
  "/admin/settings": "Settings",
  "/admin/reports": "Reports",
};

export function AdminTopbar({
  onMenu,
  email,
}: {
  onMenu?: () => void;
  email?: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const title =
    titles[pathname] ??
    (Object.keys(titles)
      .filter((k) => k !== "/admin" && pathname.startsWith(k))
      .sort((a, b) => b.length - a.length)[0]
      ? titles[
          Object.keys(titles)
            .filter((k) => k !== "/admin" && pathname.startsWith(k))
            .sort((a, b) => b.length - a.length)[0]
        ]
      : "Admin");

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="glass-surface sticky top-0 z-30 flex h-[4.5rem] items-center justify-between gap-4 border-b px-4 md:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
          onClick={onMenu}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Admin Panel
          </p>
          <h1 className="truncate font-display text-lg font-bold leading-tight tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2 rounded-full border border-border/70 bg-card p-1 pr-2.5 text-sm font-medium shadow-xs transition-all duration-300 ease-out-expo hover:border-primary/25 hover:shadow-soft"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-primary-foreground">
              {initials(email ?? "Admin")}
            </span>
            <span className="hidden max-w-[140px] truncate sm:inline">
              {email ?? "Admin"}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-300 ease-out-expo",
                menuOpen && "rotate-180"
              )}
            />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div
                role="menu"
                className="absolute right-0 z-20 mt-2.5 w-56 animate-scale-in overflow-hidden rounded-2xl border border-border/80 bg-card p-1.5 shadow-pop"
              >
                <div className="mb-1 flex items-center gap-2.5 rounded-xl bg-muted/60 px-3 py-2.5 text-sm">
                  <UserIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{email ?? "Admin"}</span>
                </div>
                <button
                  role="menuitem"
                  onClick={handleLogout}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors duration-200 hover:bg-destructive/10"
                  )}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
