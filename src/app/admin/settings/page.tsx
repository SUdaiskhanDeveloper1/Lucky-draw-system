import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const [{ data: settings }, { data: methods }] = await Promise.all([
    supabase.from("settings").select("*"),
    supabase.from("payment_methods").select("*").order("sort_order", { ascending: true }),
  ]);

  const byKey: Record<string, any> = {};
  for (const s of settings ?? []) byKey[s.key] = s.value ?? {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Settings</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Configure your platform
        </p>
      </div>
      <SettingsForm
        general={byKey.general ?? {}}
        contact={byKey.contact ?? {}}
        social={byKey.social ?? {}}
        referral={byKey.referral ?? {}}
        email={byKey.email ?? {}}
        sms={byKey.sms ?? {}}
        methods={methods ?? []}
      />
    </div>
  );
}
