import Link from "next/link";
import {
  ArrowRight,
  Gift,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import type { Campaign } from "@/lib/types/database";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PrizeIllustration } from "@/components/home/prize-artwork";

export type ShowcaseStats = {
  totalEntries: number;
  winnersAnnounced: number;
  liveCampaigns: number;
};

/**
 * Stat slots show a live count once there is one worth showing, and otherwise
 * fall back to a qualitative claim. A brand-new platform would read
 * "0 Winners Announced", which reads as weaker than saying nothing — but we
 * never invent a number to fill the gap.
 */
function stat(
  count: number,
  label: string,
  fallback: { value: string; label: string },
  min = 1
) {
  return count >= min
    ? { value: `${count.toLocaleString("en-PK")}+`, label }
    : fallback;
}

export function PrizeShowcase({
  featured,
  stats,
}: {
  featured: Campaign | null;
  stats: ShowcaseStats;
}) {
  const statItems = [
    {
      icon: Users,
      ...stat(stats.totalEntries, "Total Entries", {
        value: "Rs. 1",
        label: "Entry Fee",
      }, 10),
      tone: "bg-accent text-accent-foreground",
    },
    {
      icon: Trophy,
      ...stat(stats.winnersAnnounced, "Winners Announced", {
        value: "Fair",
        label: "Random Draws",
      }),
      tone: "bg-warning/12 text-warning",
    },
    {
      icon: Gift,
      ...stat(stats.liveCampaigns, "Live Campaigns", {
        value: "Soon",
        label: "New Campaigns",
      }),
      tone: "bg-info/12 text-info",
    },
    {
      icon: ShieldCheck,
      value: "100%",
      label: "Secure Payments",
      tone: "bg-success/12 text-success",
    },
  ];

  return (
    <section
      aria-labelledby="showcase-heading"
      className="relative overflow-hidden rounded-3xl border border-border/70 bg-card shadow-card"
    >
      {/* Ambient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-50/80 via-card to-card dark:from-brand-950/40 dark:via-card dark:to-card"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-warning/10 blur-3xl"
      />

      <div className="relative grid items-center gap-10 px-6 pb-8 pt-10 sm:px-10 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:px-14 lg:pb-10 lg:pt-16">
        {/* ---------------- Copy ---------------- */}
        <div className="max-w-xl">
          <span className="chip-brand">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Trusted &amp; transparent draws
          </span>

          <h2
            id="showcase-heading"
            className="mt-5 font-display text-[2.15rem] font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            Win Big Prizes
            <br className="hidden sm:block" /> for Just{" "}
            <span className="relative inline-block whitespace-nowrap text-primary">
              Rs. 1
              <svg
                aria-hidden
                viewBox="0 0 120 10"
                preserveAspectRatio="none"
                className="absolute -bottom-1.5 left-0 h-2 w-full text-primary/25"
              >
                <path
                  d="M2 7c26-5 62-6 116-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          <p className="mt-5 max-w-md text-[0.975rem] leading-relaxed text-muted-foreground sm:text-base">
            Join thousands of players and get a chance to win amazing prizes for
            just Rs. 1 only.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={featured ? `/join/${featured.id}` : "/campaigns"}
              className="w-full sm:w-auto"
            >
              <Button size="lg" variant="gradient" className="w-full sm:w-auto">
                Join Now for Rs. 1
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/faqs" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                How It Works
                <PlayCircle className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* ---------------- Prize visual ---------------- */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          {/* Confetti */}
          <Confetti />

          <div className="relative mx-auto aspect-square w-full max-w-[22rem] lg:max-w-[24rem]">
            {/* Glow pedestal */}
            <div
              aria-hidden
              className="absolute inset-x-6 bottom-4 h-24 rounded-[50%] bg-primary/15 blur-2xl"
            />
            <PrizeIllustration
              className="h-full w-full animate-float"
              label={
                featured
                  ? `${featured.prize_name} prize illustration`
                  : "Gift box with a prize device"
              }
            />
          </div>

          {/* Mega prize card — floats over the art on desktop, stacks on mobile */}
          {featured && (
            <div className="relative z-10 mx-auto mt-5 w-full max-w-xs rounded-2xl border border-border/70 bg-card/95 p-4 shadow-lift backdrop-blur lg:absolute lg:-right-2 lg:bottom-6 lg:mt-0 xl:-right-8">
              <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-gradient text-primary-foreground">
                  <Trophy className="h-3.5 w-3.5" aria-hidden />
                </span>
                Today&apos;s Mega Prize
              </p>
              <p className="mt-2.5 line-clamp-2 font-display text-[0.9375rem] font-bold leading-snug tracking-tight">
                {featured.prize_name}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-2xl font-extrabold tabular-nums tracking-tight text-primary">
                  {formatCurrency(featured.entry_fee)}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  entry
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- Stats bar ---------------- */}
      <div className="relative px-4 pb-6 sm:px-8 sm:pb-8 lg:px-10">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/60 sm:grid-cols-4">
          {statItems.map(({ icon: Icon, value, label, tone }) => (
            <div
              key={label}
              className="flex items-center gap-3.5 bg-card px-4 py-5 transition-colors duration-300 hover:bg-secondary/50 sm:justify-center sm:px-5"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}
              >
                <Icon className="h-[1.15rem] w-[1.15rem]" aria-hidden />
              </span>
              <div className="min-w-0">
                <dd className="font-display text-xl font-extrabold tabular-nums leading-none tracking-tight sm:text-2xl">
                  {value}
                </dd>
                <dt className="mt-1.5 truncate text-xs font-medium text-muted-foreground">
                  {label}
                </dt>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Purely decorative confetti scattered around the prize art. */
function Confetti() {
  const pieces = [
    "left-[6%] top-[12%] h-3 w-3 rotate-12 rounded-[3px] bg-warning/70",
    "right-[10%] top-[6%] h-2.5 w-2.5 -rotate-12 rounded-full bg-primary/60",
    "left-[2%] top-[46%] h-2.5 w-6 -rotate-[18deg] rounded-full bg-primary/40",
    "right-[4%] top-[38%] h-3.5 w-3.5 rotate-45 rounded-[3px] bg-success/50",
    "left-[16%] bottom-[22%] h-2 w-5 rotate-[24deg] rounded-full bg-warning/60",
    "right-[16%] bottom-[16%] h-3 w-3 rotate-12 rounded-[3px] bg-primary/50",
    "left-[42%] top-[2%] h-2 w-2 rounded-full bg-warning/70",
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {pieces.map((c, i) => (
        <span
          key={i}
          className={`absolute ${c}`}
          style={{ animation: `float ${5 + i * 0.6}s ease-in-out ${i * 0.3}s infinite` }}
        />
      ))}
    </div>
  );
}
