"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Camera, Copy, Check, Loader2, Save } from "lucide-react";
import type { Profile } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/client";
import { initials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    full_name: profile.full_name ?? "",
    phone: profile.phone ?? "",
    address: profile.address ?? "",
    city: profile.city ?? "",
    country: profile.country ?? "",
    cnic: profile.cnic ?? "",
  });
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${profile.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);

      const { error: dbErr } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", profile.id);
      if (dbErr) throw dbErr;

      setAvatarUrl(publicUrl);
      toast.success("Avatar updated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name || null,
        phone: form.phone || null,
        address: form.address || null,
        city: form.city || null,
        country: form.country || null,
        cnic: form.cnic || null,
      })
      .eq("id", profile.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile updated");
    router.refresh();
  }

  function copyCode() {
    if (!profile.referral_code) return;
    navigator.clipboard.writeText(profile.referral_code);
    setCopied(true);
    toast.success("Referral code copied");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Avatar + meta */}
      <Card className="h-fit lg:col-span-1">
        <CardContent className="flex flex-col items-center gap-5 p-7 text-center">
          <div className="relative">
            <div className="rounded-full bg-brand-gradient p-1">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={form.full_name || "Avatar"}
                  width={104}
                  height={104}
                  className="h-[6.5rem] w-[6.5rem] rounded-full object-cover ring-4 ring-card"
                />
              ) : (
                <span className="flex h-[6.5rem] w-[6.5rem] items-center justify-center rounded-full bg-card font-display text-2xl font-bold text-primary ring-4 ring-card">
                  {initials(form.full_name)}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              aria-label="Change avatar"
              className="absolute bottom-0 right-0 rounded-full border border-border bg-card p-2.5 shadow-lift transition-all duration-300 ease-out-expo hover:scale-105 hover:border-primary/30 hover:text-primary disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatar}
            />
          </div>

          <div className="space-y-1">
            <p className="font-display text-lg font-bold tracking-tight">
              {form.full_name || "User"}
            </p>
            <p className="break-all text-sm text-muted-foreground">
              {profile.email}
            </p>
          </div>

          {profile.status && <Badge status={profile.status} />}

          {uploading && (
            <p className="text-xs text-muted-foreground">Uploading…</p>
          )}

          {profile.referral_code && (
            <div className="w-full text-left">
              {/* <Label>Your referral code</Label> */}
              {/* <div className="flex gap-2">
                <Input value={profile.referral_code} readOnly />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={copyCode}
                  aria-label="Copy referral code"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div> */}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit form */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <p className="text-sm text-muted-foreground">
            Keep your details up to date so we can reach you about wins.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="03xx-xxxxxxx"
                />
              </div>
              <div>
                <Label htmlFor="cnic">CNIC</Label>
                <Input
                  id="cnic"
                  value={form.cnic}
                  onChange={(e) => update("cnic", e.target.value)}
                  placeholder="xxxxx-xxxxxxx-x"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                  placeholder="Country"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="Street address"
                />
              </div>
            </div>

            <div className="border-t border-border/70 pt-5">
              <Label htmlFor="email-ro">Email</Label>
              <Input id="email-ro" value={profile.email ?? ""} readOnly disabled />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Your email address can&apos;t be changed here.
              </p>
            </div>

            <Button type="submit" loading={saving}>
              {!saving && <Save className="h-4 w-4" />}
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
