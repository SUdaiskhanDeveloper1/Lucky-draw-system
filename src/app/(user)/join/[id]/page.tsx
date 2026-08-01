import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CheckoutForm } from "@/components/dashboard/checkout-form";
import type { Campaign, PaymentMethod } from "@/lib/types/database";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [campaignRes, methodsRes] = await Promise.all([
    supabase.from("campaigns").select("*").eq("id", id).single(),
    supabase
      .from("payment_methods")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  const campaign = campaignRes.data as Campaign | null;
  if (!campaign) notFound();

  const methods = (methodsRes.data ?? []) as PaymentMethod[];

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <div>
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground"
        >
          <Link
            href="/campaigns"
            className="transition-colors duration-200 hover:text-primary"
          >
            Campaigns
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
          <span className="font-medium text-foreground">Checkout</span>
        </nav>
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          Checkout
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Complete your entry for{" "}
          <span className="font-medium text-foreground">
            {campaign.prize_name}
          </span>
        </p>
      </div>
      <CheckoutForm campaign={campaign} methods={methods} userId={user!.id} />
    </div>
  );
}
