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
        className="mb-4 flex items-center gap-2 px-2 py-2 text-lg font-bold tracking-tight"
      >
        <span aria-hidden>🛡️</span>
        <span>Admin</span>
      </Link>

      <div className="flex-1 space-y-1">
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
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </div>

      <Link
        href="/"
        onClick={onClose}
        className="mt-2 flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to site
      </Link>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r bg-card md:block">
        <div className="sticky top-0 h-screen">{nav}</div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="absolute left-0 top-0 h-full w-64 animate-fade-in border-r bg-card">
            <button
              onClick={onClose}
              className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-secondary"
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
