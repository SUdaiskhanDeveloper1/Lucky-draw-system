"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  Receipt,
  Bell,
  Gift,
  User,
  Trophy,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tickets", label: "My Tickets", icon: Ticket },
  { href: "/payments", label: "Payments", icon: Receipt },
  { href: "/notifications", label: "Notifications", icon: Bell },
  // { href: "/referrals", label: "Referrals", icon: Gift },
  { href: "/profile", label: "Profile", icon: User },
  // { href: "/campaigns", label: "Browse Campaigns", icon: Trophy },
];

export function Sidebar({
  open = false,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(link.href + "/");
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <div className="flex h-16 items-center justify-between border-b px-5">
      <Link
        href="/"
        onClick={onClose}
        className="flex items-center gap-2 text-lg font-bold tracking-tight"
      >
        <span aria-hidden>🎟️</span>
        <span>Rs.1 Lucky Draw</span>
      </Link>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-md p-1 text-muted-foreground hover:bg-secondary md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 border-r bg-card md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:flex-col">
        {brand}
        {nav}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r bg-card shadow-xl animate-fade-in">
            {brand}
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
