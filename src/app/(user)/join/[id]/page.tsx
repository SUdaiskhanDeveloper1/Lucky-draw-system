import { notFound } from "next/navigation";
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
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="text-sm text-muted-foreground">
          Complete your entry for {campaign.prize_name}
        </p>
      </div>
      <CheckoutForm campaign={campaign} methods={methods} userId={user!.id} />
    </div>
  );
}
