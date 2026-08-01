import Link from "next/link";
import Image from "next/image";
import {
  Ticket as TicketIcon,
  Receipt,
  Trophy,
  Wallet as WalletIcon,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate, initials } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";
import { CampaignCard } from "@/components/shared/campaign-card";
import type { Campaign, Payment, Ticket } from "@/lib/types/database";

type TicketWithCampaign = Ticket & {
  campaigns: { prize_name: string | null; prize_image: string | null } | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // user guaranteed by layout, but keep TS happy
  const userId = user!.id;

  const [
    profileRes,
    walletRes,
    ticketsCountRes,
    paymentsCountRes,
    winsCountRes,
    recentTicketsRes,
    recentPaymentsRes,
    campaignsRes,
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("wallets").select("balance").eq("user_id", userId).single(),
    supabase
      .from("tickets")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("payments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("winners")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("tickets")
      .select("*, campaigns(prize_name, prize_image)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("payments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("campaigns")
      .select("*")
      .eq("status", "active")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const profile = profileRes.data;
  const balance = walletRes.data?.balance ?? 0;
  const totalTickets = ticketsCountRes.count ?? 0;
  const totalPayments = paymentsCountRes.count ?? 0;
  const totalWins = winsCountRes.count ?? 0;
  const recentTickets = (recentTicketsRes.data ?? []) as unknown as TicketWithCampaign[];
  const recentPayments = (recentPaymentsRes.data ?? []) as Payment[];
  const campaigns = (campaignsRes.data ?? []) as Campaign[];

  const stats = [
    {
      label: "Total Tickets",
      value: totalTickets,
      icon: TicketIcon,
      color: "text-primary",
      bg: "bg-accent",
    },
    {
      label: "Payments",
      value: totalPayments,
      icon: Receipt,
      color: "text-info",
      bg: "bg-info/12",
    },
    {
      label: "Total Wins",
      value: totalWins,
      icon: Trophy,
      color: "text-warning",
      bg: "bg-warning/12",
    },
    // {
    //   label: "Wallet Balance",
    //   value: formatCurrency(balance),
    //   icon: WalletIcon,
    //   color: "text-warning",
    //   bg: "bg-warning/10",
    // },
  ];

  return (
    <div className="space-y-7">
      {/* Welcome card */}
      <div className="relative overflow-hidden rounded-2xl bg-brand-gradient p-6 text-primary-foreground shadow-card sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-black/15 blur-3xl"
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name ?? "Avatar"}
                width={64}
                height={64}
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/25"
              />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 font-display text-xl font-bold backdrop-blur">
                {initials(profile?.full_name)}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground/70">
                Welcome back
              </p>
              <h2 className="truncate font-display text-2xl font-extrabold tracking-tight">
                {profile?.full_name ?? "there"} 👋
              </h2>
              <p className="truncate text-sm text-primary-foreground/80">
                {profile?.email}
                {profile?.phone ? ` • ${profile.phone}` : ""}
              </p>
            </div>
          </div>
          <Link href="/campaigns" className="shrink-0">
            <Button
              variant="secondary"
              className="w-full bg-white text-brand-700 hover:bg-white/90 sm:w-auto"
            >
              <Sparkles className="h-4 w-4" /> Browse campaigns
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="card-surface p-5 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-lift"
            >
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${s.bg}`}
              >
                <Icon className={`h-5 w-5 ${s.color}`} />
              </span>
              <p className="mt-4 font-display text-3xl font-extrabold tabular-nums tracking-tight">
                {s.value}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent lists */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Tickets</CardTitle>
            <Link href="/tickets">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentTickets.length === 0 ? (
              <EmptyState
                title="No tickets yet"
                description="Join a campaign to get your first ticket."
                icon={TicketIcon}
              />
            ) : (
              <ul className="divide-y divide-border/60">
                {recentTickets.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                        <TicketIcon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {t.campaigns?.prize_name ?? "Campaign"}
                        </p>
                        <p className="truncate font-mono text-xs text-muted-foreground">
                          {t.ticket_number}
                        </p>
                      </div>
                    </div>
                    <Badge status={t.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Payments</CardTitle>
            <Link href="/payments">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentPayments.length === 0 ? (
              <EmptyState
                title="No payments yet"
                description="Your payment submissions will appear here."
                icon={Receipt}
              />
            ) : (
              <ul className="divide-y divide-border/60">
                {recentPayments.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-info/12 text-info">
                        <Receipt className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold tabular-nums">
                          {formatCurrency(p.amount)}
                        </p>
                        <p className="truncate text-xs capitalize text-muted-foreground">
                          {p.method.replace("_", " ")} •{" "}
                          {formatDate(p.created_at)}
                        </p>
                      </div>
                    </div>
                    <Badge status={p.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active campaigns */}
      <div>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-bold tracking-tight">
            Active Campaigns
          </h2>
          <Link href="/campaigns">
            <Button variant="ghost" size="sm">
              Browse all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        {campaigns.length === 0 ? (
          <EmptyState
            title="No active campaigns"
            description="Check back soon for new lucky draws."
            icon={Trophy}
          />
        ) : (
          <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
