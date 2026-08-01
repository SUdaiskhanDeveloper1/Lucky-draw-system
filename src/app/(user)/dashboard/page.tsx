import Link from "next/link";
import Image from "next/image";
import {
  Ticket as TicketIcon,
  Receipt,
  Trophy,
  Wallet as WalletIcon,
  ArrowRight,
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
      bg: "bg-primary/10",
    },
    {
      label: "Payments",
      value: totalPayments,
      icon: Receipt,
      color: "text-accent-foreground",
      bg: "bg-accent",
    },
    {
      label: "Total Wins",
      value: totalWins,
      icon: Trophy,
      color: "text-success",
      bg: "bg-success/10",
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
    <div className="space-y-6">
      {/* Welcome card */}
      <Card>
        <CardContent className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name ?? "Avatar"}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                {initials(profile?.full_name)}
              </span>
            )}
            <div>
              <h2 className="text-xl font-semibold">
                Welcome back, {profile?.full_name ?? "there"} 👋
              </h2>
              <p className="text-sm text-muted-foreground">
                {profile?.email}
                {profile?.phone ? ` • ${profile.phone}` : ""}
              </p>
            </div>
          </div>
          {/* <div className="flex items-center gap-3">
            {profile?.status && <Badge status={profile.status} />}
            <div className="rounded-lg border bg-muted px-4 py-2 text-right">
              <p className="text-xs text-muted-foreground">Wallet</p>
              <p className="font-semibold">{formatCurrency(balance)}</p>
            </div>
          </div> */}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card-surface p-5">
              <div className="flex items-center justify-between">
                <span className={`rounded-lg p-2 ${s.bg}`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
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
              <ul className="divide-y">
                {recentTickets.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {t.campaigns?.prize_name ?? "Campaign"}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {t.ticket_number}
                      </p>
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
              <ul className="divide-y">
                {recentPayments.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {formatCurrency(p.amount)}
                      </p>
                      <p className="text-xs capitalize text-muted-foreground">
                        {p.method.replace("_", " ")} • {formatDate(p.created_at)}
                      </p>
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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Active Campaigns</h2>
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
