import Link from "next/link";
import {
  Users,
  UserPlus,
  Trophy,
  Zap,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  Ticket as TicketIcon,
  Crown,
  BadgeCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { StatCard } from "@/components/admin/stat-card";
import { RevenueChart, RegistrationsChart } from "@/components/admin/admin-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/misc";

export const dynamic = "force-dynamic";

async function count(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: string,
  build?: (q: any) => any
): Promise<number> {
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  if (build) q = build(q);
  const { count: c } = await q;
  return c ?? 0;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    todayUsers,
    totalCampaigns,
    activeCampaigns,
    completedCampaigns,
    pendingPayments,
    approvedPayments,
    rejectedPayments,
    totalTickets,
    totalWinners,
  ] = await Promise.all([
    count(supabase, "profiles"),
    count(supabase, "profiles", (q) =>
      q.gte("created_at", startOfToday.toISOString())
    ),
    count(supabase, "campaigns"),
    count(supabase, "campaigns", (q) => q.eq("status", "active")),
    count(supabase, "campaigns", (q) => q.eq("status", "completed")),
    count(supabase, "payments", (q) => q.eq("status", "pending")),
    count(supabase, "payments", (q) => q.eq("status", "approved")),
    count(supabase, "payments", (q) => q.eq("status", "rejected")),
    count(supabase, "tickets"),
    count(supabase, "winners"),
  ]);

  // Revenue + chart data from approved payments.
  const { data: approvedRows } = await supabase
    .from("payments")
    .select("amount, discount, created_at")
    .eq("status", "approved");

  const totalRevenue = (approvedRows ?? []).reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );

  // Monthly revenue over the last 6 months.
  const months: { key: string; month: string; revenue: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      month: d.toLocaleDateString("en-PK", { month: "short" }),
      revenue: 0,
    });
  }
  for (const p of approvedRows ?? []) {
    const d = new Date(p.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = months.find((m) => m.key === key);
    if (bucket) bucket.revenue += Number(p.amount) || 0;
  }

  // Daily registrations for last 14 days.
  const since = new Date();
  since.setDate(since.getDate() - 13);
  since.setHours(0, 0, 0, 0);
  const { data: recentProfiles } = await supabase
    .from("profiles")
    .select("created_at")
    .gte("created_at", since.toISOString());

  const days: { key: string; day: string; count: number }[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    days.push({
      key: d.toISOString().slice(0, 10),
      day: d.toLocaleDateString("en-PK", { day: "numeric", month: "short" }),
      count: 0,
    });
  }
  for (const p of recentProfiles ?? []) {
    const key = new Date(p.created_at).toISOString().slice(0, 10);
    const bucket = days.find((x) => x.key === key);
    if (bucket) bucket.count += 1;
  }

  // Latest panels.
  const [{ data: latestPayments }, { data: latestUsers }, { data: latestWinners }] =
    await Promise.all([
      supabase
        .from("payments")
        .select("*, profiles(full_name,email), campaigns(prize_name)")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("profiles")
        .select("id, full_name, email, created_at, status")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("winners")
        .select("*, profiles(full_name,email), campaigns(prize_name)")
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users, accent: "primary" as const },
    { label: "Today's Registrations", value: todayUsers, icon: UserPlus, accent: "success" as const },
    { label: "Total Campaigns", value: totalCampaigns, icon: Trophy, accent: "primary" as const },
    { label: "Active Campaigns", value: activeCampaigns, icon: Zap, accent: "success" as const },
    { label: "Completed Campaigns", value: completedCampaigns, icon: BadgeCheck, accent: "muted" as const },
    { label: "Pending Payments", value: pendingPayments, icon: Clock, accent: "warning" as const },
    { label: "Approved Payments", value: approvedPayments, icon: CheckCircle2, accent: "success" as const },
    { label: "Rejected Payments", value: rejectedPayments, icon: XCircle, accent: "destructive" as const },
    { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, accent: "success" as const },
    { label: "Tickets Sold", value: totalTickets, icon: TicketIcon, accent: "primary" as const },
    { label: "Total Winners", value: totalWinners, icon: Crown, accent: "warning" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueChart data={months.map(({ month, revenue }) => ({ month, revenue }))} />
        <RegistrationsChart data={days.map(({ day, count }) => ({ day, count }))} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {/* Latest payments */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Latest Payments</CardTitle>
            <Link href="/admin/payments" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            {latestPayments?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                      <th className="py-2 pr-3 font-medium">User</th>
                      <th className="py-2 pr-3 font-medium">Campaign</th>
                      <th className="py-2 pr-3 font-medium">Amount</th>
                      <th className="py-2 pr-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(latestPayments as any[]).map((p) => (
                      <tr key={p.id} className="border-b last:border-0">
                        <td className="py-2 pr-3">
                          {p.profiles?.full_name ?? p.profiles?.email ?? "—"}
                        </td>
                        <td className="py-2 pr-3 text-muted-foreground">
                          {p.campaigns?.prize_name ?? "—"}
                        </td>
                        <td className="py-2 pr-3 font-medium">
                          {formatCurrency(p.amount)}
                        </td>
                        <td className="py-2 pr-3">
                          <Badge status={p.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No payments yet" />
            )}
          </CardContent>
        </Card>

        {/* Latest users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Latest Users</CardTitle>
            <Link href="/admin/users" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {latestUsers?.length ? (
              (latestUsers as any[]).map((u) => (
                <div key={u.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {u.full_name ?? "Unnamed"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(u.created_at)}
                  </span>
                </div>
              ))
            ) : (
              <EmptyState title="No users yet" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Latest winners */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Latest Winners</CardTitle>
          <Link href="/admin/winners" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent className="pt-0">
          {latestWinners?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Winner</th>
                    <th className="py-2 pr-3 font-medium">Prize</th>
                    <th className="py-2 pr-3 font-medium">Announced</th>
                  </tr>
                </thead>
                <tbody>
                  {(latestWinners as any[]).map((w) => (
                    <tr key={w.id} className="border-b last:border-0">
                      <td className="py-2 pr-3">
                        {w.profiles?.full_name ?? w.profiles?.email ?? "—"}
                      </td>
                      <td className="py-2 pr-3 text-muted-foreground">
                        {w.prize_name ?? w.campaigns?.prize_name ?? "—"}
                      </td>
                      <td className="py-2 pr-3 text-muted-foreground">
                        {formatDateTime(w.announced_at ?? w.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No winners drawn yet" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
