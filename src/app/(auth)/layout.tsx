import Link from "next/link";
import { ShieldCheck, Sparkles, Ticket, Trophy } from "lucide-react";
import { ThemeToggle } from "@/components/ui/misc";

const highlights = [
  {
    icon: Ticket,
    title: "Entry from just Rs.1",
    body: "One rupee is all it takes to enter a live draw.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & reviewed",
    body: "Every payment is verified by our team before your ticket is issued.",
  },
  {
    icon: Trophy,
    title: "Winners announced publicly",
    body: "Transparent draws with results published for everyone to see.",
  },
];

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Brand panel — desktop only */}
      <aside className="relative hidden overflow-hidden bg-brand-gradient lg:flex lg:w-[46%] lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-black/15 blur-3xl"
        />

        <Link
          href="/"
          className="relative flex items-center gap-2.5 text-primary-foreground"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <Ticket className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight">
            Rs.1 Lucky Draw
          </span>
        </Link>

        <div className="relative max-w-md space-y-8 text-primary-foreground">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Win big for just Rs.1
            </span>
            <h2 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight">
              Your next win starts with one rupee.
            </h2>
            <p className="text-[0.975rem] leading-relaxed text-primary-foreground/80">
              Join thousands of players entering transparent lucky draws for
              real prizes across Pakistan.
            </p>
          </div>

          <ul className="space-y-5">
            {highlights.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                  <Icon className="h-[1.15rem] w-[1.15rem]" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-0.5 text-sm text-primary-foreground/75">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-primary-foreground/60">
          Play responsibly · 18+
        </p>
      </aside>

      {/* Form panel */}
      <div className="page-wash relative flex flex-1 flex-col">
        <header className="flex items-center justify-between px-4 py-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 lg:invisible"
            aria-label="Rs.1 Lucky Draw home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient text-primary-foreground shadow-soft">
              <Ticket className="h-[1.05rem] w-[1.05rem]" aria-hidden />
            </span>
            <span className="font-display text-base font-extrabold tracking-tight">
              Rs.1 Lucky Draw
            </span>
          </Link>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 sm:py-12">
          <div className="w-full max-w-md animate-fade-in-up">{children}</div>
        </main>
      </div>
    </div>
  );
}
