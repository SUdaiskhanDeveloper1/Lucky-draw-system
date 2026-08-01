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
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
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
