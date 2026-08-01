import { Gift, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate, initials } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/misc";
import { ReferralShare } from "@/components/dashboard/referral-share";

type ReferredProfile = {
  full_name: string | null;
  email: string | null;
  created_at: string | null;
};

type ReferralRow = {
  id: string;
  status: string;
  bonus_amount: number;
  created_at: string;
  referred: ReferredProfile | ReferredProfile[] | null;
};

export default async function ReferralsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [profileRes, referralsRes, settingRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("referral_code")
      .eq("id", user!.id)
      .single(),
    supabase
      .from("referrals")
      .select(
        "id, status, bonus_amount, created_at, referred:profiles!referrals_referred_id_fkey(full_name, email, created_at)"
      )
      .eq("referrer_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase.from("settings").select("value").eq("key", "referral").single(),
  ]);

  const code = profileRes.data?.referral_code ?? "";
  const referrals = (referralsRes.data ?? []) as unknown as ReferralRow[];
  const settings = (settingRes.data?.value ?? {}) as Record<string, unknown>;

  const bonusAmount = Number(settings.bonus_amount ?? settings.amount ?? 0);
  const bonusText =
    typeof settings.description === "string"
      ? settings.description
      : bonusAmount > 0
      ? `Earn ${formatCurrency(bonusAmount)} for every friend who signs up and joins a draw.`
      : "Invite friends and earn rewards when they join.";

  const totalEarned = referrals
    .filter((r) => r.status === "rewarded" || r.status === "approved")
    .reduce((sum, r) => sum + Number(r.bonus_amount ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* Bonus banner */}
      <div className="relative overflow-hidden rounded-2xl bg-brand-gradient p-6 text-primary-foreground shadow-card sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Gift className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight">
                Refer &amp; Earn
              </h2>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-primary-foreground/85">
                {bonusText}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-white/15 px-5 py-3 backdrop-blur">
              <p className="font-display text-2xl font-extrabold tabular-nums">
                {referrals.length}
              </p>
              <p className="text-xs text-primary-foreground/75">Referred</p>
            </div>
            <div className="rounded-xl bg-white/15 px-5 py-3 backdrop-blur">
              <p className="font-display text-2xl font-extrabold tabular-nums">
                {formatCurrency(totalEarned)}
              </p>
              <p className="text-xs text-primary-foreground/75">Earned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Share */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Share your invite</CardTitle>
        </CardHeader>
        <CardContent>
          {code ? (
            <ReferralShare code={code} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Your referral code is not available yet.
            </p>
          )}
        </CardContent>
      </Card> */}

      {/* Referred users */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <EmptyState
              title="No referrals yet"
              description="Share your link to start earning rewards."
              icon={Users}
            />
          ) : (
            <ul className="divide-y divide-border/60">
              {referrals.map((r) => {
                const ref = Array.isArray(r.referred)
                  ? r.referred[0]
                  : r.referred;
                return (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-xs font-bold text-accent-foreground">
                        {initials(ref?.full_name)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {ref?.full_name ?? "New user"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          Joined {formatDate(r.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {r.bonus_amount > 0 && (
                        <span className="text-sm font-semibold tabular-nums text-success">
                          +{formatCurrency(r.bonus_amount)}
                        </span>
                      )}
                      <Badge status={r.status} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
