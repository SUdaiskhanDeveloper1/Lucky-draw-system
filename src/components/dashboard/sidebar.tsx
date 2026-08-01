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
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(link.href + "/");
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
            {/* Active rail */}
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-all duration-300 ease-out-expo",
                active ? "opacity-100" : "scale-y-0 opacity-0"
              )}
            />
            <Icon
              className={cn(
                "h-[1.15rem] w-[1.15rem] shrink-0 transition-transform duration-300 ease-out-expo",
                !active && "group-hover:scale-110"
              )}
            />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <div className="flex h-[4.5rem] items-center justify-between border-b border-border/70 px-5">
      <Link
        href="/"
        onClick={onClose}
        className="group flex items-center gap-2.5"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground shadow-soft transition-transform duration-300 ease-out-expo group-hover:scale-105">
          <Ticket className="h-[1.05rem] w-[1.05rem]" aria-hidden />
        </span>
        <span className="font-display text-[0.9375rem] font-extrabold tracking-tight">
          Rs.1 Lucky Draw
        </span>
      </Link>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );

  const promo = (
    <div className="p-3">
      <div className="relative overflow-hidden rounded-2xl bg-brand-gradient p-4 text-primary-foreground">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/15 blur-2xl"
        />
        <Sparkles className="relative mb-2 h-5 w-5" aria-hidden />
        <p className="relative text-sm font-semibold leading-snug">
          New draws are live
        </p>
        <p className="relative mt-1 text-xs leading-relaxed text-primary-foreground/80">
          Enter for just Rs.1 and win big.
        </p>
        <Link href="/campaigns" onClick={onClose} className="relative mt-3 block">
          <Button
            size="sm"
            variant="secondary"
            className="w-full bg-white text-brand-700 hover:bg-white/90"
          >
            Browse campaigns
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-border/70 bg-card md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:flex-col">
        {brand}
        {nav}
        {promo}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-foreground/40 backdrop-blur-md dark:bg-background/70"
            onClick={onClose}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[17rem] animate-slide-in-left flex-col border-r border-border/70 bg-card shadow-pop">
            {brand}
            {nav}
            {promo}
          </aside>
        </div>
      )}
    </>
  );
}
