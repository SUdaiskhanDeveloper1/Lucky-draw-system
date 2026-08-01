"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";

/** Ensures the current caller is an authenticated admin. Throws otherwise. */
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (!admin) throw new Error("Not authorized");

  return { supabase, user };
}

export type ActionResult = { ok: boolean; error?: string };

/**
 * Permanently delete a user: removes the auth user (service role) which
 * cascades to the profile, plus a defensive profile delete.
 */
export async function deleteUser(userId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const admin = createAdminClient();

    // Delete auth user (cascades to profile via FK in most schemas).
    const { error: authErr } = await admin.auth.admin.deleteUser(userId);
    if (authErr) {
      // Fall back to at least removing the profile row.
      await admin.from("profiles").delete().eq("id", userId);
    }
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

/** Toggle a user's account status (active | suspended | banned). */
export async function setUserStatus(
  userId: string,
  status: "active" | "suspended" | "banned"
): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("profiles")
      .update({ status })
      .eq("id", userId);
    if (error) throw error;
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

/**
 * Approve a payment. A DB trigger auto-generates the ticket + notifications.
 */
export async function approvePayment(paymentId: string): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireAdmin();
    const { error } = await supabase
      .from("payments")
      .update({
        status: "approved",
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", paymentId);
    if (error) throw error;
    revalidatePath("/admin/payments");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

/** Reject a payment with a required reason stored in admin_note. */
export async function rejectPayment(
  paymentId: string,
  reason: string
): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireAdmin();
    const { error } = await supabase
      .from("payments")
      .update({
        status: "rejected",
        admin_note: reason,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", paymentId);
    if (error) throw error;
    revalidatePath("/admin/payments");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

/** Run the automatic random draw for a campaign. */
export async function drawWinners(
  campaignId: string,
  count?: number
): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.rpc("draw_winners", {
      p_campaign: campaignId,
      ...(count ? { p_count: count } : {}),
    });
    if (error) throw error;
    revalidatePath("/admin/winners");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}
