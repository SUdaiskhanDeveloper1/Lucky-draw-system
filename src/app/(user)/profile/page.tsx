import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/dashboard/profile-form";
import type { Profile } from "@/lib/types/database";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  if (!profile) {
    return (
      <p className="text-sm text-muted-foreground">Unable to load profile.</p>
    );
  }

  return <ProfileForm profile={profile as Profile} />;
}
