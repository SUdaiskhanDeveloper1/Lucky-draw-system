"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Trophy,
  CreditCard,
  Crown,
  Image as ImageIcon,
  TicketPercent,
  FileText,
  Settings,
  BarChart3,
  ArrowLeft,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/campaigns", label: "Campaigns", icon: Trophy },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/winners", label: "Winners", icon: Crown },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/coupons", label: "Coupons", icon: TicketPercent },
  { href: "/admin/cms", label: "CMS", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export function AdminSidebar({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  const nav = (
    <nav className="flex h-full flex-col gap-1 p-3">
      <Link
        href="/admin"
        onClick={onClose}
        className="group mb-5 flex items-center gap-2.5 px-2 py-1"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground shadow-soft transition-transform duration-300 ease-out-expo group-hover:scale-105">
          <ShieldCheck className="h-[1.05rem] w-[1.05rem]" aria-hidden />
        </span>
        <span className="flex flex-col leading-none">
          <span className="font-display text-[0.9375rem] font-extrabold tracking-tight">
            Admin
          </span>
          <span className="mt-1 text-[0.6875rem] text-muted-foreground">
            Control panel
          </span>
        </span>
      </Link>

      <p className="eyebrow mb-1.5 px-3">Manage</p>

      <div className="flex-1 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(link.href + "/");
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-300 ease-out-expo",
                active
                  ? "bg-accent text-accent-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-all duration-300 ease-out-expo",
                  active ? "opacity-100" : "scale-y-0 opacity-0"
                )}
              />
              <Icon
                className={cn(
                  "h-[1.05rem] w-[1.05rem] shrink-0 transition-transform duration-300 ease-out-expo",
                  !active && "group-hover:scale-110"
                )}
              />
              {link.label}
            </Link>
          );
        })}
      </div>

      <Link
        href="/"
        onClick={onClose}
        className="mt-3 flex items-center gap-3 rounded-xl border border-border/70 px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 ease-out-expo hover:border-primary/25 hover:bg-secondary hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to site
      </Link>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-border/70 bg-card md:block">
        <div className="sticky top-0 h-screen">{nav}</div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-foreground/40 backdrop-blur-md dark:bg-background/70"
            onClick={onClose}
          />
          <aside className="absolute left-0 top-0 h-full w-[17rem] animate-slide-in-left border-r border-border/70 bg-card shadow-pop">
            <button
              onClick={onClose}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
