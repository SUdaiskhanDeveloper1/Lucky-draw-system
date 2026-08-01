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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
          onClick={onMenu}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
          <h1 className="text-lg font-semibold leading-tight">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border px-2 py-1.5 text-sm font-medium hover:bg-secondary"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {initials(email ?? "Admin")}
            </span>
            <span className="hidden max-w-[140px] truncate sm:inline">
              {email ?? "Admin"}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-2 w-48 animate-fade-in rounded-lg border bg-card p-1 shadow-lg">
                <div className="flex items-center gap-2 px-3 py-2 text-sm">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{email ?? "Admin"}</span>
                </div>
                <div className="my-1 border-t" />
                <button
                  onClick={handleLogout}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-secondary"
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
