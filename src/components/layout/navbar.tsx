"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Ticket, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/misc";

const links = [
  { href: "/", label: "Home" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/winners", label: "Winners" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ siteName }: { siteName?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Elevate the header once the page scrolls away from the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep the body from scrolling behind the mobile drawer.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const brand = siteName || "Rs.1 Lucky Draw";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300 ease-out-expo",
        scrolled
          ? "glass-surface border-border/70 shadow-soft"
          : "border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground shadow-soft transition-transform duration-300 ease-out-expo group-hover:scale-105 group-hover:rotate-3">
            <Ticket className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-display text-[1.0625rem] font-extrabold tracking-tight sm:inline">
            {brand}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 rounded-full border border-border/70 bg-card/60 p-1 shadow-xs backdrop-blur md:flex">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ease-out-expo",
                  active
                    ? "bg-accent text-accent-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="gradient" size="sm" className="px-5">
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="animate-fade-in border-t border-border/70 bg-card/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-xl px-4 py-3 text-[0.9375rem] font-medium transition-colors duration-200",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-3 flex gap-3 border-t border-border/70 pt-4">
              <Link href="/login" className="flex-1" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/signup" className="flex-1" onClick={() => setOpen(false)}>
                <Button variant="gradient" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
