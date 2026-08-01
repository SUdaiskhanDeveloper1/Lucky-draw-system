"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { PaymentMethod } from "@/lib/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

type Group = Record<string, any>;

export function SettingsForm({
  general,
  contact,
  social,
  referral,
  email,
  sms,
  methods,
}: {
  general: Group;
  contact: Group;
  social: Group;
  referral: Group;
  email: Group;
  sms: Group;
  methods: PaymentMethod[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [g, setG] = useState<Group>(general ?? {});
  const [c, setC] = useState<Group>(contact ?? {});
  const [s, setS] = useState<Group>(social ?? {});
  const [r, setR] = useState<Group>(referral ?? {});
  const [em, setEm] = useState<Group>(email ?? {});
  const [sm, setSm] = useState<Group>(sms ?? {});
  const [pm, setPm] = useState<PaymentMethod[]>(methods ?? []);
  const [busy, setBusy] = useState<string | null>(null);

  const saveGroup = async (key: string, value: Group) => {
    setBusy(key);
    const { error } = await supabase.from("settings").upsert({ key, value }, { onConflict: "key" });
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    router.refresh();
  };

  const savePaymentMethods = async () => {
    setBusy("methods");
    for (const m of pm) {
      const { error } = await supabase
        .from("payment_methods")
        .update({
          account_title: m.account_title,
          account_number: m.account_number,
          bank_name: m.bank_name,
          iban: m.iban,
          instructions: m.instructions,
          is_active: m.is_active,
        })
        .eq("id", m.id);
      if (error) {
        setBusy(null);
        return toast.error(error.message);
      }
    }
    setBusy(null);
    toast.success("Payment details saved");
    router.refresh();
  };

  const setMethod = (id: string, patch: Partial<PaymentMethod>) =>
    setPm((arr) => arr.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const field = (
    label: string,
    value: string | number | undefined,
    onChange: (v: string) => void,
    type = "text"
  ) => (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* General */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {field("Website name", g.site_name, (v) => setG({ ...g, site_name: v }))}
          {field("Logo URL", g.logo_url, (v) => setG({ ...g, logo_url: v }))}
          {field("Favicon URL", g.favicon_url, (v) => setG({ ...g, favicon_url: v }))}
          <div>
            <Label>Primary color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={g.primary_color ?? "#7c3aed"}
                onChange={(e) => setG({ ...g, primary_color: e.target.value })}
                className="h-10 w-14 rounded-lg border"
              />
              <Input
                value={g.primary_color ?? ""}
                onChange={(e) => setG({ ...g, primary_color: e.target.value })}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!g.maintenance_mode}
              onChange={(e) => setG({ ...g, maintenance_mode: e.target.checked })}
            />
            Maintenance mode
          </label>
          <Button loading={busy === "general"} onClick={() => saveGroup("general", g)}>
            Save general
          </Button>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {field("Email", c.email, (v) => setC({ ...c, email: v }))}
          {field("Phone", c.phone, (v) => setC({ ...c, phone: v }))}
          {field("WhatsApp", c.whatsapp, (v) => setC({ ...c, whatsapp: v }))}
          {field("Address", c.address, (v) => setC({ ...c, address: v }))}
          <Button loading={busy === "contact"} onClick={() => saveGroup("contact", c)}>
            Save contact
          </Button>
        </CardContent>
      </Card>

      {/* Social */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {field("Facebook", s.facebook, (v) => setS({ ...s, facebook: v }))}
          {field("Instagram", s.instagram, (v) => setS({ ...s, instagram: v }))}
          {field("YouTube", s.youtube, (v) => setS({ ...s, youtube: v }))}
          {field("TikTok", s.tiktok, (v) => setS({ ...s, tiktok: v }))}
          <Button loading={busy === "social"} onClick={() => saveGroup("social", s)}>
            Save social
          </Button>
        </CardContent>
      </Card>

      {/* Referral */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Referral</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {field("Referral bonus (Rs.)", r.referral_bonus, (v) => setR({ ...r, referral_bonus: Number(v) }), "number")}
          {field("Referral commission (%)", r.referral_commission, (v) => setR({ ...r, referral_commission: Number(v) }), "number")}
          <Button loading={busy === "referral"} onClick={() => saveGroup("referral", r)}>
            Save referral
          </Button>
        </CardContent>
      </Card>

      {/* Email */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Email Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {field("From name", em.from_name, (v) => setEm({ ...em, from_name: v }))}
          {field("From email", em.from_email, (v) => setEm({ ...em, from_email: v }))}
          <Button loading={busy === "email"} onClick={() => saveGroup("email", em)}>
            Save email
          </Button>
        </CardContent>
      </Card>

      {/* SMS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">SMS Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {field("Provider", sm.provider, (v) => setSm({ ...sm, provider: v }))}
          {field("API key", sm.api_key, (v) => setSm({ ...sm, api_key: v }))}
          <Button loading={busy === "sms"} onClick={() => saveGroup("sms", sm)}>
            Save SMS
          </Button>
        </CardContent>
      </Card>

      {/* Payment methods */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {pm.map((m) => (
            <div key={m.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium capitalize">{String(m.method).replace("_", " ")}</p>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={m.is_active}
                    onChange={(e) => setMethod(m.id, { is_active: e.target.checked })}
                  />
                  Active
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Account title</Label>
                  <Input
                    value={m.account_title ?? ""}
                    onChange={(e) => setMethod(m.id, { account_title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{m.method === "bank_transfer" ? "Account number" : "Mobile number"}</Label>
                  <Input
                    value={m.account_number ?? ""}
                    onChange={(e) => setMethod(m.id, { account_number: e.target.value })}
                  />
                </div>
                {m.method === "bank_transfer" && (
                  <>
                    <div>
                      <Label>Bank name</Label>
                      <Input
                        value={m.bank_name ?? ""}
                        onChange={(e) => setMethod(m.id, { bank_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>IBAN</Label>
                      <Input
                        value={m.iban ?? ""}
                        onChange={(e) => setMethod(m.id, { iban: e.target.value })}
                      />
                    </div>
                  </>
                )}
                <div className="sm:col-span-2">
                  <Label>Instructions</Label>
                  <Input
                    value={m.instructions ?? ""}
                    onChange={(e) => setMethod(m.id, { instructions: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button loading={busy === "methods"} onClick={savePaymentMethods}>
            Save payment methods
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
