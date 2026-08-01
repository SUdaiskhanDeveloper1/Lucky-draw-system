"use client";

import { useState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-10 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
            <MailCheck className="h-7 w-7 text-success" />
          </div>
          <h2 className="text-xl font-semibold">Check your email</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            If an account exists for{" "}
            <span className="font-medium text-foreground">{email}</span>,
            you&apos;ll receive a link to reset your password.
          </p>
          <Link href="/login" className="mt-6">
            <Button variant="outline">Back to sign in</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Forgot password?</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            Send reset link
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
