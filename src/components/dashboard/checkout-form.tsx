"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Ticket as TicketIcon,
  Upload,
  CheckCircle2,
  Tag,
  Landmark,
  Smartphone,
} from "lucide-react";
import type { Campaign, PaymentMethod, PaymentChannel } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/client";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Countdown } from "@/components/shared/countdown";

const methodLabels: Record<PaymentChannel, string> = {
  easypaisa: "Easypaisa",
  jazzcash: "JazzCash",
  bank_transfer: "Bank Transfer",
  wallet: "Wallet",
};

type AppliedCoupon = {
  id: string;
  code: string;
  discount: number;
};

export function CheckoutForm({
  campaign,
  methods,
  userId,
}: {
  campaign: Campaign;
  methods: PaymentMethod[];
  userId: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [selected, setSelected] = useState<PaymentMethod | null>(
    methods[0] ?? null
  );
  const [transactionId, setTransactionId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [note, setNote] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [applied, setApplied] = useState<AppliedCoupon | null>(null);
  const [checking, setChecking] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const discount = applied?.discount ?? 0;
  const total = useMemo(
    () => Math.max(0, campaign.entry_fee - discount),
    [campaign.entry_fee, discount]
  );

  async function applyCoupon() {
    const code = couponCode.trim();
    if (!code) return;
    setChecking(true);
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .ilike("code", code)
      .eq("is_active", true)
      .maybeSingle();
    setChecking(false);

    if (error || !data) {
      toast.error("Invalid coupon code");
      setApplied(null);
      return;
    }
    if (data.expiry_date && new Date(data.expiry_date).getTime() < Date.now()) {
      toast.error("This coupon has expired");
      setApplied(null);
      return;
    }
    if (
      data.usage_limit != null &&
      data.used_count >= data.usage_limit
    ) {
      toast.error("This coupon has reached its usage limit");
      setApplied(null);
      return;
    }

    const raw =
      data.type === "percentage"
        ? (campaign.entry_fee * data.value) / 100
        : data.value;
    const d = Math.min(campaign.entry_fee, Math.round(raw));
    setApplied({ id: data.id, code: data.code, discount: d });
    toast.success(`Coupon applied — ${formatCurrency(d)} off`);
  }

  function removeCoupon() {
    setApplied(null);
    setCouponCode("");
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast.error("Receipt must be under 5MB");
      return;
    }
    setFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) {
      toast.error("Select a payment method");
      return;
    }
    if (!transactionId.trim()) {
      toast.error("Enter the transaction ID");
      return;
    }
    if (!senderNumber.trim()) {
      toast.error("Enter the sender number");
      return;
    }
    setSubmitting(true);
    try {
      // Receipt is optional — only upload when the user picked a file.
      let receiptPath: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop();
        receiptPath = `${userId}/${Date.now()}-receipt.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("payment-receipts")
          .upload(receiptPath, file, { upsert: false });
        if (upErr) throw upErr;
      }

      const { error: insErr } = await supabase.from("payments").insert({
        user_id: userId,
        campaign_id: campaign.id,
        amount: total,
        method: selected.method,
        transaction_id: transactionId.trim(),
        sender_number: senderNumber.trim(),
        receipt_url: receiptPath,
        note: note.trim() || null,
        coupon_id: applied?.id ?? null,
        discount,
        status: "pending",
      });
      if (insErr) throw insErr;

      toast.success("Payment submitted for review!");
      router.push("/payments");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Summary */}
      <div className="space-y-4 lg:col-span-1">
        <Card>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-muted">
            {campaign.prize_image ? (
              <Image
                src={campaign.prize_image}
                alt={campaign.prize_name}
                fill
                sizes="(max-width:1024px) 100vw, 33vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <TicketIcon className="h-10 w-10" />
              </div>
            )}
          </div>
          <CardContent className="space-y-3 pt-4">
            <h2 className="text-lg font-semibold">{campaign.prize_name}</h2>
            {campaign.end_date && (
              <div className="rounded-lg border bg-muted p-3">
                <p className="mb-1 text-xs text-muted-foreground">Ends in</p>
                <Countdown target={campaign.end_date} />
              </div>
            )}
            <div className="space-y-2 border-t pt-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entry fee</span>
                <span>{formatCurrency(campaign.entry_fee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Coupon ({applied?.code})</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 text-base font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment methods */}
          <Card>
            <CardHeader>
              <CardTitle>Choose payment method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {methods.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No payment methods are configured. Please contact support.
                </p>
              )}
              {methods.map((m) => {
                const active = selected?.id === m.id;
                const Icon =
                  m.method === "bank_transfer" ? Landmark : Smartphone;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelected(m)}
                    className={cn(
                      "w-full rounded-xl border p-4 text-left transition-colors",
                      active
                        ? "border-primary bg-accent/40 ring-1 ring-primary"
                        : "hover:bg-secondary"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 font-medium">
                        <Icon className="h-4 w-4" />
                        {methodLabels[m.method] ?? m.method}
                      </span>
                      {active && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    {active && (
                      <dl className="mt-3 space-y-1 border-t pt-3 text-sm">
                        {m.bank_name && (
                          <Row label="Bank" value={m.bank_name} />
                        )}
                        {m.account_title && (
                          <Row label="Account Title" value={m.account_title} />
                        )}
                        {m.account_number && (
                          <Row
                            label="Account Number"
                            value={m.account_number}
                          />
                        )}
                        {m.iban && <Row label="IBAN" value={m.iban} />}
                        {m.instructions && (
                          <p className="pt-1 text-xs text-muted-foreground">
                            {m.instructions}
                          </p>
                        )}
                      </dl>
                    )}
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Payment proof */}
          <Card>
            <CardHeader>
              <CardTitle>Payment details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="txn">Transaction ID</Label>
                  <Input
                    id="txn"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. 1234567890"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sender">Sender Number</Label>
                  <Input
                    id="sender"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    placeholder="03xx-xxxxxxx"
                    required
                  />
                </div>
              </div>

              {/* Coupon */}
              {/* <div>
                <Label htmlFor="coupon">Coupon code (optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    disabled={!!applied}
                  />
                  {applied ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={removeCoupon}
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={applyCoupon}
                      loading={checking}
                    >
                      <Tag className="h-4 w-4" /> Apply
                    </Button>
                  )}
                </div>
              </div> */}

              <div>
                <Label htmlFor="note">Note (optional)</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Anything the reviewer should know"
                />
              </div>

              {/* Receipt upload */}
              {/* <div>
                <Label>Payment receipt (optional)</Label>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center transition-colors hover:bg-secondary"
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  {file ? (
                    <span className="text-sm font-medium">{file.name}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Click to upload a screenshot (max 5MB)
                    </span>
                  )}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={onFile}
                />
                {file && (
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    className="mt-2 text-xs text-muted-foreground underline"
                  >
                    Remove receipt
                  </button>
                )}
              </div> */}

              <Button
                type="submit"
                className="w-full"
                loading={submitting}
                disabled={methods.length === 0}
              >
                Submit payment • {formatCurrency(total)}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Your payment will be reviewed by our team. You&apos;ll be
                notified once it&apos;s approved.
              </p>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
